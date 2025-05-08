[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/composer](../README.md) / OnlineKeyRegistrationParams

# Type Alias: OnlineKeyRegistrationParams

> **OnlineKeyRegistrationParams** = [`CommonTransactionParams`](CommonTransactionParams.md) & `object`

Defined in: [src/types/composer.ts:321](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L321)

Parameters to define an online key registration transaction.

## Type declaration

### selectionKey

> **selectionKey**: `Uint8Array`

The VRF public key

### stateProofKey?

> `optional` **stateProofKey**: `Uint8Array`

The 64 byte state proof public key commitment

### voteFirst

> **voteFirst**: `bigint`

The first round that the participation key is valid. Not to be confused with the `firstValid` round of the keyreg transaction

### voteKey

> **voteKey**: `Uint8Array`

The root participation public key

### voteKeyDilution

> **voteKeyDilution**: `bigint`

This is the dilution for the 2-level participation key. It determines the interval (number of rounds) for generating new ephemeral keys

### voteLast

> **voteLast**: `bigint`

The last round that the participation key is valid. Not to be confused with the `lastValid` round of the keyreg transaction
