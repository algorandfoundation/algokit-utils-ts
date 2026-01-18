[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/composer](../README.md) / AssetOptOutParams

# Type Alias: AssetOptOutParams

> **AssetOptOutParams** = [`CommonTransactionParams`](CommonTransactionParams.md) & `object`

Defined in: [src/transactions/asset-transfer.ts:35](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/transactions/asset-transfer.ts#L35)

Parameters to define an asset opt-out transaction.

## Type Declaration

### assetId

> **assetId**: `bigint`

ID of the asset that will be opted-out of.

### creator

> **creator**: [`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

The address of the asset creator account to close the asset
  position to (any remaining asset units will be sent to this account).
