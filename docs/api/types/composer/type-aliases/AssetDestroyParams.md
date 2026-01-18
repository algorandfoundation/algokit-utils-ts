[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/composer](../README.md) / AssetDestroyParams

# Type Alias: AssetDestroyParams

> **AssetDestroyParams** = [`CommonTransactionParams`](CommonTransactionParams.md) & `object`

Defined in: [src/transactions/asset-config.ts:184](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/transactions/asset-config.ts#L184)

Parameters to define an asset destroy transaction.

Created assets can be destroyed only by the asset manager account. All of the assets must be owned by the creator of the asset before the asset can be deleted.

## Type Declaration

### assetId

> **assetId**: `bigint`

ID of the asset to destroy
