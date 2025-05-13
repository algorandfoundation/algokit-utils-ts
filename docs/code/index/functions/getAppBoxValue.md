[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppBoxValue

# Function: ~~getAppBoxValue()~~

> **getAppBoxValue**(`appId`, `boxName`, `algod`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [src/app.ts:288](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L288)

## Parameters

### appId

The ID of the app return box names for

`number` | `bigint`

### boxName

The name of the box to return either as a string, binary array or `BoxName`

`string` | `Uint8Array`\<`ArrayBufferLike`\> | [`BoxName`](../../types/app/interfaces/BoxName.md)

### algod

`AlgodClient`

An algod client instance

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

The current box value as a byte array

## Deprecated

Use `algorand.app.getBoxValue` instead.
Returns the value of the given box name for the given app.
