[algotstest](../README.md) / [app](../modules/app.md) / AppStorageSchema

# Interface: AppStorageSchema

[app](../modules/app.md).AppStorageSchema

Parameters representing the storage schema of an app.

## Table of contents

### Properties

- [extraPages](app.AppStorageSchema.md#extrapages)
- [globalByteSlices](app.AppStorageSchema.md#globalbyteslices)
- [globalInts](app.AppStorageSchema.md#globalints)
- [localByteSlices](app.AppStorageSchema.md#localbyteslices)
- [localInts](app.AppStorageSchema.md#localints)

## Properties

### extraPages

• `Optional` **extraPages**: `number`

Any extra pages that are needed for the smart contract; if left blank then the right number of pages will be calculated based on the teal code size

#### Defined in

[app.ts:110](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L110)

___

### globalByteSlices

• **globalByteSlices**: `number`

Restricts number of byte slices in global state

#### Defined in

[app.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L108)

___

### globalInts

• **globalInts**: `number`

Restricts number of ints in global state

#### Defined in

[app.ts:106](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L106)

___

### localByteSlices

• **localByteSlices**: `number`

Restricts number of byte slices in per-user local state

#### Defined in

[app.ts:104](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L104)

___

### localInts

• **localInts**: `number`

Restricts number of ints in per-user local state

#### Defined in

[app.ts:102](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/app.ts#L102)
