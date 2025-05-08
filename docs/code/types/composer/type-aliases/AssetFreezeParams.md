[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/composer](../README.md) / AssetFreezeParams

# Type Alias: AssetFreezeParams

> **AssetFreezeParams** = [`CommonTransactionParams`](CommonTransactionParams.md) & `object`

Defined in: [src/types/composer.ts:263](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L263)

Parameters to define an asset freeze transaction.

## Type declaration

### account

> **account**: `string` \| `Address`

The address of the account to freeze or unfreeze

### assetId

> **assetId**: `bigint`

The ID of the asset to freeze/unfreeze

### frozen

> **frozen**: `boolean`

Whether the assets in the account should be frozen
