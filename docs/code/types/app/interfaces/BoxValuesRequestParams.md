[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app](../README.md) / BoxValuesRequestParams

# Interface: ~~BoxValuesRequestParams~~

Defined in: [src/types/app.ts:411](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L411)

## Deprecated

Use `types/app-manager/BoxValuesRequestParams` instead.
Parameters to get and decode a box value as an ABI type.

## Properties

### ~~appId~~

> **appId**: `number`

Defined in: [src/types/app.ts:413](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L413)

The ID of the app return box names for

***

### ~~boxNames~~

> **boxNames**: (`string` \| `Uint8Array`\<`ArrayBufferLike`\> \| [`BoxName`](BoxName.md))[]

Defined in: [src/types/app.ts:415](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L415)

The names of the boxes to return either as a string, binary array or BoxName`

***

### ~~type~~

> **type**: `ABIType`

Defined in: [src/types/app.ts:417](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L417)

The ABI type to decode the value using
