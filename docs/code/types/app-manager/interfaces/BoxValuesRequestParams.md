[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-manager](../README.md) / BoxValuesRequestParams

# Interface: BoxValuesRequestParams

Defined in: [src/types/app-manager.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L88)

Parameters to get and decode a box value as an ABI type.

## Properties

### appId

> **appId**: `bigint`

Defined in: [src/types/app-manager.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L90)

The ID of the app return box names for

***

### boxNames

> **boxNames**: [`BoxIdentifier`](../type-aliases/BoxIdentifier.md)[]

Defined in: [src/types/app-manager.ts:92](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L92)

The names of the boxes to return either as a string, binary array or BoxName`

***

### type

> **type**: `ABIType`

Defined in: [src/types/app-manager.ts:94](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-manager.ts#L94)

The ABI type to decode the value using
