[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / RawAppCallArgs

# Interface: RawAppCallArgs

[types/app](../modules/types_app.md).RawAppCallArgs

App call args with non-ABI (raw) values (minus some processing like encoding strings as binary)

## Hierarchy

- [`CoreAppCallArgs`](types_app.CoreAppCallArgs.md)

  ↳ **`RawAppCallArgs`**

## Table of contents

### Properties

- [accounts](types_app.RawAppCallArgs.md#accounts)
- [appArgs](types_app.RawAppCallArgs.md#appargs)
- [apps](types_app.RawAppCallArgs.md#apps)
- [assets](types_app.RawAppCallArgs.md#assets)
- [boxes](types_app.RawAppCallArgs.md#boxes)
- [lease](types_app.RawAppCallArgs.md#lease)
- [method](types_app.RawAppCallArgs.md#method)
- [rekeyTo](types_app.RawAppCallArgs.md#rekeyto)

## Properties

### accounts

• `Optional` **accounts**: (`string` \| `Address`)[]

The address of any accounts to load in

#### Inherited from

[CoreAppCallArgs](types_app.CoreAppCallArgs.md).[accounts](types_app.CoreAppCallArgs.md#accounts)

#### Defined in

[src/types/app.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L50)

___

### appArgs

• `Optional` **appArgs**: (`string` \| `Uint8Array`)[]

Any application arguments to pass through

#### Defined in

[src/types/app.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L67)

___

### apps

• `Optional` **apps**: `number`[]

IDs of any apps to load into the foreignApps array

#### Inherited from

[CoreAppCallArgs](types_app.CoreAppCallArgs.md).[apps](types_app.CoreAppCallArgs.md#apps)

#### Defined in

[src/types/app.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L52)

___

### assets

• `Optional` **assets**: `number`[]

IDs of any assets to load into the foreignAssets array

#### Inherited from

[CoreAppCallArgs](types_app.CoreAppCallArgs.md).[assets](types_app.CoreAppCallArgs.md#assets)

#### Defined in

[src/types/app.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L54)

___

### boxes

• `Optional` **boxes**: (`BoxReference` \| [`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](types_app_manager.BoxReference.md))[]

Any box references to load

#### Inherited from

[CoreAppCallArgs](types_app.CoreAppCallArgs.md).[boxes](types_app.CoreAppCallArgs.md#boxes)

#### Defined in

[src/types/app.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L48)

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

The optional lease for the transaction

#### Inherited from

[CoreAppCallArgs](types_app.CoreAppCallArgs.md).[lease](types_app.CoreAppCallArgs.md#lease)

#### Defined in

[src/types/app.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L46)

___

### method

• `Optional` **method**: `undefined`

Property to aid intellisense

#### Defined in

[src/types/app.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L69)

___

### rekeyTo

• `Optional` **rekeyTo**: `string` \| `AddressWithSigner`

Optional account / account address that should be authorised to transact on behalf of the from account the app call is sent from after this transaction.

**Note:** Use with extreme caution and review the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying) first.

#### Inherited from

[CoreAppCallArgs](types_app.CoreAppCallArgs.md).[rekeyTo](types_app.CoreAppCallArgs.md#rekeyto)

#### Defined in

[src/types/app.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L59)
