[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / RawAppCallArgs

# Interface: RawAppCallArgs

[types/app](../modules/types_app.md).RawAppCallArgs

App call args with raw values (minus some processing like encoding strings as binary)

## Table of contents

### Properties

- [accounts](types_app.RawAppCallArgs.md#accounts)
- [appArgs](types_app.RawAppCallArgs.md#appargs)
- [apps](types_app.RawAppCallArgs.md#apps)
- [assets](types_app.RawAppCallArgs.md#assets)
- [boxes](types_app.RawAppCallArgs.md#boxes)
- [lease](types_app.RawAppCallArgs.md#lease)

## Properties

### accounts

• `Optional` **accounts**: (`string` \| `Address`)[]

The address of any accounts to load in

#### Defined in

[src/types/app.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L47)

___

### appArgs

• `Optional` **appArgs**: (`string` \| `Uint8Array`)[]

Any application arguments to pass through

#### Defined in

[src/types/app.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L49)

___

### apps

• `Optional` **apps**: `number`[]

IDs of any apps to load into the foreignApps array

#### Defined in

[src/types/app.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L53)

___

### assets

• `Optional` **assets**: `number`[]

IDs of any assets to load into the foreignAssets array

#### Defined in

[src/types/app.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L55)

___

### boxes

• `Optional` **boxes**: [`BoxReference`](types_app.BoxReference.md)[]

Any box references to load

#### Defined in

[src/types/app.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L51)

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

The optional lease for the transaction

#### Defined in

[src/types/app.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L57)
