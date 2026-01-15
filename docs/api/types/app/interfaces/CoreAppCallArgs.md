[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app](../README.md) / CoreAppCallArgs

# Interface: CoreAppCallArgs

Defined in: [src/types/app.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L42)

Common app call arguments for ABI and non-ABI (raw) calls

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extended by

- [`RawAppCallArgs`](RawAppCallArgs.md)

## Properties

### accounts?

> `optional` **accounts**: (`string` \| [`Address`](../../../Algokit-Utils-API/classes/Address.md))[]

Defined in: [src/types/app.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L48)

The address of any accounts to load in

***

### apps?

> `optional` **apps**: `number`[]

Defined in: [src/types/app.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L50)

IDs of any apps to load into the foreignApps array

***

### assets?

> `optional` **assets**: `number`[]

Defined in: [src/types/app.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L52)

IDs of any assets to load into the foreignAssets array

***

### boxes?

> `optional` **boxes**: ([`BoxReference`](../../../Packages/Transact/type-aliases/BoxReference.md) \| [`BoxIdentifier`](../../app-manager/type-aliases/BoxIdentifier.md) \| [`BoxReference`](../../app-manager/interfaces/BoxReference.md))[]

Defined in: [src/types/app.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L46)

Any box references to load

***

### lease?

> `optional` **lease**: `string` \| `Uint8Array`

Defined in: [src/types/app.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L44)

The optional lease for the transaction

***

### rekeyTo?

> `optional` **rekeyTo**: `string` \| [`AddressWithTransactionSigner`](../../../Packages/Transact/interfaces/AddressWithTransactionSigner.md)

Defined in: [src/types/app.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L57)

Optional account / account address that should be authorised to transact on behalf of the from account the app call is sent from after this transaction.

**Note:** Use with extreme caution and review the [official rekey guidance](https://dev.algorand.co/concepts/accounts/rekeying) first.
