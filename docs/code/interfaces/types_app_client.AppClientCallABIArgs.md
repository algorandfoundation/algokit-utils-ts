[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / AppClientCallABIArgs

# Interface: AppClientCallABIArgs

[types/app-client](../modules/types_app_client.md).AppClientCallABIArgs

## Hierarchy

- `Omit`\<[`ABIAppCallArgs`](../modules/types_app.md#abiappcallargs), ``"method"``\>

  ↳ **`AppClientCallABIArgs`**

## Table of contents

### Properties

- [accounts](types_app_client.AppClientCallABIArgs.md#accounts)
- [apps](types_app_client.AppClientCallABIArgs.md#apps)
- [assets](types_app_client.AppClientCallABIArgs.md#assets)
- [boxes](types_app_client.AppClientCallABIArgs.md#boxes)
- [lease](types_app_client.AppClientCallABIArgs.md#lease)
- [method](types_app_client.AppClientCallABIArgs.md#method)
- [methodArgs](types_app_client.AppClientCallABIArgs.md#methodargs)
- [rekeyTo](types_app_client.AppClientCallABIArgs.md#rekeyto)

## Properties

### accounts

• `Optional` **accounts**: (`string` \| `Address`)[]

The address of any accounts to load in

#### Inherited from

Omit.accounts

#### Defined in

[src/types/app.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L48)

___

### apps

• `Optional` **apps**: `number`[]

IDs of any apps to load into the foreignApps array

#### Inherited from

Omit.apps

#### Defined in

[src/types/app.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L50)

___

### assets

• `Optional` **assets**: `number`[]

IDs of any assets to load into the foreignAssets array

#### Inherited from

Omit.assets

#### Defined in

[src/types/app.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L52)

___

### boxes

• `Optional` **boxes**: (`BoxReference` \| [`BoxIdentifier`](../modules/types_app_manager.md#boxidentifier) \| [`BoxReference`](types_app_manager.BoxReference.md))[]

Any box references to load

#### Inherited from

Omit.boxes

#### Defined in

[src/types/app.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L46)

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

The optional lease for the transaction

#### Inherited from

Omit.lease

#### Defined in

[src/types/app.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L44)

___

### method

• **method**: `string`

If calling an ABI method then either the name of the method, or the ABI signature

#### Defined in

[src/types/app-client.ts:172](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L172)

___

### methodArgs

• **methodArgs**: [`ABIAppCallArg`](../modules/types_app.md#abiappcallarg)[]

The ABI method args to pass in

#### Inherited from

Omit.methodArgs

#### Defined in

[src/types/app.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L87)

___

### rekeyTo

• `Optional` **rekeyTo**: `string` \| `AddressWithSigner`

Optional account / account address that should be authorised to transact on behalf of the from account the app call is sent from after this transaction.

**Note:** Use with extreme caution and review the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying) first.

#### Inherited from

Omit.rekeyTo

#### Defined in

[src/types/app.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L57)
