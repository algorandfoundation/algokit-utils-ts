[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / AppClientCallABIArgs

# Interface: AppClientCallABIArgs

Defined in: [src/types/app-client.ts:184](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L184)

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- `Omit`\<[`ABIAppCallArgs`](../../app/type-aliases/ABIAppCallArgs.md), `"method"`\>

## Properties

### accounts?

> `optional` **accounts**: (`string` \| [`Address`](../../../algokit-utils/classes/Address.md))[]

Defined in: [src/types/app.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L48)

The address of any accounts to load in

#### Inherited from

[`CoreAppCallArgs`](../../app/interfaces/CoreAppCallArgs.md).[`accounts`](../../app/interfaces/CoreAppCallArgs.md#accounts)

***

### apps?

> `optional` **apps**: `number`[]

Defined in: [src/types/app.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L50)

IDs of any apps to load into the foreignApps array

#### Inherited from

[`CoreAppCallArgs`](../../app/interfaces/CoreAppCallArgs.md).[`apps`](../../app/interfaces/CoreAppCallArgs.md#apps)

***

### assets?

> `optional` **assets**: `number`[]

Defined in: [src/types/app.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L52)

IDs of any assets to load into the foreignAssets array

#### Inherited from

[`CoreAppCallArgs`](../../app/interfaces/CoreAppCallArgs.md).[`assets`](../../app/interfaces/CoreAppCallArgs.md#assets)

***

### boxes?

> `optional` **boxes**: ([`BoxReference`](../../../Subpaths/transact/type-aliases/BoxReference.md) \| [`BoxIdentifier`](../../app-manager/type-aliases/BoxIdentifier.md) \| [`BoxReference`](../../app-manager/interfaces/BoxReference.md))[]

Defined in: [src/types/app.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L46)

Any box references to load

#### Inherited from

[`CoreAppCallArgs`](../../app/interfaces/CoreAppCallArgs.md).[`boxes`](../../app/interfaces/CoreAppCallArgs.md#boxes)

***

### lease?

> `optional` **lease**: `string` \| `Uint8Array`

Defined in: [src/types/app.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L44)

The optional lease for the transaction

#### Inherited from

[`CoreAppCallArgs`](../../app/interfaces/CoreAppCallArgs.md).[`lease`](../../app/interfaces/CoreAppCallArgs.md#lease)

***

### method

> **method**: `string`

Defined in: [src/types/app-client.ts:186](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L186)

If calling an ABI method then either the name of the method, or the ABI signature

***

### methodArgs

> **methodArgs**: [`ABIAppCallArg`](../../app/type-aliases/ABIAppCallArg.md)[]

Defined in: [src/types/app.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L87)

The ABI method args to pass in

#### Inherited from

`Omit.methodArgs`

***

### rekeyTo?

> `optional` **rekeyTo**: `string` \| [`AddressWithTransactionSigner`](../../../Subpaths/transact/interfaces/AddressWithTransactionSigner.md)

Defined in: [src/types/app.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L57)

Optional account / account address that should be authorised to transact on behalf of the from account the app call is sent from after this transaction.

**Note:** Use with extreme caution and review the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying) first.

#### Inherited from

[`CoreAppCallArgs`](../../app/interfaces/CoreAppCallArgs.md).[`rekeyTo`](../../app/interfaces/CoreAppCallArgs.md#rekeyto)
