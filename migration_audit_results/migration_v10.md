# 🚀 Ultimate AlgoKit Utils v10 Migration Guide

This guide documents the definitive path from v9 to v10. Version 10 is a "Decoupled" release where AlgoKit moves to native implementations, reducing dependency on `algosdk`.

---

## 1. Installation (Alpha Strategy)

Because v10 is currently in alpha and the client generator has peer dependency lags, you must install using specific tags and flags.

```bash
npm install @algorandfoundation/algokit-utils@10.0.0-alpha.32 @algorandfoundation/algokit-client-generator@^6.0.0-beta.1 --legacy-peer-deps
```

Why `--legacy-peer-deps`? The generator (v6 beta) may still list v9 utils as a peer dependency. This flag bypasses the conflict during the transition period.

---

## 2. Global Naming & Structural Changes

### Standardized Property Names

Properties have been renamed to be more idiomatic and match Algorand protocol standards.

| v9 Property (SDK Style) | v10 Property (AlgoKit Style) | Context                          |
| ----------------------- | ---------------------------- | -------------------------------- |
| index                   | id                           | Asset IDs and App IDs            |
| txID                    | txId                         | Transaction identifiers          |
| axfer                   | AssetTransfer                | Transaction type enums           |
| applicationCall         | appCall                      | Transaction field names          |
| applicationIndex        | appId                        | Confirmations / references       |
| from                    | sender                       | Transaction objects (v10 native) |
| to                      | receiver                     | Transaction objects (v10 native) |

### Flattened Imports

Deep directory imports are removed.

```ts
// Before
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'

// After
import { AppSpec } from '@algorandfoundation/algokit-utils'
```

---

## 3. Account Management (The AccountManager)

The standalone `getAccount` function is deprecated. Use the stateful `AccountManager` via `algorand.account`.

```ts
// v10 (Manager Pattern)
const account = await algorand.account.fromEnvironment('MY_ACCOUNT')
const random = algorand.account.random() // Synchronous
```

---

## 4. API Client & Indexer Modernization

### Removal of `.do()`

Algod, Indexer, and KMD client methods now return Promises directly.

### Indexer Search Changes

The functional chaining pattern for indexer searches has been replaced by a configuration object. This prevents long import chains.

```ts
// v9: Functional Chaining
await indexer.searchTransactions((s) => s.txType('pay').limit(5)).do()

// v10: Config Object
await indexer.searchTransactions({
  txType: TransactionType.Payment,
  limit: 5,
})
```

### Method Renaming

- `getTransactionParams()` → `transactionParams()`
- `getSuggestedParams()` → `suggestedParams()`

---

## 5. Composer & Transactions (Advanced)

### Removal of AtomicTransactionComposer (ATC)

v10 removes the SDK's AtomicTransactionComposer in favor of a native Composer.

### Behavior Changes

- Resource population: Calling `.build()` on the composer now automatically populates resources (boxes, foreign apps) before simulation/sending.
- Parsing returns: `atc.parseMethodResponse` is replaced by `AppManager.getABIReturn`.

### Transaction Fees

In v10, fees are not calculated during transaction construction (the constructor). They are calculated during the Composer build step.

This means you do not always need to pass `suggestedParams` manually if using the Manager/Composer workflow.

---

## 6. Smart Contract Interactions

### ARC-56 and Structs

v10 treats ARC-56 structs as first-class objects. Pass structured objects, not raw primitives.

```ts
// v10
await appClient.send.call({
  method: 'setValue',
  args: [1, { x: { a: 'hello' } }],
})
```

### Helper Changes

- `getArc56Method` → `getABIMethod`
- `getABIDecodedValue` no longer handles structs implicitly (must use ARC-56 types).

---

## 7. Wallet Integration (use-wallet)

Frontend wallets (like Pera/Defly) often require `algosdk` objects. You have two strategies:

### Strategy A: The "Reverse Bridge" (Compatibility Mode)

Best for migrating existing components. Build using the SDK, but convert to v10 if you need to use AlgoKit utilities.

```ts
import * as algosdk from 'algosdk'
import { decodeTransaction } from '@algorandfoundation/algokit-utils/transact'

// 1. Build using SDK (Legacy pattern)
const sdkTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
  from: activeAddress,
  to: receiverAddress,
  amount: algokit.algo(1).microAlgos,
  suggestedParams,
})

// 2. Bridge to v10 (If you need to log it or check IDs)
const v10Txn = decodeTransaction(algosdk.encodeMsgpack(sdkTxn))

// 3. Sign using the SDK object
await transactionSigner([sdkTxn], [0])
```

### Strategy B: The v10-Native Way

Best for new code. Build in v10, bridge to SDK only for signing.

```ts
import { encodeTransactionRaw } from "@algorandfoundation/algokit-utils/transact";

// 1. Create v10 native transaction
const v10Txn = await algorand.createTransaction.payment({ ... });

// 2. Bridge to SDK (Encode v10 -> Decode to SDK)
const sdkTxn = algosdk.decodeUnsignedTransaction(encodeTransactionRaw(v10Txn));

// 3. Sign
await activeWallet.signTransactions([sdkTxn]);
```

---

## 8. TypeScript Strictness & Configuration

### Solving TokenHeader vs Record

v10 uses a strict dictionary for tokens. You cannot assign an SDK `TokenHeader` type to a v10 `AlgoClientConfig`.

The fix: redefine your local interface to use `Record<string, string>`.

```ts
// src/interfaces/network.ts
export interface AlgoViteClientConfig {
  server: string
  port: string | number
  // Use Record to satisfy v10 index signature
  token: string | Record<string, string>
  network: string
}
```

### Buffer Polyfill (Browser Apps)

Since v10 removes `algosdk` (which often polyfilled Buffer for you), you may see "Buffer is not defined" in Vite/React apps.

Fix: Ensure `vite-plugin-node-polyfills` is enabled and configured to polyfill Buffer.

---

## 9. Agent "One-Shot" Cheat Sheet

Copy this table for your AI agent (Cursor/Claude) to ensure a high-accuracy migration.

| Search Pattern                    | Replace With                         | Action                              |
| --------------------------------- | ------------------------------------ | ----------------------------------- |
| `\.do\(\)`                        | (empty)                              | Remove all `.do()` suffixes.        |
| `from:`                           | `sender:`                            | Update transaction keys (v10 only). |
| `to:`                             | `receiver:`                          | Update transaction keys (v10 only). |
| `applicationIndex`                | `appId`                              | Rename in confirmations.            |
| `getAccount\(`                    | `algorand.account.fromEnvironment\(` | Shift to manager pattern.           |
| `\.getTransactionParams\(\)`      | `.transactionParams()`               | Fix client method name.             |
| `TokenHeader`                     | `Record<string, string>`             | Fix TS interface errors.            |
| `indexer.searchTransactions(s =>` | `indexer.searchTransactions({`       | Switch to config object.            |
| `OnApplicationComplete\.(.*)OC`   | `OnApplicationComplete.$1`           | Remove `OC` suffix.                 |

---

## 10. Post-Migration Checklist

- Grep check: `rg "\.do\(\)" src/` (should return 0).
- Build check: `npm run build` (should pass with no index signature errors).
- Generator: Ensure `@algorandfoundation/algokit-client-generator` is `^6.0.0` or higher.
- Environment: Ensure any KMD or client configs have all required properties (including `network` if extending interfaces).
