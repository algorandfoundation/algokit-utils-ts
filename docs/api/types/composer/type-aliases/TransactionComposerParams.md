[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/composer](../README.md) / TransactionComposerParams

# Type Alias: TransactionComposerParams

> **TransactionComposerParams** = `object`

Defined in: [src/types/composer.ts:189](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L189)

Parameters to create an `TransactionComposer`.

## Properties

### algod

> **algod**: [`AlgodClient`](../../../Subpaths/algod-client/classes/AlgodClient.md)

Defined in: [src/types/composer.ts:191](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L191)

The algod client to use to get suggestedParams and send the transaction group

***

### appManager?

> `optional` **appManager**: [`AppManager`](../../app-manager/classes/AppManager.md)

Defined in: [src/types/composer.ts:204](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L204)

An existing `AppManager` to use to manage app compilation and cache compilation results.

If not specified then an ephemeral one will be created.

***

### composerConfig?

> `optional` **composerConfig**: [`TransactionComposerConfig`](TransactionComposerConfig.md)

Defined in: [src/types/composer.ts:210](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L210)

***

### defaultValidityWindow?

> `optional` **defaultValidityWindow**: `bigint`

Defined in: [src/types/composer.ts:199](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L199)

How many rounds a transaction should be valid for by default; if not specified
then will be 10 rounds (or 1000 rounds if issuing transactions to LocalNet).

***

### errorTransformers?

> `optional` **errorTransformers**: [`ErrorTransformer`](ErrorTransformer.md)[]

Defined in: [src/types/composer.ts:209](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L209)

An array of error transformers to use when an error is caught in simulate or execute
callbacks can later be registered with `registerErrorTransformer`

***

### getSigner()

> **getSigner**: (`address`) => [`TransactionSigner`](../../../Subpaths/transact/type-aliases/TransactionSigner.md)

Defined in: [src/types/composer.ts:193](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L193)

The function used to get the TransactionSigner for a given address

#### Parameters

##### address

[`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

#### Returns

[`TransactionSigner`](../../../Subpaths/transact/type-aliases/TransactionSigner.md)

***

### getSuggestedParams()?

> `optional` **getSuggestedParams**: () => `Promise`\<[`SuggestedParams`](../../../Subpaths/algod-client/type-aliases/SuggestedParams.md)\>

Defined in: [src/types/composer.ts:195](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L195)

The method used to get SuggestedParams for transactions in the group

#### Returns

`Promise`\<[`SuggestedParams`](../../../Subpaths/algod-client/type-aliases/SuggestedParams.md)\>
