[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / encodeTransactions

# Function: encodeTransactions()

> **encodeTransactions**(`transactions`): `Uint8Array`[]

Defined in: [packages/transact/src/transactions/transaction.ts:405](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L405)

Encode transactions with the domain separation (e.g. "TX") prefix

## Parameters

### transactions

[`Transaction`](../classes/Transaction.md)[]

A collection of transactions to encode

## Returns

`Uint8Array`[]

A collection of MsgPack encoded bytes or an error if encoding fails.
