[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/transact](../README.md) / getEncodedTransactionType

# Function: getEncodedTransactionType()

> **getEncodedTransactionType**(`encoded_transaction`): [`TransactionType`](../enumerations/TransactionType.md)

Defined in: [packages/transact/src/transactions/transaction.ts:380](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/transact/src/transactions/transaction.ts#L380)

Get the transaction type from the encoded transaction.
This is particularly useful when decoding a transaction that has an unknown type

## Parameters

### encoded\_transaction

`Uint8Array`

## Returns

[`TransactionType`](../enumerations/TransactionType.md)
