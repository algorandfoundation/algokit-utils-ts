[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/composer](../README.md) / TransactionComposerParams

# Type Alias: TransactionComposerParams

> **TransactionComposerParams** = `object`

Defined in: [src/types/composer.ts:479](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L479)

Parameters to create an `TransactionComposer`.

## Properties

### algod

> **algod**: `algosdk.Algodv2`

Defined in: [src/types/composer.ts:481](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L481)

The algod client to use to get suggestedParams and send the transaction group

***

### appManager?

> `optional` **appManager**: [`AppManager`](../../app-manager/classes/AppManager.md)

Defined in: [src/types/composer.ts:494](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L494)

An existing `AppManager` to use to manage app compilation and cache compilation results.

If not specified than an ephemeral one will be created.

***

### defaultValidityWindow?

> `optional` **defaultValidityWindow**: `bigint`

Defined in: [src/types/composer.ts:489](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L489)

How many rounds a transaction should be valid for by default; if not specified
then will be 10 rounds (or 1000 rounds if issuing transactions to LocalNet).

***

### getSigner()

> **getSigner**: (`address`) => `algosdk.TransactionSigner`

Defined in: [src/types/composer.ts:483](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L483)

The function used to get the TransactionSigner for a given address

#### Parameters

##### address

`string` | `Address`

#### Returns

`algosdk.TransactionSigner`

***

### getSuggestedParams()?

> `optional` **getSuggestedParams**: () => `Promise`\<`algosdk.SuggestedParams`\>

Defined in: [src/types/composer.ts:485](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L485)

The method used to get SuggestedParams for transactions in the group

#### Returns

`Promise`\<`algosdk.SuggestedParams`\>
