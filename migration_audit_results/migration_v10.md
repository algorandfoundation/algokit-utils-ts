# AlgoKit Utils v10 Migration Guide

This guide documents the breaking changes and required code updates for migrating from AlgoKit Utils v9 to v10.

## 1. Executive Summary: The "Decoupling"

The primary shift in v10 is the **removal of `algosdk` as a hard dependency**. AlgoKit now uses native TypeScript implementations for transactions, ABI handling, and client interactions.

While you can still use `algosdk` alongside AlgoKit, they are no longer interchangeable in memory.

---

## 2. Global Naming & Structural Changes

### Standardized Property Names

Across the entire library, we have standardized property names to be more idiomatic.

| v9 Property (SDK Style) | v10 Property (AlgoKit Style) | Context                    |
| :---------------------- | :--------------------------- | :------------------------- |
| `index`                 | `id`                         | Asset IDs and App IDs      |
| `txID`                  | `txId`                       | Transaction identifiers    |
| `axfer`                 | `AssetTransfer`              | Transaction Type Enums     |
| `applicationCall`       | `appCall`                    | Transaction field names    |
| `applicationIndex`      | `appId`                      | Confirmations / References |

### Flattened Imports

We have moved away from deep directory imports (e.g., `/types/`, `/account/`).

**Action:** Update your imports to use the top-level package or the new functional entry points.

- **Before:** `import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'`
- **After:** `import { AppSpec } from '@algorandfoundation/algokit-utils'`

---

## 3. AlgorandClient & Managers

v10 moves from standalone utility functions to a **Manager Pattern**.

### Client Initialization

Client getters (Factories/AppClients) are now **synchronous**.

```ts
// v9
const factory = await algorand.client.getAppFactory({ ... })

// v10
const factory = algorand.client.getAppFactory({ ... })
Removal of .do()
```

The Algod, Indexer, and KMD clients now return Promises directly.

```ts
// v9
const status = await algorand.client.algod.status().do()

// v10
const status = await algorand.client.algod.status()
4. Smart Contract Interactions (AppClient / AppFactory)
ARC-56 and Structs
```

v10 treats ARC-56 structs as first-class objects. When passing arguments to a method that expects a struct, you must now pass the structured object rather than a raw string or array.

```ts
// v9
await appClient.send.call({ method: 'setValue', args: [1, 'hello'] })

// v10
await appClient.send.call({
  method: 'setValue',
  args: [1, { x: { a: 'hello' } }]
})
Transaction References (Boxes)
```

The boxes property is now boxReferences, and internal fields use appId.

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

OnComplete Enums

The OC suffix has been removed for clarity.

OnApplicationComplete.OptInOC → OnApplicationComplete.OptIn

OnApplicationComplete.NoOpOC → OnApplicationComplete.NoOp

5. ABI & Transactions
   ABI Type Construction

Stop using algosdk ABI classes. Use the native ABIType factory.

```ts
// v9
const uint32Type = new algosdk.ABIUintType(32)

// v10
import { ABIType } from '@algorandfoundation/algokit-abi'
const uint32Type = ABIType.from('uint32')
```

The Transaction Bridge

If you have an existing algosdk.Transaction object and need to pass it to an AlgoKit v10 function, you must encode and decode it.

```ts
import * as algosdk from "algosdk";
import { decodeTransaction } from "@algorandfoundation/algokit-utils/transact";

// Bridge: SDK -> v10
const sdkTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({...});
const v10Txn = decodeTransaction(algosdk.encodeMsgpack(sdkTxn));
```

6. Testing & Troubleshooting
   Assertions

Error message patterns in tests have shifted from checking the stack to checking the message.

```ts
// v9
expect(e.stack).toContain('assert failed')

// v10
expect(e.message).toContain('assert failed')
```

Enum Types

When checking transaction types in tests, use the full names.

```ts
// v9
expect(txn.type).toBe(TransactionType.pay)

// v10
expect(txn.type).toBe(TransactionType.Payment)
```
