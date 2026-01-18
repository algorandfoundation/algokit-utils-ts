[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app](../README.md) / AppStorageSchema

# Interface: AppStorageSchema

Defined in: [src/types/app.ts:113](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L113)

Parameters representing the storage schema of an app.

## Properties

### extraPages?

> `optional` **extraPages**: `number`

Defined in: [src/types/app.ts:123](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L123)

Any extra pages that are needed for the smart contract; if left blank then the right number of pages will be calculated based on the teal code size

***

### globalByteSlices

> **globalByteSlices**: `number`

Defined in: [src/types/app.ts:121](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L121)

Restricts number of byte slices in global state

***

### globalInts

> **globalInts**: `number`

Defined in: [src/types/app.ts:119](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L119)

Restricts number of ints in global state

***

### localByteSlices

> **localByteSlices**: `number`

Defined in: [src/types/app.ts:117](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L117)

Restricts number of byte slices in per-user local state

***

### localInts

> **localInts**: `number`

Defined in: [src/types/app.ts:115](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L115)

Restricts number of ints in per-user local state
