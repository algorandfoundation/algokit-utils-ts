[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/composer](../README.md) / AssetOptOutParams

# Type Alias: AssetOptOutParams

> **AssetOptOutParams** = [`CommonTransactionParams`](CommonTransactionParams.md) & `object`

Defined in: [src/types/composer.ts:310](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L310)

Parameters to define an asset opt-out transaction.

## Type declaration

### assetId

> **assetId**: `bigint`

ID of the asset that will be opted-out of.

### creator

> **creator**: `string` \| `Address`

The address of the asset creator account to close the asset
  position to (any remaining asset units will be sent to this account).
