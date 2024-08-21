[@algorandfoundation/algokit-utils](../README.md) / [types/asset-manager](../modules/types_asset_manager.md) / AssetInformation

# Interface: AssetInformation

[types/asset-manager](../modules/types_asset_manager.md).AssetInformation

Information about an asset.

## Table of contents

### Properties

- [assetId](types_asset_manager.AssetInformation.md#assetid)
- [assetName](types_asset_manager.AssetInformation.md#assetname)
- [assetNameAsBytes](types_asset_manager.AssetInformation.md#assetnameasbytes)
- [clawback](types_asset_manager.AssetInformation.md#clawback)
- [creator](types_asset_manager.AssetInformation.md#creator)
- [decimals](types_asset_manager.AssetInformation.md#decimals)
- [defaultFrozen](types_asset_manager.AssetInformation.md#defaultfrozen)
- [freeze](types_asset_manager.AssetInformation.md#freeze)
- [manager](types_asset_manager.AssetInformation.md#manager)
- [metadataHash](types_asset_manager.AssetInformation.md#metadatahash)
- [reserve](types_asset_manager.AssetInformation.md#reserve)
- [total](types_asset_manager.AssetInformation.md#total)
- [unitName](types_asset_manager.AssetInformation.md#unitname)
- [unitNameAsBytes](types_asset_manager.AssetInformation.md#unitnameasbytes)
- [url](types_asset_manager.AssetInformation.md#url)
- [urlAsBytes](types_asset_manager.AssetInformation.md#urlasbytes)

## Properties

### assetId

• **assetId**: `bigint`

The ID of the asset.

#### Defined in

[src/types/asset-manager.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L21)

___

### assetName

• `Optional` **assetName**: `string`

The optional name of the asset.

Max size is 32 bytes.

#### Defined in

[src/types/asset-manager.ts:112](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L112)

___

### assetNameAsBytes

• `Optional` **assetNameAsBytes**: `Uint8Array`

The optional name of the asset.

Max size is 32 bytes.

#### Defined in

[src/types/asset-manager.ts:118](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L118)

___

### clawback

• `Optional` **clawback**: `string`

The address of the optional account that can clawback holdings of this asset from any account.

The clawback account has the ability to **unconditionally take assets from any account**.

If empty, clawback is not permitted.

If not set the field is permanently empty.

#### Defined in

[src/types/asset-manager.ts:94](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L94)

___

### creator

• **creator**: `string`

The address of the account that created the asset.

This is the address where the parameters for this asset can be found,
and also the address where unwanted asset units can be sent when
closing out an asset position and opting-out of the asset.

#### Defined in

[src/types/asset-manager.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L29)

___

### decimals

• **decimals**: `number`

The amount of decimal places the asset was created with.

* If 0, the asset is not divisible;
* If 1, the base unit of the asset is in tenths;
* If 2, the base unit of the asset is in hundredths;
* If 3, the base unit of the asset is in thousandths;
* and so on up to 19 decimal places.

#### Defined in

[src/types/asset-manager.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L45)

___

### defaultFrozen

• `Optional` **defaultFrozen**: `boolean`

Whether the asset was frozen by default for all accounts.

If `true` then for anyone apart from the creator to hold the
asset it needs to be unfrozen per account using an asset freeze
transaction from the `freeze` account.

#### Defined in

[src/types/asset-manager.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L53)

___

### freeze

• `Optional` **freeze**: `string`

The address of the optional account that can be used to freeze or unfreeze holdings of this asset for any account.

If empty, freezing is not permitted.

If not set the field is permanently empty.

#### Defined in

[src/types/asset-manager.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L83)

___

### manager

• `Optional` **manager**: `string`

The address of the optional account that can manage the configuration of the asset and destroy it.

If not set the asset is permanently immutable.

#### Defined in

[src/types/asset-manager.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L59)

___

### metadataHash

• `Optional` **metadataHash**: `Uint8Array`

32-byte hash of some metadata that is relevant to the asset and/or asset holders.

The format of this metadata is up to the application.

#### Defined in

[src/types/asset-manager.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L136)

___

### reserve

• `Optional` **reserve**: `string`

The address of the optional account that holds the reserve (uncirculated supply) units of the asset.

This address has no specific authority in the protocol itself and is informational only.

Some standards like [ARC-19](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0019.md)
rely on this field to hold meaningful data.

It can be used in the case where you want to signal to holders of your asset that the uncirculated units
of the asset reside in an account that is different from the default creator account.

If not set the field is permanently empty.

#### Defined in

[src/types/asset-manager.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L74)

___

### total

• **total**: `bigint`

The total amount of the smallest divisible (decimal) units that were created of the asset.

For example, if `decimals` is, say, 2, then for every 100 `total` there is 1 whole unit.

#### Defined in

[src/types/asset-manager.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L35)

___

### unitName

• `Optional` **unitName**: `string`

The optional name of the unit of this asset (e.g. ticker name).

Max size is 8 bytes.

#### Defined in

[src/types/asset-manager.ts:100](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L100)

___

### unitNameAsBytes

• `Optional` **unitNameAsBytes**: `Uint8Array`

The optional name of the unit of this asset (e.g. ticker name).

Max size is 8 bytes.

#### Defined in

[src/types/asset-manager.ts:106](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L106)

___

### url

• `Optional` **url**: `string`

Optional URL where more information about the asset can be retrieved (e.g. metadata).

Max size is 96 bytes.

#### Defined in

[src/types/asset-manager.ts:124](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L124)

___

### urlAsBytes

• `Optional` **urlAsBytes**: `Uint8Array`

Optional URL where more information about the asset can be retrieved (e.g. metadata).

Max size is 96 bytes.

#### Defined in

[src/types/asset-manager.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/asset-manager.ts#L130)
