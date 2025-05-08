[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / capTransactionFee

# Function: ~~capTransactionFee()~~

> **capTransactionFee**(`transaction`, `maxAcceptableFee`): `void`

Defined in: [src/transaction/transaction.ts:1057](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L1057)

## Parameters

### transaction

The transaction to cap or suggested params object about to be used to create a transaction

`Transaction` | `SuggestedParams`

### maxAcceptableFee

[`AlgoAmount`](../../types/amount/classes/AlgoAmount.md)

The maximum acceptable fee to pay

## Returns

`void`

## Deprecated

Use `TransactionComposer` and the `maxFee` field in the transaction params instead.

Limit the acceptable fee to a defined amount of µAlgo.
This also sets the transaction to be flatFee to ensure the transaction only succeeds at
the estimated rate.
