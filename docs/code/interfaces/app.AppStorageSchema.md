[@algorandfoundation/algokit-utils](../README.md) / [app](../modules/app.md) / AppStorageSchema

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

[app.ts:147](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L147)

___

### globalByteSlices

• **globalByteSlices**: `number`

Restricts number of byte slices in global state

#### Defined in

[app.ts:145](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L145)

___

### globalInts

• **globalInts**: `number`

Restricts number of ints in global state

#### Defined in

[app.ts:143](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L143)

___

### localByteSlices

• **localByteSlices**: `number`

Restricts number of byte slices in per-user local state

#### Defined in

[app.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L141)

___

### localInts

• **localInts**: `number`

Restricts number of ints in per-user local state

#### Defined in

[app.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/600c806/src/app.ts#L139)
