[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getTransactionParams

# Function: ~~getTransactionParams()~~

> **getTransactionParams**(`params`, `algod`): `Promise`\<`SuggestedParams`\>

Defined in: [src/transaction/transaction.ts:1111](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L1111)

## Parameters

### params

Optionally provide parameters to use

`undefined` | `SuggestedParams`

### algod

`AlgodClient`

Algod algod

## Returns

`Promise`\<`SuggestedParams`\>

The suggested transaction parameters

## Deprecated

Use `suggestedParams ? { ...suggestedParams } : await algod.getTransactionParams().do()` instead

Returns suggested transaction parameters from algod unless some are already provided.
