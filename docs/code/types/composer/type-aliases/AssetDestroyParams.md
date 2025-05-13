[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/composer](../README.md) / AssetDestroyParams

# Type Alias: AssetDestroyParams

> **AssetDestroyParams** = [`CommonTransactionParams`](CommonTransactionParams.md) & `object`

Defined in: [src/types/composer.ts:276](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L276)

Parameters to define an asset destroy transaction.

Created assets can be destroyed only by the asset manager account. All of the assets must be owned by the creator of the asset before the asset can be deleted.

## Type declaration

### assetId

> **assetId**: `bigint`

ID of the asset to destroy
