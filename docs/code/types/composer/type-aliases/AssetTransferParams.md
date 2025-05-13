[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/composer](../README.md) / AssetTransferParams

# Type Alias: AssetTransferParams

> **AssetTransferParams** = [`CommonTransactionParams`](CommonTransactionParams.md) & `object`

Defined in: [src/types/composer.ts:282](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/composer.ts#L282)

Parameters to define an asset transfer transaction.

## Type declaration

### amount

> **amount**: `bigint`

Amount of the asset to transfer (in smallest divisible (decimal) units).

### assetId

> **assetId**: `bigint`

ID of the asset to transfer.

### clawbackTarget?

> `optional` **clawbackTarget**: `string` \| `Address`

Optional address of an account to clawback the asset from.

Requires the sender to be the clawback account.

**Warning:** Be careful with this parameter as it can lead to unexpected loss of funds if not used correctly.

### closeAssetTo?

> `optional` **closeAssetTo**: `string` \| `Address`

Optional address of an account to close the asset position to.

**Warning:** Be careful with this parameter as it can lead to loss of funds if not used correctly.

### receiver

> **receiver**: `string` \| `Address`

The address of the account that will receive the asset unit(s).
