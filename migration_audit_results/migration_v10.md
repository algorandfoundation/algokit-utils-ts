# 🚀 Ultimate AlgoKit Utils v10 Migration Guide

This guide documents the definitive path from v9 to v10. This is a "Decoupled" release where AlgoKit moves to native implementations, reducing dependency on `algosdk`.

---

## 1. Executive Summary: The "Decoupling"

The primary shift in v10 is the **removal of `algosdk` as a hard dependency**. AlgoKit now uses native TypeScript implementations for transactions, ABI handling, and client interactions.

> **Critical Note:** While you can still use `algosdk` alongside AlgoKit, they are no longer interchangeable in memory. You must bridge them using the methods in Section 6.

---

## 2. Global Naming & Structural Changes

### Standardized Property Names

Properties have been renamed to be more idiomatic and match the Algorand protocol standards.

| v9 Property (SDK Style) | v10 Property (AlgoKit Style) | Context                    |
| :---------------------- | :--------------------------- | :------------------------- |
| `index`                 | `id`                         | Asset IDs and App IDs      |
| `txID`                  | `txId`                       | Transaction identifiers    |
| `axfer`                 | `AssetTransfer`              | Transaction Type Enums     |
| `applicationCall`       | `appCall`                    | Transaction field names    |
| `applicationIndex`      | `appId`                      | Confirmations / References |
| `from`                  | `sender`                     | Transaction objects        |
| `to`                    | `receiver`                   | Transaction objects        |

### Flattened Imports

Deep directory imports (e.g., `/types/`, `/account/`) have been removed.

- **Before:** `import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'`
- **After:** `import { AppSpec } from '@algorandfoundation/algokit-utils'`

---

## 3. Account Management (The AccountManager)

The standalone `getAccount` function is **Deprecated**. All account logic is now centralized in the stateful `AccountManager`.

### Registering and Accessing Signers

The Manager tracks signers for you. Once an account is loaded, the Manager knows how to sign for that address automatically.

```ts
// v9
const account = await getAccount('MY_ACCOUNT', algod)

// v10 (Manager Pattern)
const account = await algorand.account.fromEnvironment('MY_ACCOUNT')
const randomAccount = algorand.account.random()
```

### Rekeying & Funding

Managed operations now automatically update the internal signer registry.

```ts
// Rekeying automatically updates the manager's signer for 'ORIGINAL_ADDR'
await algorand.account.rekeyAccount({
  account: 'ORIGINAL_ADDR',
  rekeyTo: 'NEW_SIGNER_ADDR',
})

// Funding is now a manager method
await algorand.account.ensureFunded('ADDR', 'DISPENSER', algokit.algo(1))
```

---

## 4. API Client Modernization

### Removal of .do()

Algod, Indexer, and KMD client methods now return Promises directly. Remove all .do() suffixes.

```ts
// v9
const status = await algorand.client.algod.status().do()

// v10
const status = await algorand.client.algod.status()
```

### Simplified Method Names

The "get" prefix has been removed from common helper methods.

- `getTransactionParams()` → `transactionParams()`
- `getSuggestedParams()` → `suggestedParams()`

---

## 5. Smart Contract Interactions (AppClient / AppFactory)

### ARC-56 and Structs

v10 treats ARC-56 structs as first-class objects. You must pass structured objects rather than raw primitives.

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

```ts
// v10 Structure
{
  appCall: {
    boxReferences: [{ appId: 0n, name: encoder.encode('1') }]
  }
}
```

---

## 6. ABI & Transaction Bridging

### Native ABI Type Construction

Stop using algosdk ABI classes. Use the native ABIType factory.

```ts
// v9
const uint32Type = new algosdk.ABIUintType(32)

// v10
import { ABIType } from '@algorandfoundation/algokit-abi'
const uint32Type = ABIType.from('uint32')
```

### The Transaction Bridge (Frontend & Wallets)

If you use @txnlab/use-wallet, you must bridge v10 transactions to SDK transactions before signing.

```ts
import { algokitTxnToSdk } from '@algorandfoundation/algokit-utils/transact'

const v10Txn = await algorand.createTransaction.payment({ ... })
const sdkTxn = algokitTxnToSdk(v10Txn)

await activeWallet.signTransactions([sdkTxn])
```

---

## 7. TypeScript Strictness & Index Signatures

### Solving the token Type Mismatch

If you extend AlgoClientConfig, you must use Record<string, string> for tokens to satisfy the index signature.

```ts
import { AlgoClientConfig } from '@algorandfoundation/algokit-utils'

export interface MyViteConfig extends AlgoClientConfig {
  server: string
  port: string | number
  token: string | Record<string, string> // NOT 'TokenHeader'
}
```

---

## 8. Agent "One-Shot" Cheat Sheet

For AI agents (Cursor, ChatGPT, Claude) to perform a "One-Shot" migration:

| Search Pattern | Replace With | Action |
| :------------- | :----------- | :----- |
| `\.do\(\)` | `(empty)` | Remove all .do() calls. |
| `from:` | `sender:` | Update transaction object keys. |
| `to:` | `receiver:` | Update transaction object keys. |
| `applicationIndex` | `appId` | Rename in confirmations and tests. |
| `getAccount(` | `algorand.account.fromEnvironment(` | Shift to Manager pattern. |
| `.getTransactionParams()` | `.transactionParams()` | Fix client method name. |
| `OnApplicationComplete\.(.*)OC` | `OnApplicationComplete.$1` | Remove 'OC' suffix from Enums. |

---

## 9. Post-Migration Checklist

- Grep Check: Run `grep -r ".do()" src/`.
- Enum Check: Ensure `OnApplicationComplete.OptInOC` is now `OnApplicationComplete.OptIn`.
- Generator Update: Update `@algorandfoundation/algokit-client-generator` to `^6.0.0` to generate v10-compatible clients.
- Build Check: Run `npm run build` to verify all index signatures in config files.
