[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-factory](../README.md) / CreateSchema

# Type Alias: CreateSchema

> **CreateSchema** = `object`

Defined in: [src/types/app-factory.ts:87](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-factory.ts#L87)

Specifies a schema used for creating an app

## Properties

### extraProgramPages?

> `optional` **extraProgramPages**: `number`

Defined in: [src/types/app-factory.ts:102](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-factory.ts#L102)

Number of extra pages required for the programs.
Defaults to the number needed for the programs in this call if not specified.
This is immutable once the app is created.

***

### schema?

> `optional` **schema**: `object`

Defined in: [src/types/app-factory.ts:89](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-factory.ts#L89)

The state schema for the app. This is immutable once the app is created. By default uses the ARC32/ARC-56 spec.

#### globalByteSlices

> **globalByteSlices**: `number`

The number of byte slices saved in global state.

#### globalInts

> **globalInts**: `number`

The number of integers saved in global state.

#### localByteSlices

> **localByteSlices**: `number`

The number of byte slices saved in local state.

#### localInts

> **localInts**: `number`

The number of integers saved in local state.
