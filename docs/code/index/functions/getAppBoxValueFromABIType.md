[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppBoxValueFromABIType

# Function: ~~getAppBoxValueFromABIType()~~

> **getAppBoxValueFromABIType**(`request`, `algod`): `Promise`\<`ABIValue`\>

Defined in: [src/app.ts:314](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L314)

## Parameters

### request

[`BoxValueRequestParams`](../../types/app/interfaces/BoxValueRequestParams.md)

The parameters for the box value request

### algod

`AlgodClient`

An algod client instance

## Returns

`Promise`\<`ABIValue`\>

The current box value as an ABI value

## Deprecated

Use `algorand.app.getBoxValueFromABIType` instead.
Returns the value of the given box name for the given app decoded based on the given ABI type.
