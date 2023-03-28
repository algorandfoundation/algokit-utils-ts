[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / AssetHolding

# Interface: AssetHolding

[types/indexer](../modules/types_indexer.md).AssetHolding

## Table of contents

### Properties

- [amount](types_indexer.AssetHolding.md#amount)
- [asset-id](types_indexer.AssetHolding.md#asset-id)
- [creator](types_indexer.AssetHolding.md#creator)
- [deleted](types_indexer.AssetHolding.md#deleted)
- [is-frozen](types_indexer.AssetHolding.md#is-frozen)
- [opted-in-at-round](types_indexer.AssetHolding.md#opted-in-at-round)
- [opted-out-at-round](types_indexer.AssetHolding.md#opted-out-at-round)

## Properties

### amount

• **amount**: `number`

(a) number of units held.

#### Defined in

[src/types/indexer.ts:321](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L321)

___

### asset-id

• **asset-id**: `number`

Asset ID of the holding.

#### Defined in

[src/types/indexer.ts:325](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L325)

___

### creator

• **creator**: `string`

Address that created this asset. This is the address where the parameters for
this asset can be found, and also the address where unwanted asset units can be
sent in the worst case.

#### Defined in

[src/types/indexer.ts:331](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L331)

___

### deleted

• `Optional` **deleted**: `boolean`

#### Defined in

[src/types/indexer.ts:336](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L336)

___

### is-frozen

• **is-frozen**: `boolean`

(f) whether or not the holding is frozen.

#### Defined in

[src/types/indexer.ts:335](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L335)

___

### opted-in-at-round

• **opted-in-at-round**: `number`

#### Defined in

[src/types/indexer.ts:337](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L337)

___

### opted-out-at-round

• **opted-out-at-round**: `number`

#### Defined in

[src/types/indexer.ts:338](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L338)
