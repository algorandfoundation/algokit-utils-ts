[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Packages/Transact](../README.md) / encodeTransaction

# Function: encodeTransaction()

> **encodeTransaction**(`transaction`): `Uint8Array`

Defined in: [packages/transact/src/transactions/transaction.ts:391](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/transact/src/transactions/transaction.ts#L391)

Encode the transaction with the domain separation (e.g. "TX") prefix

## Parameters

### transaction

[`Transaction`](../classes/Transaction.md)

The transaction to encode

## Returns

`Uint8Array`

The MsgPack encoded bytes or an error if encoding fails.
