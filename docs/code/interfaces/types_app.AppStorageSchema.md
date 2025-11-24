[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / AppStorageSchema

# Interface: AppStorageSchema

[types/app](../modules/types_app.md).AppStorageSchema

Parameters representing the storage schema of an app.

## Table of contents

### Properties

- [extraPages](types_app.AppStorageSchema.md#extrapages)
- [globalByteSlices](types_app.AppStorageSchema.md#globalbyteslices)
- [globalInts](types_app.AppStorageSchema.md#globalints)
- [localByteSlices](types_app.AppStorageSchema.md#localbyteslices)
- [localInts](types_app.AppStorageSchema.md#localints)

## Properties

### extraPages

• `Optional` **extraPages**: `number`

Any extra pages that are needed for the smart contract; if left blank then the right number of pages will be calculated based on the teal code size

#### Defined in

[src/types/app.ts:202](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L202)

___

### globalByteSlices

• **globalByteSlices**: `number`

Restricts number of byte slices in global state

#### Defined in

[src/types/app.ts:200](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L200)

___

### globalInts

• **globalInts**: `number`

Restricts number of ints in global state

#### Defined in

[src/types/app.ts:198](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L198)

___

### localByteSlices

• **localByteSlices**: `number`

Restricts number of byte slices in per-user local state

#### Defined in

[src/types/app.ts:196](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L196)

___

### localInts

• **localInts**: `number`

Restricts number of ints in per-user local state

#### Defined in

[src/types/app.ts:194](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L194)
