[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAppBoxValues

# Function: ~~getAppBoxValues()~~

> **getAppBoxValues**(`appId`, `boxNames`, `algod`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>[]\>

Defined in: [src/app.ts:300](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L300)

## Parameters

### appId

`number`

The ID of the app return box names for

### boxNames

(`string` \| `Uint8Array`\<`ArrayBufferLike`\> \| [`BoxName`](../../types/app/interfaces/BoxName.md))[]

The names of the boxes to return either as a string, binary array or `BoxName`

### algod

`AlgodClient`

An algod client instance

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>[]\>

The current box values as a byte array in the same order as the passed in box names

## Deprecated

Use `algorand.app.getBoxValues` instead.
Returns the value of the given box names for the given app.
