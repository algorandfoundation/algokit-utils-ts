[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app](../README.md) / BoxValueRequestParams

# ~~Interface: BoxValueRequestParams~~

Defined in: [src/types/app.ts:279](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L279)

## Deprecated

Use `types/app-manager/BoxValueRequestParams` instead.
Parameters to get and decode a box value as an ABI type.

## Properties

### ~~appId~~

> **appId**: `number` \| `bigint`

Defined in: [src/types/app.ts:281](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L281)

The ID of the app return box names for

***

### ~~boxName~~

> **boxName**: `string` \| `Uint8Array` \| [`BoxName`](BoxName.md)

Defined in: [src/types/app.ts:283](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L283)

The name of the box to return either as a string, binary array or `BoxName`

***

### ~~type~~

> **type**: [`ABIType`](../../../Subpaths/abi/classes/ABIType.md)

Defined in: [src/types/app.ts:285](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L285)

The ABI type to decode the value using
