[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/composer](../README.md) / AssetTransferParams

# Type Alias: AssetTransferParams

> **AssetTransferParams** = [`CommonTransactionParams`](CommonTransactionParams.md) & `object`

Defined in: [src/transactions/asset-transfer.ts:7](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/asset-transfer.ts#L7)

Parameters to define an asset transfer transaction.

## Type Declaration

### amount

> **amount**: `bigint`

Amount of the asset to transfer (in smallest divisible (decimal) units).

### assetId

> **assetId**: `bigint`

ID of the asset to transfer.

### clawbackTarget?

> `optional` **clawbackTarget**: [`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

Optional address of an account to clawback the asset from.

Requires the sender to be the clawback account.

**Warning:** Be careful with this parameter as it can lead to unexpected loss of funds if not used correctly.

### closeAssetTo?

> `optional` **closeAssetTo**: [`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

Optional address of an account to close the asset position to.

**Warning:** Be careful with this parameter as it can lead to loss of funds if not used correctly.

### receiver

> **receiver**: [`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

The address of the account that will receive the asset unit(s).
