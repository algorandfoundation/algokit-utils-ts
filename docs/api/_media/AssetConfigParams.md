[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/composer](../README.md) / AssetConfigParams

# Type Alias: AssetConfigParams

> **AssetConfigParams** = [`CommonTransactionParams`](CommonTransactionParams.md) & `object`

Defined in: [src/transactions/asset-config.ts:126](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transactions/asset-config.ts#L126)

Parameters to define an asset reconfiguration transaction.

**Note:** The manager, reserve, freeze, and clawback addresses
are immutably empty if they are not set. If manager is not set then
all fields are immutable from that point forward.

## Type Declaration

### assetId

> **assetId**: `bigint`

ID of the asset to reconfigure

### clawback?

> `optional` **clawback**: [`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

The address of the optional account that can clawback holdings of this asset from any account.

**This field should be used with caution** as the clawback account has the ability to **unconditionally take assets from any account**.

If empty, clawback is not permitted.

If not set (`undefined` or `""`) the field will become permanently empty.

### freeze?

> `optional` **freeze**: [`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

The address of the optional account that can be used to freeze or unfreeze holdings of this asset for any account.

If empty, freezing is not permitted.

If not set (`undefined` or `""`) the field will become permanently empty.

### manager?

> `optional` **manager**: [`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

The address of the optional account that can manage the configuration of the asset and destroy it.

The configuration fields it can change are `manager`, `reserve`, `clawback`, and `freeze`.

If not set (`undefined` or `""`) the asset will become permanently immutable.

### reserve?

> `optional` **reserve**: [`ReadableAddress`](../../../algokit-utils/type-aliases/ReadableAddress.md)

The address of the optional account that holds the reserve (uncirculated supply) units of the asset.

This address has no specific authority in the protocol itself and is informational only.

Some standards like [ARC-19](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0019.md)
rely on this field to hold meaningful data.

It can be used in the case where you want to signal to holders of your asset that the uncirculated units
of the asset reside in an account that is different from the default creator account.

If not set (`undefined` or `""`) the field will become permanently empty.
