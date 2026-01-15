[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/composer](../README.md) / AssetFreezeParams

# Type Alias: AssetFreezeParams

> **AssetFreezeParams** = [`CommonTransactionParams`](CommonTransactionParams.md) & `object`

Defined in: [src/transactions/asset-config.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/asset-config.ts#L171)

Parameters to define an asset freeze transaction.

## Type Declaration

### assetId

> **assetId**: `bigint`

The ID of the asset to freeze/unfreeze

### freezeTarget

> **freezeTarget**: [`ReadableAddress`](../../../index/type-aliases/ReadableAddress.md)

The address of the account to freeze or unfreeze

### frozen

> **frozen**: `boolean`

Whether the assets in the account should be frozen
