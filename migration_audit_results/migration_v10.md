# AlgoKit Utils v10 Migration Guide

This guide documents the breaking changes and required code updates for migrating from AlgoKit Utils v9 to v10.

---

## 1. Executive Summary: The "Decoupling"

The primary shift in v10 is the **removal of `algosdk` as a hard dependency**. AlgoKit now uses native TypeScript implementations for transactions, ABI handling, and client interactions.

> **Critical Note:** While you can still use `algosdk` alongside AlgoKit, they are no longer interchangeable in memory. You must bridge them using the methods described in Section 5.

---

## 2. Global Naming & Structural Changes

### Standardized Property Names

We have renamed properties to be more idiomatic and consistent across the library.

| v9 Property (SDK Style) | v10 Property (AlgoKit Style) | Context                    |
| :---------------------- | :--------------------------- | :------------------------- |
| `index`                 | `id`                         | Asset IDs and App IDs      |
| `txID`                  | `txId`                       | Transaction identifiers    |
| `axfer`                 | `AssetTransfer`              | Transaction Type Enums     |
| `applicationCall`       | `appCall`                    | Transaction field names    |
| `applicationIndex`      | `appId`                      | Confirmations / References |

### Flattened Imports

Deep directory imports have been removed. Additionally, internal configuration paths have shifted.

- **Before:** `import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'`
- **After:** `import { AppSpec } from '@algorandfoundation/algokit-utils'`
- **Config Shift:** `types/config` $\rightarrow$ `updatable-config`

---

## 3. Account Management (The AccountManager)

The standalone `getAccount` function is **Deprecated**. All account logic is now centralized in the `AccountManager`, which tracks signers automatically.

### Creating & Loading Accounts

Accounts no longer return raw `algosdk.Account` objects. They return `AddressWithTransactionSigner`.

```ts
// v9
const account = await getAccount('MY_ACCOUNT', algod)

// v10 (Manager Pattern)
const account = await algorand.account.fromEnvironment('MY_ACCOUNT')
const randomAccount = algorand.account.random() // Synchronous!
```

### Rekeying

Rekeying is now a managed operation that automatically updates the signer registry in the manager.

TypeScript

```ts
// v10
await algorand.account.rekeyAccount({
  account: 'ORIGINAL_ADDR',
  rekeyTo: 'NEW_SIGNER_ADDR',
})
```

### Ensure Funded (Consolidated)

The "Ensure Funded" logic has moved from standalone utilities to the manager.

TypeScript

```ts
// v10
await algorand.account.ensureFunded('ADDR', 'DISPENSER', algokit.algo(1))
```

---

## 4. AlgorandClient & Managers

### Synchronous Client Initialization

Client getters (Factories/AppClients) no longer need to be awaited.

TypeScript

```ts
// v9
const factory = await algorand.client.getAppFactory({ ... })

// v10
const factory = algorand.client.getAppFactory({ ... })
```

### Removal of .do()

The Algod, Indexer, and KMD clients now return Promises directly.

TypeScript

```ts
// v9
const status = await algorand.client.algod.status().do()

// v10
const status = await algorand.client.algod.status()
```

---

## 5. Smart Contract Interactions (AppClient / AppFactory)

### ARC-56 and Structs

v10 treats ARC-56 structs as first-class objects. You must pass structured objects rather than raw primitives.

TypeScript

```ts
// v9
await appClient.send.call({ method: 'setValue', args: [1, 'hello'] })

// v10
await appClient.send.call({
  method: 'setValue',
  args: [1, { x: { a: 'hello' } }],
})
```

### Transaction References (Boxes)

The boxes property is now boxReferences, and internal fields use appId.

TypeScript

```ts
// v9
{
  applicationCall: {
    boxes: [{ appIndex: 0n, name: '...' }]
  }
}

// v10
{
  appCall: {
    boxReferences: [{ appId: 0n, name: '...' }]
  }
}
```

---

## 6. ABI & Transaction Bridging

### Native ABI Type Construction

Stop using algosdk ABI classes. Use the native ABIType factory.

TypeScript

```ts
// v9
const uint32Type = new algosdk.ABIUintType(32)

// v10
import { ABIType } from '@algorandfoundation/algokit-abi'
const uint32Type = ABIType.from('uint32')
```

### The Transaction Bridge

To pass an existing algosdk.Transaction to an AlgoKit v10 function, encode and decode it:

TypeScript

```ts
import * as algosdk from "algosdk";
import { decodeTransaction } from "@algorandfoundation/algokit-utils/transact";

// Bridge: SDK -> v10
const sdkTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({...});
const v10Txn = decodeTransaction(algosdk.encodeMsgpack(sdkTxn));
```

---

## 7. Testing & Troubleshooting

### Error Assertions

Check the message property instead of the stack for error assertions.

TypeScript

```ts
// v9
expect(e.stack).toContain('assert failed')

// v10
expect(e.message).toContain('assert failed')
```

### Transaction Type Enums

Use full descriptive names for transaction types in assertions.

TypeScript

```ts
// v9
expect(txn.type).toBe(TransactionType.pay)

// v10
expect(txn.type).toBe(TransactionType.Payment)
```
