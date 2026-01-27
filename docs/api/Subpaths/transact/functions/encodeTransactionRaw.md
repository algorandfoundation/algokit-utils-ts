[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / encodeTransactionRaw

# Function: encodeTransactionRaw()

> **encodeTransactionRaw**(`transaction`): `Uint8Array`

Defined in: [packages/transact/src/transactions/transaction.ts:461](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L461)

Encode the transaction without the domain separation (e.g. "TX") prefix
This is useful for encoding the transaction for signing with tools that automatically add "TX" prefix to the transaction bytes.

## Parameters

### transaction

[`Transaction`](../classes/Transaction.md)

## Returns

`Uint8Array`
