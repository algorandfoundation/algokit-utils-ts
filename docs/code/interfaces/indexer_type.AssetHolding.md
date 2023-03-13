[algotstest](../README.md) / [indexer-type](../modules/indexer_type.md) / AssetHolding

# Interface: AssetHolding

[indexer-type](../modules/indexer_type.md).AssetHolding

## Table of contents

### Properties

- [amount](indexer_type.AssetHolding.md#amount)
- [asset-id](indexer_type.AssetHolding.md#asset-id)
- [creator](indexer_type.AssetHolding.md#creator)
- [deleted](indexer_type.AssetHolding.md#deleted)
- [is-frozen](indexer_type.AssetHolding.md#is-frozen)
- [opted-in-at-round](indexer_type.AssetHolding.md#opted-in-at-round)
- [opted-out-at-round](indexer_type.AssetHolding.md#opted-out-at-round)

## Properties

### amount

• **amount**: `number`

(a) number of units held.

#### Defined in

[indexer-type.ts:321](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L321)

___

### asset-id

• **asset-id**: `number`

Asset ID of the holding.

#### Defined in

[indexer-type.ts:325](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L325)

___

### creator

• **creator**: `string`

Address that created this asset. This is the address where the parameters for
this asset can be found, and also the address where unwanted asset units can be
sent in the worst case.

#### Defined in

[indexer-type.ts:331](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L331)

___

### deleted

• `Optional` **deleted**: `boolean`

#### Defined in

[indexer-type.ts:336](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L336)

___

### is-frozen

• **is-frozen**: `boolean`

(f) whether or not the holding is frozen.

#### Defined in

[indexer-type.ts:335](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L335)

___

### opted-in-at-round

• **opted-in-at-round**: `number`

#### Defined in

[indexer-type.ts:337](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L337)

___

### opted-out-at-round

• **opted-out-at-round**: `number`

#### Defined in

[indexer-type.ts:338](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-type.ts#L338)
