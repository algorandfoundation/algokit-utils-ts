[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / controlFees

# Function: ~~controlFees()~~

> **controlFees**\<`T`\>(`transaction`, `feeControl`): `T`

Defined in: [src/transaction/transaction.ts:1101](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L1101)

## Type Parameters

### T

`T` *extends* `Transaction` \| `SuggestedParams`

## Parameters

### transaction

`T`

The transaction or suggested params

### feeControl

The fee control parameters

#### fee?

[`AlgoAmount`](../../types/amount/classes/AlgoAmount.md)

#### maxFee?

[`AlgoAmount`](../../types/amount/classes/AlgoAmount.md)

## Returns

`T`

## Deprecated

Use `TransactionComposer` and the `maxFee` and `staticFee` fields in the transaction params instead.

Allows for control of fees on a `Transaction` or `SuggestedParams` object
