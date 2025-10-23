# Big Bang Migration Plan: SDK Transaction → AlgoKit Transact

## Overview
Replace all SDK transaction classes with algokit_transact in a single coordinated refactoring. This is a complete replacement that will touch **60+ files** across the codebase.

---

## 🎯 Migration Strategy: Big Bang

**Approach:** Replace everything in one coordinated effort across all affected files simultaneously.

**Timeline:** 3-4 weeks of focused work

**Risk Level:** HIGH - Everything changes at once, but cleaner final result

---

## 📊 Key Architectural Changes

### Class-Based → Functional Architecture

| Aspect | SDK (Old) | AlgoKit Transact (New) |
|--------|-----------|------------------------|
| **Type** | `class Transaction` | `type Transaction` |
| **Construction** | `new Transaction({...})` | Plain object `{...}` |
| **Methods** | `txn.txID()` | `getTransactionId(txn)` |
| **Mutability** | Mutable (`txn.group = gid`) | Immutable (return new object) |
| **Address** | `Address` class | `string` |
| **TransactionType** | String enum (`'pay'`, `'keyreg'`) | Numeric enum (`0`, `1`, `2`) |

### Property Name Mapping

| SDK | AlgoKit Transact |
|-----|------------------|
| `txn` | `transaction` |
| `type` | `transactionType` |
| `paymentParams` | `payment` |
| `keyregParams` | `keyRegistration` |
| `assetConfigParams` | `assetConfig` |
| `assetTransferParams` | `assetTransfer` |
| `assetFreezeParams` | `assetFreeze` |
| `appCallParams` | `appCall` |
| `msig` | `multiSignature` |
| `lsig` | `logicSignature` |
| `sgnr` | `authAddress` |

### Method → Function Mapping

| SDK Method | AlgoKit Transact Function |
|-----------|---------------------------|
| `txn.txID()` | `getTransactionId(txn)` |
| `txn.rawTxID()` | `getTransactionIdRaw(txn)` |
| `txn.toByte()` | `encodeTransaction(txn)` |
| `txn.signTxn(sk)` | Custom signing logic needed |
| `txn.bytesToSign()` | `encodeTransactionRaw(txn)` |
| `txn.attachSignature()` | Create `SignedTransaction` object |
| `Transaction.fromEncodingData()` | `decodeTransaction()` |
| `encodeUnsignedTransaction()` | `encodeTransaction()` |
| `decodeUnsignedTransaction()` | `decodeTransaction()` |
| `decodeSignedTransaction()` | `decodeSignedTransaction()` |
| `assignGroupID(txns)` | `groupTransactions(txns)` |
| `computeGroupID(txns)` | Implicit in `groupTransactions()` |

---

## 📁 Files to Modify (By Priority)

### **PHASE 1: Core SDK Transaction Files (Delete & Replace)**

#### 1.1 Delete Old Implementation
- ❌ **DELETE:** `src/sdk/transaction.ts` (1500+ lines)
- ❌ **DELETE:** `src/sdk/signedTransaction.ts` (150+ lines)

#### 1.2 Update Exports
- 🔄 `src/sdk/index.ts` - Re-export from `@algorandfoundation/algokit-transact`

```typescript
// BEFORE:
export { Transaction } from './transaction.js'
export { SignedTransaction, decodeSignedTransaction } from './signedTransaction.js'

// AFTER:
export {
  Transaction,
  SignedTransaction,
  TransactionType,
  encodeTransaction,
  decodeTransaction,
  encodeSignedTransaction,
  decodeSignedTransaction,
  getTransactionId,
  getTransactionIdRaw,
  groupTransactions,
  assignFee,
  calculateFee
} from '@algorandfoundation/algokit-transact'
```

---

### **PHASE 2: Transaction Construction (11 files)**

#### 2.1 🔥 `src/sdk/makeTxn.ts` - MAJOR REFACTOR
**Complexity:** HIGH (892 lines, 15 functions)

**Changes Required:**
1. Change all `new Transaction({...})` to plain object construction
2. Map `type: TransactionType.pay` → `transactionType: TransactionType.Payment`
3. Map nested params: `paymentParams: {...}` → `payment: {...}`
4. Convert `Address` objects to strings
5. Add required fields: `firstValid`, `lastValid`, `genesisHash`, `genesisId`
6. Handle fee calculation with `assignFee()`

**Example Transformation:**
```typescript
// BEFORE:
export function makePaymentTxnWithSuggestedParamsFromObject({
  sender, receiver, amount, closeRemainderTo, suggestedParams, note, lease, rekeyTo
}: PaymentTransactionParams): Transaction {
  return new Transaction({
    type: TransactionType.pay,
    sender,
    note,
    lease,
    rekeyTo,
    suggestedParams,
    paymentParams: { receiver, amount, closeRemainderTo }
  });
}

// AFTER:
export function makePaymentTxnWithSuggestedParamsFromObject({
  sender, receiver, amount, closeRemainderTo, suggestedParams, note, lease, rekeyTo
}: PaymentTransactionParams): Transaction {
  return assignFee({
    transactionType: TransactionType.Payment,
    sender: Address.toString(sender),
    firstValid: BigInt(suggestedParams.firstRound),
    lastValid: BigInt(suggestedParams.lastRound),
    genesisHash: suggestedParams.genesisHash,
    genesisId: suggestedParams.genesisID,
    note,
    lease,
    rekeyTo: rekeyTo ? Address.toString(rekeyTo) : undefined,
    payment: {
      receiver: Address.toString(receiver),
      amount: BigInt(amount),
      closeRemainderTo: closeRemainderTo ? Address.toString(closeRemainderTo) : undefined
    }
  }, {
    feePerByte: BigInt(0),
    minFee: BigInt(suggestedParams.fee)
  });
}
```

**Affected Functions:**
- `makePaymentTxnWithSuggestedParamsFromObject`
- `makeKeyRegistrationTxnWithSuggestedParamsFromObject`
- `makeBaseAssetConfigTxn`
- `makeAssetCreateTxnWithSuggestedParamsFromObject`
- `makeAssetConfigTxnWithSuggestedParamsFromObject`
- `makeAssetDestroyTxnWithSuggestedParamsFromObject`
- `makeAssetFreezeTxnWithSuggestedParamsFromObject`
- `makeAssetTransferTxnWithSuggestedParamsFromObject`
- `makeApplicationCallTxnFromObject`
- `makeApplicationCreateTxnFromObject`
- `makeApplicationUpdateTxnFromObject`
- `makeApplicationDeleteTxnFromObject`
- `makeApplicationOptInTxnFromObject`
- `makeApplicationCloseOutTxnFromObject`
- `makeApplicationClearStateTxnFromObject`
- `makeApplicationNoOpTxnFromObject`

#### 2.2 🔥 `src/sdk/group.ts` - MAJOR REFACTOR
**Complexity:** MEDIUM (50 lines)

**Changes:**
```typescript
// BEFORE:
export function computeGroupID(txns: ReadonlyArray<Transaction>) {
  const hashes: Uint8Array[] = [];
  for (const txn of txns) {
    hashes.push(txn.rawTxID());
  }
  const toBeHashed = txGroupPreimage(hashes);
  const gid = nacl.genericHash(toBeHashed);
  return Uint8Array.from(gid);
}

export function assignGroupID(txns: Transaction[]) {
  const gid = computeGroupID(txns);
  for (const txn of txns) {
    txn.group = gid;  // MUTATION!
  }
  return txns;
}

// AFTER:
export function computeGroupID(txns: ReadonlyArray<Transaction>): Uint8Array {
  // Extract group ID from first transaction after grouping
  const grouped = groupTransactions([...txns]);
  return grouped[0].group!;
}

export function assignGroupID(txns: Transaction[]): Transaction[] {
  return groupTransactions(txns);
}
```

#### 2.3 🔥 `src/sdk/signing.ts` - MAJOR REFACTOR
**Complexity:** MEDIUM (100+ lines)

**Changes:**
1. Replace `txn.txID()` → `getTransactionId(txn)`
2. Replace signing logic to construct `SignedTransaction` objects
3. Handle `authAddress` for rekeyed accounts

```typescript
// BEFORE:
export function signLogicSigTransactionWithAddress(
  txn: Transaction,
  lsig: LogicSig,
  signerAddr: Address
): SignedTransaction {
  const sig = txn.rawSignTxn(lsig.sig);
  return new SignedTransaction({
    txn,
    lsig,
    sgnr: signerAddr
  });
}

// AFTER:
export function signLogicSigTransactionWithAddress(
  txn: Transaction,
  lsig: LogicSig,
  signerAddr: string
): SignedTransaction {
  return {
    transaction: txn,
    logicSignature: {
      logic: lsig.logic,
      args: lsig.args,
      signature: lsig.signature,
      multiSignature: lsig.multiSignature
    },
    authAddress: signerAddr !== txn.sender ? signerAddr : undefined
  };
}
```

#### 2.4 🔥 `src/sdk/multisigSigning.ts` - MAJOR REFACTOR
**Complexity:** HIGH (300+ lines, multisig logic)

**Changes:**
1. Replace `new SignedTransaction({...})` with plain objects
2. Update `decodeMsgpack(blob, SignedTransaction)` → `decodeSignedTransaction(blob)`
3. Update multisig structure: `msig` → `multiSignature`
4. Update subsignature structure

```typescript
// BEFORE:
return new SignedTransaction({
  txn,
  msig: {
    v: version,
    thr: threshold,
    subsig: subsignatures
  }
});

// AFTER:
return {
  transaction: txn,
  multiSignature: {
    version,
    threshold,
    subsignatures
  }
};
```

#### 2.5 🔥 `src/sdk/signer.ts` - MODERATE REFACTOR
**Complexity:** MEDIUM (200+ lines)

**Changes:**
1. Update `TransactionSigner` type signature
2. Replace `encodeUnsignedSimulateTransaction` calls
3. Update signing logic

```typescript
// BEFORE:
export type TransactionSigner = (
  txnGroup: Transaction[],
  indexesToSign: number[]
) => Promise<Uint8Array[]>;

// AFTER: (Same signature, but different Transaction type)
export type TransactionSigner = (
  txnGroup: Transaction[],
  indexesToSign: number[]
) => Promise<Uint8Array[]>;
```

#### 2.6 🔥 `src/sdk/composer.ts` - CRITICAL REFACTOR
**Complexity:** CRITICAL (1000+ lines, most complex file)

**Major Changes:**
1. Replace `Transaction` class references with type
2. Replace `SignedTransaction` class references with type
3. Update `decodeMsgpack(stxn, SignedTransaction)` → `decodeSignedTransaction(stxn)`
4. Update `Transaction.fromEncodingData()` → `decodeTransaction()`
5. Replace `txn.txID()` → `getTransactionId(txn)`
6. Update property access: `stxn.txn` → `stxn.transaction`
7. Update ABI method call logic
8. Update simulation logic

**Key Sections:**
- `addTransaction()` - Update transaction handling
- `buildGroup()` - Replace `assignGroupID()` call
- `execute()` - Update signed transaction handling
- `simulate()` - Update simulation logic
- ABI method encoding/decoding

#### 2.7 🔄 `src/sdk/abi/transaction.ts` - MINOR UPDATE
**Complexity:** LOW (50 lines)

```typescript
// BEFORE:
export function abiCheckTransactionType(
  type: ABITransactionType,
  txn: Transaction
): boolean {
  return txn.type === type;
}

// AFTER:
export function abiCheckTransactionType(
  type: ABITransactionType,
  txn: Transaction
): boolean {
  // Map string types to numeric enum
  const typeMap = {
    'pay': TransactionType.Payment,
    'keyreg': TransactionType.KeyRegistration,
    // ...
  };
  return txn.transactionType === typeMap[type];
}
```

#### 2.8 🔥 `src/sdk/types/block.ts` - MAJOR REFACTOR
**Complexity:** HIGH (1200+ lines, encoding schemas)

**Changes:**
1. Remove `SignedTransaction.encodingSchema` references
2. Create custom encoding/decoding for `SignedTxnWithAD`
3. Update `SignedTransaction.fromEncodingData()` calls
4. Map between DTO and transaction types

```typescript
// BEFORE:
export const signedTxnWithADSchema = new NamedMapSchema({
  stxn: { valueSchema: SignedTransaction.encodingSchema },
  // ...
});

// AFTER:
export const signedTxnWithADSchema = {
  encode(obj: SignedTxnWithAD): Uint8Array {
    return encodeSignedTransaction(obj.signedTxn);
  },
  decode(data: Uint8Array): SignedTxnWithAD {
    return {
      signedTxn: decodeSignedTransaction(data),
      // ...
    };
  }
};
```

#### 2.9 🔄 `src/sdk/client/kmd.ts` - MINOR UPDATE
**Complexity:** LOW (Type annotations only)

Update type annotations from class to type.

---

### **PHASE 3: Higher-Level Utilities (6 files)**

#### 3.1 `src/transaction/perform-atomic-transaction-composer-simulate.ts`
**Changes:**
- Update `decodeMsgpack(txn, SignedTransaction)` → `decodeSignedTransaction(txn)`
- Update property access patterns

#### 3.2 `src/testing/transaction-logger.ts`
**Changes:**
- `decodeSignedTransaction()` already compatible
- Update property access: `stxn.txn` → `stxn.transaction`

#### 3.3 `src/account/account.ts`
**Changes:**
- Update type annotations
- Update any transaction construction code

#### 3.4 `src/types/transaction.ts`
**Changes:**
- Update type definitions
- Re-export types from algokit_transact

#### 3.5 `src/types/account-manager.ts`
**Changes:**
- Update type annotations

#### 3.6 `src/types/algorand-client.ts`
**Changes:**
- Update type annotations

---

### **PHASE 4: AlgoKit Utils Integration (Already Using New Types)**

Good news! The following files **already import from `@algorandfoundation/algokit-transact`**:

✅ `algokit_utils/src/transactions/common.ts`
✅ `algokit_utils/src/transactions/creator.ts`
✅ `algokit_utils/src/transactions/payment.ts`
✅ `algokit_utils/src/transactions/app-call.ts`
✅ `algokit_utils/src/transactions/asset-config.ts`
✅ `algokit_utils/src/transactions/asset-freeze.ts`
✅ `algokit_utils/src/transactions/asset-transfer.ts`
✅ `algokit_utils/src/transactions/key-registration.ts`

**Action:** Verify these files work correctly with the migration.

---

### **PHASE 5: Client Models (7 files)**

These files already use `@algorandfoundation/algokit-transact` types:

✅ `algod_client/src/models/pending-transaction-response.ts`
✅ `algod_client/src/models/signed-txn-in-block.ts`
✅ `algod_client/src/models/simulate-request-transaction-group.ts`
✅ `algod_client/src/models/get-pending-transactions-by-address.ts`
✅ `algod_client/src/models/get-pending-transactions.ts`
✅ `algod_client/src/models/dryrun-request.ts`

**Action:** Verify compatibility, no changes likely needed.

---

### **PHASE 6: Test Files (17+ files)**

#### 6.1 SDK Tests
Update all tests in `src/sdk/` that use Transaction/SignedTransaction:
- Update construction patterns
- Update method calls to function calls
- Update assertions
- Update property access patterns

#### 6.2 AlgoKit Utils Tests
Verify tests in `algokit_utils/tests/`:
- Already using new types
- May need minor updates for compatibility

---

### **PHASE 7: Type Definitions & Interfaces (50+ files)**

Files with Transaction/SignedTransaction type annotations only:
- Update import statements
- No logic changes needed
- Run type checker to verify

---

## 🛠️ Implementation Checklist

### Pre-Migration
- [x] Create feature branch: `feat/spike-sdk` (already on this branch)
- [ ] Ensure all tests pass on main branch
- [x] Create backup/tag of current state (backups in `.backup-phase1/`)
- [ ] Document current test coverage metrics

### Core Migration
- [x] **Phase 1:** Delete old files, update exports (2 hours) ✅ **COMPLETED**
  - Deleted `src/sdk/transaction.ts` and `src/sdk/signedTransaction.ts`
  - Updated `src/sdk/index.ts` to import from `algokit_transact`
  - Built algokit_transact package
  - Verified TypeScript compilation (down to 3 test-only errors)
- [x] **Phase 2.1:** Refactor `makeTxn.ts` (16 hours) ✅ **COMPLETED**
  - Refactored all 15+ transaction creation functions
  - Converted from `new Transaction()` to plain object construction
  - Mapped TransactionType enums (pay→Payment, keyreg→KeyRegistration, etc.)
  - Added helper functions for Address→string and bigint conversions
  - Mapped OnApplicationComplete enums with helper function
  - All functions now use `assignFee()` from algokit_transact
  - Zero TypeScript errors
- [x] **Phase 2.2:** Refactor `group.ts` (2 hours) ✅ **COMPLETED**
  - Replaced `txn.rawTxID()` with `getTransactionIdRaw(txn)`
  - Updated `assignGroupID` to use immutable `groupTransactions()` function
  - Removed mutation logic (no longer modifying txn.group directly)
  - Zero TypeScript errors
- [x] **Phase 2.3:** Refactor `signing.ts` (4 hours) ✅ **COMPLETED**
  - Updated imports to use algokit_transact types
  - Refactored `signLogicSigTransactionWithAddress` to create plain SignedTransaction objects
  - Converted LogicSig to LogicSignature structure
  - Updated address comparisons (Address class → string)
  - Zero TypeScript errors
- [x] **Phase 2.4:** Refactor `multisigSigning.ts` (8 hours) ✅ **COMPLETED**
  - Refactored `createMultisigTransaction` to use new MultisigSignature type
  - Updated `createMultisigTransactionWithSignature` with immutable approach
  - Refactored `partialSignTxn` to use `encodeTransactionRaw` and nacl.sign
  - Refactored `mergeMultisigTransactions` with new property names (msig→multiSignature, sgnr→authAddress)
  - Converted from mutation to immutable object creation
  - Zero TypeScript errors
- [x] **Phase 2.5:** Refactor `signer.ts` (4 hours) ✅ **COMPLETED**
  - Updated imports and type references
  - Refactored `makeBasicAccountTransactionSigner` to manually sign with nacl
  - Other signers work as-is since they use helper functions
  - Zero TypeScript errors
- [ ] **Phase 2.6:** Refactor `composer.ts` (24 hours) ⚠️ CRITICAL
- [ ] **Phase 2.7:** Update `abi/transaction.ts` (1 hour)
- [ ] **Phase 2.8:** Refactor `types/block.ts` (8 hours)
- [ ] **Phase 2.9:** Update `client/kmd.ts` (1 hour)

### Higher-Level Migration
- [ ] **Phase 3:** Update 6 utility files (6 hours)
- [ ] **Phase 4:** Verify algokit_utils integration (4 hours)
- [ ] **Phase 5:** Verify client models (2 hours)

### Testing
- [ ] **Phase 6:** Update all test files (24 hours)
- [ ] Run full test suite
- [ ] Fix failing tests
- [ ] Verify encoding compatibility
- [ ] Verify transaction IDs match
- [ ] Verify group IDs match
- [ ] Integration testing with real network

### Finalization
- [ ] Update documentation
- [ ] Update CHANGELOG
- [ ] Code review
- [ ] Merge to main

---

## ⏱️ Time Estimates

| Phase | Hours | Days (8hr) |
|-------|-------|------------|
| Phase 1: Exports | 2 | 0.25 |
| Phase 2: Core SDK | 68 | 8.5 |
| Phase 3-5: Integration | 12 | 1.5 |
| Phase 6: Tests | 24 | 3 |
| Phase 7: Type Updates | 8 | 1 |
| Bug Fixes & Polish | 16 | 2 |
| **TOTAL** | **130** | **16.25** |

**Calendar Time:** 3-4 weeks (accounting for reviews, blockers, unexpected issues)

---

## ⚠️ Critical Risks

### 1. **Composer.ts Complexity**
- 1000+ lines of complex ABI logic
- Deep integration with Transaction class
- High risk of subtle bugs

**Mitigation:**
- Extensive unit tests
- Manual testing of ABI calls
- Incremental refactoring with commits

### 2. **Encoding Compatibility**
- Must produce identical msgpack bytes
- Transaction IDs must match exactly
- Group IDs must match exactly

**Mitigation:**
- Comparison tests between old/new
- Hex dump verification
- Network testing

### 3. **Address Handling**
- Address class → string everywhere
- Risk of validation bugs
- Risk of comparison bugs

**Mitigation:**
- Helper functions for conversion
- Careful testing of address operations

### 4. **Immutability Changes**
- Code expects mutation (e.g., `txn.group = gid`)
- Need to return new objects
- Risk of missing updates

**Mitigation:**
- Search for all mutation patterns
- Refactor to functional style
- ESLint rules to prevent mutation

---

## 🎯 Success Criteria

✅ All existing tests pass
✅ No new TypeScript errors
✅ Transaction encoding is byte-identical to old SDK
✅ Transaction IDs match old SDK output
✅ Group IDs match old SDK output
✅ Signatures verify correctly
✅ ABI method calls work correctly
✅ Multisig transactions work correctly
✅ Logic sig transactions work correctly
✅ Performance is equivalent or better
✅ Code coverage maintained or improved

---

## 🚀 Execution Plan

1. **Week 1:** Core SDK files (Phases 1-2)
2. **Week 2:** Composer, Block types (Phase 2.6-2.8)
3. **Week 3:** Integration, Tests (Phases 3-6)
4. **Week 4:** Polish, Bug Fixes, Review

This is a **big bang** approach - everything changes together in one PR. High risk but cleaner result.
