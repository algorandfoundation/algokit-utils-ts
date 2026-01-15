[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / decodeTransactions

# Function: decodeTransactions()

> **decodeTransactions**(`encoded_transactions`): [`Transaction`](../classes/Transaction.md)[]

Defined in: [packages/transact/src/transactions/transaction.ts:507](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L507)

Decodes a collection of MsgPack bytes into a transaction collection.

# Parameters
* `encoded_transaction` - A collection of MsgPack encoded bytes, each representing a transaction.

# Returns
A collection of decoded transactions or an error if decoding fails.

## Parameters

### encoded\_transactions

`Uint8Array`[]

## Returns

[`Transaction`](../classes/Transaction.md)[]
