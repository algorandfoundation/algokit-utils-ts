[algotstest](../README.md) / [app](../modules/app.md) / AppCallArgs

# Interface: AppCallArgs

[app](../modules/app.md).AppCallArgs

Arguments to pass to an app call

## Table of contents

### Properties

- [accounts](app.AppCallArgs.md#accounts)
- [appArgs](app.AppCallArgs.md#appargs)
- [apps](app.AppCallArgs.md#apps)
- [assets](app.AppCallArgs.md#assets)
- [boxes](app.AppCallArgs.md#boxes)
- [lease](app.AppCallArgs.md#lease)

## Properties

### accounts

• `Optional` **accounts**: `string`[]

The address of any accounts to load in

#### Defined in

[app.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L43)

___

### appArgs

• `Optional` **appArgs**: (`string` \| `Uint8Array`)[]

Any application arguments to pass through

#### Defined in

[app.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L45)

___

### apps

• `Optional` **apps**: `number`[]

IDs of any apps to load into the foreignApps array

#### Defined in

[app.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L49)

___

### assets

• `Optional` **assets**: `number`[]

IDs of any assets to load into the foreignAssets array

#### Defined in

[app.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L51)

___

### boxes

• `Optional` **boxes**: [`BoxReference`](app.BoxReference.md)[]

Any box references to load

#### Defined in

[app.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L47)

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

The optional lease for the transaction

#### Defined in

[app.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/app.ts#L53)
