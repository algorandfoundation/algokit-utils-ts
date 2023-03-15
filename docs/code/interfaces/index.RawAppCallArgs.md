[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / RawAppCallArgs

# Interface: RawAppCallArgs

[index](../modules/index.md).RawAppCallArgs

App call args with raw values (minus some processing like encoding strings as binary)

## Table of contents

### Properties

- [accounts](index.RawAppCallArgs.md#accounts)
- [appArgs](index.RawAppCallArgs.md#appargs)
- [apps](index.RawAppCallArgs.md#apps)
- [assets](index.RawAppCallArgs.md#assets)
- [boxes](index.RawAppCallArgs.md#boxes)
- [lease](index.RawAppCallArgs.md#lease)

## Properties

### accounts

• `Optional` **accounts**: (`string` \| `Address`)[]

The address of any accounts to load in

#### Defined in

[app.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L60)

___

### appArgs

• `Optional` **appArgs**: (`string` \| `Uint8Array`)[]

Any application arguments to pass through

#### Defined in

[app.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L62)

___

### apps

• `Optional` **apps**: `number`[]

IDs of any apps to load into the foreignApps array

#### Defined in

[app.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L66)

___

### assets

• `Optional` **assets**: `number`[]

IDs of any assets to load into the foreignAssets array

#### Defined in

[app.ts:68](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L68)

___

### boxes

• `Optional` **boxes**: [`BoxReference`](index.BoxReference.md)[]

Any box references to load

#### Defined in

[app.ts:64](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L64)

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

The optional lease for the transaction

#### Defined in

[app.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L70)
