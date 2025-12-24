[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / CoreAppCallArgs

# Interface: CoreAppCallArgs

[types/app](../modules/types_app.md).CoreAppCallArgs

Common app call arguments for ABI and non-ABI (raw) calls

## Hierarchy

- **`CoreAppCallArgs`**

  ↳ [`RawAppCallArgs`](types_app.RawAppCallArgs.md)

## Table of contents

### Properties

- [accounts](types_app.CoreAppCallArgs.md#accounts)
- [apps](types_app.CoreAppCallArgs.md#apps)
- [assets](types_app.CoreAppCallArgs.md#assets)
- [boxes](types_app.CoreAppCallArgs.md#boxes)
- [lease](types_app.CoreAppCallArgs.md#lease)
- [rekeyTo](types_app.CoreAppCallArgs.md#rekeyto)

## Properties

### accounts

• `Optional` **accounts**: (`string` \| [`Address`](../classes/index.Address.md))[]

The address of any accounts to load in

#### Defined in

[src/types/app.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L48)

___

### apps

• `Optional` **apps**: `number`[]

IDs of any apps to load into the foreignApps array

#### Defined in

[src/types/app.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L50)

___

### assets

• `Optional` **assets**: `number`[]

IDs of any assets to load into the foreignAssets array

#### Defined in

[src/types/app.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L52)

___

### boxes

• `Optional` **boxes**: (`BoxReference` \| [`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](types_app_manager.BoxReference.md))[]

Any box references to load

#### Defined in

[src/types/app.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L46)

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

The optional lease for the transaction

#### Defined in

[src/types/app.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L44)

___

### rekeyTo

• `Optional` **rekeyTo**: `string` \| `AddressWithTransactionSigner`

Optional account / account address that should be authorised to transact on behalf of the from account the app call is sent from after this transaction.

**Note:** Use with extreme caution and review the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying) first.

#### Defined in

[src/types/app.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L57)
