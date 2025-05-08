[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppBoxValuesFromABIType

# Function: ~~getAppBoxValuesFromABIType()~~

> **getAppBoxValuesFromABIType**(`request`, `algod`): `Promise`\<`ABIValue`[]\>

Defined in: [src/app.ts:329](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L329)

## Parameters

### request

[`BoxValuesRequestParams`](../../types/app/interfaces/BoxValuesRequestParams.md)

The parameters for the box value request

### algod

`AlgodClient`

An algod client instance

## Returns

`Promise`\<`ABIValue`[]\>

The current box values as an ABI value in the same order as the passed in box names

## Deprecated

Use `algorand.app.getBoxValuesFromABIType` instead.
Returns the value of the given box names for the given app decoded based on the given ABI type.
