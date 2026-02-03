# 🚀 AlgoKit Utils v10 Migration Guide

This document is the definitive guide for migrating from AlgoKit Utils v9 to v10.
v10 is a "Decoupled" release: AlgoKit now uses native TypeScript implementations for transactions and ABI handling, removing the hard dependency on `algosdk`.

> **Critical Note:** While you can still use `algosdk` alongside AlgoKit, they are no longer interchangeable in memory. You must bridge them using the methods described in Section 6.

---

## 1. Installation (Alpha Strategy)

Because v10 is currently in alpha and the client generator has peer dependency lags, you must install using specific tags and flags.

```bash
npm install @algorandfoundation/algokit-utils@10.0.0-alpha.32 @algorandfoundation/algokit-client-generator@^6.0.0-beta.1 --legacy-peer-deps
```

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

The standalone `getAccount` function and `algosdk.Account` class are deprecated. Use the stateful `AccountManager` via `algorand.account`.

```ts
// v9
const account = await getAccount('MY_ACCOUNT', algod)

// v10 (Manager Pattern)
const account = await algorand.account.fromEnvironment('MY_ACCOUNT')
const random = algorand.account.random() // Synchronous
```

---

## 4. API Client Modernization

### Removal of `.do()`

Algod, Indexer, and KMD client methods now return Promises directly.

```ts
// v10
const status = await algorand.client.algod.status()
```

### Method Renaming

The "get" prefix has been removed from helper methods.

- `getTransactionParams()` → `transactionParams()`
- `getSuggestedParams()` → `suggestedParams()`

### Legacy Client Converters

If you have legacy code that requires an `algosdk.Algodv2` client, you can wrap the v10 client:

```ts
import * as algosdk from 'algosdk'
import { AlgodClient } from '@algorandfoundation/algokit-utils'

export function algokitAlgodToSdk(client: AlgodClient): algosdk.Algodv2 {
  return new algosdk.Algodv2(client.httpRequest.config.headers ?? '', client.httpRequest.config.baseUrl, client.httpRequest.config.port)
}
```

---

## 5. Transaction Bridging (The "Bridge")

Since v10 native objects are not binary-compatible with `algosdk` objects, you must bridge them using Msgpack encoding.

### 5.1 The "Reverse Bridge" (For Frontend Wallets)

If using `@txnlab/use-wallet` or legacy SDK builders:

```ts
import { decodeTransaction } from "@algorandfoundation/algokit-utils/transact";

// 1. Build using SDK
const sdkTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({ ... });

// 2. Bridge to v10 (if needed for AlgoKit logic)
const v10Txn = decodeTransaction(algosdk.encodeMsgpack(sdkTxn));
```

### 5.2 The "Native Bridge" (For Signing)

If building in v10 but signing with an SDK-based signer:

```ts
import { encodeTransactionRaw } from "@algorandfoundation/algokit-utils/transact";

// 1. Create v10 txn
const v10Txn = await algorand.createTransaction.payment({ ... });

// 2. Bridge to SDK
const sdkTxn = algosdk.decodeUnsignedTransaction(encodeTransactionRaw(v10Txn));
```

### 5.3 Helper Utilities (Copy-Paste)

Use these helpers to reduce boilerplate in your codebase.

```ts
import * as algosdk from 'algosdk'
import { decodeTransaction, encodeTransactionRaw, Transaction } from '@algorandfoundation/algokit-utils/transact'

export function sdkTxnToAlgokit(txn: algosdk.Transaction): Transaction {
  return decodeTransaction(algosdk.encodeMsgpack(txn))
}

export function algokitTxnToSdk(txn: Transaction): algosdk.Transaction {
  return algosdk.decodeUnsignedTransaction(encodeTransactionRaw(txn))
}
```

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

### Converting Structs to SDK

If you need to pass a v10 struct to an `algosdk` function, use this converter:

```ts
export function algokitStructToSdk(value: ABIValue, type: ABIStructType): algosdk.ABIValue {
  const sdkTuple = algosdk.ABIType.from(type.toABITupleType().toString())
  return sdkTuple.decode(type.encode(value))
}
```

---

## 7. TypeScript Strictness & Configuration

### Solving TokenHeader vs Record

v10 uses a strict dictionary for tokens. You cannot assign an SDK `TokenHeader` type to a v10 `AlgoClientConfig`.

```ts
// FIX: Use Record<string, string> to satisfy index signature
export interface MyConfig extends AlgoClientConfig {
  token: string | Record<string, string>
}
```

---

## 8. Agent "One-Shot" Cheat Sheet

Copy this table for your AI agent (Cursor/Claude) to ensure a high-accuracy migration.

| Search Pattern                  | Replace With                         | Action                                          |
| ------------------------------- | ------------------------------------ | ----------------------------------------------- |
| `\.do\(\)`                      | (empty)                              | Remove all `.do()` suffixes.                    |
| `from:`                         | `sender:`                            | Update transaction keys (if converting to v10). |
| `to:`                           | `receiver:`                          | Update transaction keys (if converting to v10). |
| `applicationIndex`              | `appId`                              | Rename in confirmations.                        |
| `getAccount\(`                  | `algorand.account.fromEnvironment\(` | Shift to manager pattern.                       |
| `\.getTransactionParams\(\)`    | `.transactionParams()`               | Fix client method name.                         |
| `TokenHeader`                   | `Record<string, string>`             | Fix TS interface errors.                        |
| `algo(1)`                       | `algo(1).microAlgos`                 | If passing to SDK builders.                     |
| `OnApplicationComplete\.(.*)OC` | `OnApplicationComplete.$1`           | Remove `OC` suffix.                             |
