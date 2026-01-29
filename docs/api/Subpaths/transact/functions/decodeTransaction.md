[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / decodeTransaction

# Function: decodeTransaction()

> **decodeTransaction**(`encoded_transaction`): [`Transaction`](../classes/Transaction.md)

Defined in: [packages/transact/src/transactions/transaction.ts:475](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/transact/src/transactions/transaction.ts#L475)

Decodes MsgPack bytes into a transaction.

# Parameters
* `encoded_transaction` - MsgPack encoded bytes representing a transaction.

# Returns
A decoded transaction or an error if decoding fails.

## Parameters

### encoded\_transaction

`Uint8Array`

## Returns

[`Transaction`](../classes/Transaction.md)
