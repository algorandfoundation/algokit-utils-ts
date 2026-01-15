[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app](../README.md) / BoxValuesRequestParams

# ~~Interface: BoxValuesRequestParams~~

Defined in: [src/types/app.ts:292](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L292)

## Deprecated

Use `types/app-manager/BoxValuesRequestParams` instead.
Parameters to get and decode a box value as an ABI type.

## Properties

### ~~appId~~

> **appId**: `number`

Defined in: [src/types/app.ts:294](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L294)

The ID of the app return box names for

***

### ~~boxNames~~

> **boxNames**: (`string` \| `Uint8Array` \| [`BoxName`](BoxName.md))[]

Defined in: [src/types/app.ts:296](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L296)

The names of the boxes to return either as a string, binary array or BoxName`

***

### ~~type~~

> **type**: [`ABIType`](../../../abi/classes/ABIType.md)

Defined in: [src/types/app.ts:298](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L298)

The ABI type to decode the value using
