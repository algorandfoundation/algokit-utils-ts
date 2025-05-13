[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app](../README.md) / BoxValueRequestParams

# Interface: ~~BoxValueRequestParams~~

Defined in: [src/types/app.ts:398](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L398)

## Deprecated

Use `types/app-manager/BoxValueRequestParams` instead.
Parameters to get and decode a box value as an ABI type.

## Properties

### ~~appId~~

> **appId**: `number` \| `bigint`

Defined in: [src/types/app.ts:400](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L400)

The ID of the app return box names for

***

### ~~boxName~~

> **boxName**: `string` \| `Uint8Array`\<`ArrayBufferLike`\> \| [`BoxName`](BoxName.md)

Defined in: [src/types/app.ts:402](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L402)

The name of the box to return either as a string, binary array or `BoxName`

***

### ~~type~~

> **type**: `ABIType`

Defined in: [src/types/app.ts:404](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L404)

The ABI type to decode the value using
