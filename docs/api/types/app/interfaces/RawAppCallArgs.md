[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app](../README.md) / RawAppCallArgs

# Interface: RawAppCallArgs

Defined in: [src/types/app.ts:63](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L63)

App call args with non-ABI (raw) values (minus some processing like encoding strings as binary)

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`CoreAppCallArgs`](CoreAppCallArgs.md)

## Properties

### accounts?

> `optional` **accounts**: (`string` \| [`Address`](../../../algokit-utils/classes/Address.md))[]

Defined in: [src/types/app.ts:48](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L48)

The address of any accounts to load in

#### Inherited from

[`CoreAppCallArgs`](CoreAppCallArgs.md).[`accounts`](CoreAppCallArgs.md#accounts)

***

### appArgs?

> `optional` **appArgs**: (`string` \| `Uint8Array`)[]

Defined in: [src/types/app.ts:65](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L65)

Any application arguments to pass through

***

### apps?

> `optional` **apps**: `number`[]

Defined in: [src/types/app.ts:50](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L50)

IDs of any apps to load into the foreignApps array

#### Inherited from

[`CoreAppCallArgs`](CoreAppCallArgs.md).[`apps`](CoreAppCallArgs.md#apps)

***

### assets?

> `optional` **assets**: `number`[]

Defined in: [src/types/app.ts:52](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L52)

IDs of any assets to load into the foreignAssets array

#### Inherited from

[`CoreAppCallArgs`](CoreAppCallArgs.md).[`assets`](CoreAppCallArgs.md#assets)

***

### boxes?

> `optional` **boxes**: ([`BoxReference`](../../../Subpaths/transact/type-aliases/BoxReference.md) \| [`BoxIdentifier`](../../app-manager/type-aliases/BoxIdentifier.md) \| [`BoxReference`](../../app-manager/interfaces/BoxReference.md))[]

Defined in: [src/types/app.ts:46](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L46)

Any box references to load

#### Inherited from

[`CoreAppCallArgs`](CoreAppCallArgs.md).[`boxes`](CoreAppCallArgs.md#boxes)

***

### lease?

> `optional` **lease**: `string` \| `Uint8Array`

Defined in: [src/types/app.ts:44](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L44)

The optional lease for the transaction

#### Inherited from

[`CoreAppCallArgs`](CoreAppCallArgs.md).[`lease`](CoreAppCallArgs.md#lease)

***

### method?

> `optional` **method**: `undefined`

Defined in: [src/types/app.ts:67](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L67)

Property to aid intellisense

***

### rekeyTo?

> `optional` **rekeyTo**: `string` \| [`AddressWithTransactionSigner`](../../../Subpaths/transact/interfaces/AddressWithTransactionSigner.md)

Defined in: [src/types/app.ts:57](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app.ts#L57)

Optional account / account address that should be authorised to transact on behalf of the from account the app call is sent from after this transaction.

**Note:** Use with extreme caution and review the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying) first.

#### Inherited from

[`CoreAppCallArgs`](CoreAppCallArgs.md).[`rekeyTo`](CoreAppCallArgs.md#rekeyto)
