[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/composer](../README.md) / TransactionComposerParams

# Type Alias: TransactionComposerParams

> **TransactionComposerParams** = `object`

Defined in: [src/types/composer.ts:499](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L499)

Parameters to create an `TransactionComposer`.

## Properties

### algod

> **algod**: `algosdk.Algodv2`

Defined in: [src/types/composer.ts:501](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L501)

The algod client to use to get suggestedParams and send the transaction group

***

### appManager?

> `optional` **appManager**: [`AppManager`](../../app-manager/classes/AppManager.md)

Defined in: [src/types/composer.ts:514](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L514)

An existing `AppManager` to use to manage app compilation and cache compilation results.

If not specified then an ephemeral one will be created.

***

### defaultValidityWindow?

> `optional` **defaultValidityWindow**: `bigint`

Defined in: [src/types/composer.ts:509](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L509)

How many rounds a transaction should be valid for by default; if not specified
then will be 10 rounds (or 1000 rounds if issuing transactions to LocalNet).

***

### errorTransformers?

> `optional` **errorTransformers**: [`ErrorTransformer`](ErrorTransformer.md)[]

Defined in: [src/types/composer.ts:519](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L519)

An array of error transformers to use when an error is caught in simulate or execute
callbacks can later be registered with `registerErrorTransformer`

***

### getSigner()

> **getSigner**: (`address`) => `algosdk.TransactionSigner`

Defined in: [src/types/composer.ts:503](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L503)

The function used to get the TransactionSigner for a given address

#### Parameters

##### address

`string` | `Address`

#### Returns

`algosdk.TransactionSigner`

***

### getSuggestedParams()?

> `optional` **getSuggestedParams**: () => `Promise`\<`algosdk.SuggestedParams`\>

Defined in: [src/types/composer.ts:505](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L505)

The method used to get SuggestedParams for transactions in the group

#### Returns

`Promise`\<`algosdk.SuggestedParams`\>
