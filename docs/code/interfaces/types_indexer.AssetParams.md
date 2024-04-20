[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / AssetParams

# Interface: AssetParams

[types/indexer](../modules/types_indexer.md).AssetParams

AssetParams specifies the parameters for an asset. https://developer.algorand.org/docs/rest-apis/indexer/#assetparams

## Table of contents

### Properties

- [clawback](types_indexer.AssetParams.md#clawback)
- [creator](types_indexer.AssetParams.md#creator)
- [decimals](types_indexer.AssetParams.md#decimals)
- [default-frozen](types_indexer.AssetParams.md#default-frozen)
- [freeze](types_indexer.AssetParams.md#freeze)
- [manager](types_indexer.AssetParams.md#manager)
- [metadata-hash](types_indexer.AssetParams.md#metadata-hash)
- [name](types_indexer.AssetParams.md#name)
- [name-b64](types_indexer.AssetParams.md#name-b64)
- [reserve](types_indexer.AssetParams.md#reserve)
- [total](types_indexer.AssetParams.md#total)
- [unit-name](types_indexer.AssetParams.md#unit-name)
- [unit-name-b64](types_indexer.AssetParams.md#unit-name-b64)
- [url](types_indexer.AssetParams.md#url)
- [url-b64](types_indexer.AssetParams.md#url-b64)

## Properties

### clawback

• `Optional` **clawback**: `string`

(c) Address of account used to clawback holdings of this asset. If empty,
clawback is not permitted.

#### Defined in

[src/types/indexer.ts:725](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L725)

___

### creator

• **creator**: `string`

The address that created this asset. This is the address where the parameters
for this asset can be found, and also the address where unwanted asset units can
be sent in the worst case.

#### Defined in

[src/types/indexer.ts:709](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L709)

___

### decimals

• **decimals**: `number` \| `bigint`

(dc) The number of digits to use after the decimal point when displaying this
asset. If 0, the asset is not divisible. If 1, the base unit of the asset is in
tenths. If 2, the base unit of the asset is in hundredths, and so on. This value
must be between 0 and 19 (inclusive).

#### Defined in

[src/types/indexer.ts:716](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L716)

___

### default-frozen

• `Optional` **default-frozen**: `boolean`

(df) Whether holdings of this asset are frozen by default.

#### Defined in

[src/types/indexer.ts:729](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L729)

___

### freeze

• `Optional` **freeze**: `string`

(f) Address of account used to freeze holdings of this asset. If empty, freezing
is not permitted.

#### Defined in

[src/types/indexer.ts:734](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L734)

___

### manager

• `Optional` **manager**: `string`

(m) Address of account used to manage the keys of this asset and to destroy it.

#### Defined in

[src/types/indexer.ts:738](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L738)

___

### metadata-hash

• `Optional` **metadata-hash**: `Uint8Array`

(am) A commitment to some unspecified asset metadata. The format of this
metadata is up to the application.

#### Defined in

[src/types/indexer.ts:743](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L743)

___

### name

• `Optional` **name**: `string`

(an) Name of this asset, as supplied by the creator. Included only when the
asset name is composed of printable utf-8 characters.

#### Defined in

[src/types/indexer.ts:748](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L748)

___

### name-b64

• `Optional` **name-b64**: `Uint8Array`

Base64 encoded name of this asset, as supplied by the creator.

#### Defined in

[src/types/indexer.ts:752](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L752)

___

### reserve

• `Optional` **reserve**: `string`

(r) Address of account holding reserve (non-minted) units of this asset.

#### Defined in

[src/types/indexer.ts:756](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L756)

___

### total

• **total**: `number` \| `bigint`

(t) The total number of units of this asset.

#### Defined in

[src/types/indexer.ts:720](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L720)

___

### unit-name

• `Optional` **unit-name**: `string`

(un) Name of a unit of this asset, as supplied by the creator. Included only
when the name of a unit of this asset is composed of printable utf-8 characters.

#### Defined in

[src/types/indexer.ts:761](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L761)

___

### unit-name-b64

• `Optional` **unit-name-b64**: `Uint8Array`

Base64 encoded name of a unit of this asset, as supplied by the creator.

#### Defined in

[src/types/indexer.ts:765](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L765)

___

### url

• `Optional` **url**: `string`

(au) URL where more information about the asset can be retrieved. Included only
when the URL is composed of printable utf-8 characters.

#### Defined in

[src/types/indexer.ts:770](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L770)

___

### url-b64

• `Optional` **url-b64**: `Uint8Array`

Base64 encoded URL where more information about the asset can be retrieved.

#### Defined in

[src/types/indexer.ts:774](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L774)
