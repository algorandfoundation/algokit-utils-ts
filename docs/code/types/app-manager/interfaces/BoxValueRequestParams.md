[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-manager](../README.md) / BoxValueRequestParams

# Interface: BoxValueRequestParams

Defined in: [src/types/app-manager.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L76)

Parameters to get and decode a box value as an ABI type.

## Properties

### appId

> **appId**: `bigint`

Defined in: [src/types/app-manager.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L78)

The ID of the app return box names for

***

### boxName

> **boxName**: [`BoxIdentifier`](../type-aliases/BoxIdentifier.md)

Defined in: [src/types/app-manager.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L80)

The name of the box to return either as a string, binary array or `BoxName`

***

### type

> **type**: `ABIType`

Defined in: [src/types/app-manager.ts:82](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L82)

The ABI type to decode the value using
