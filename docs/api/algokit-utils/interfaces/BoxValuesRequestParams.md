[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / BoxValuesRequestParams

# Interface: BoxValuesRequestParams

Defined in: [src/app-manager.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-manager.ts#L90)

Parameters to get and decode a box value as an ABI type.

## Properties

### appId

> **appId**: `bigint`

Defined in: [src/app-manager.ts:92](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-manager.ts#L92)

The ID of the app return box names for

***

### boxNames

> **boxNames**: [`BoxIdentifier`](../type-aliases/BoxIdentifier.md)[]

Defined in: [src/app-manager.ts:94](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-manager.ts#L94)

The names of the boxes to return either as a string, binary array or BoxName`

***

### type

> **type**: [`ABIType`](../../Subpaths/abi/classes/ABIType.md)

Defined in: [src/app-manager.ts:96](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app-manager.ts#L96)

The ABI type to decode the value using
