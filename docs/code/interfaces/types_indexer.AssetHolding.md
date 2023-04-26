[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / AssetHolding

# Interface: AssetHolding

[types/indexer](../modules/types_indexer.md).AssetHolding

Describes an asset held by an account. https://developer.algorand.org/docs/rest-apis/indexer/#assetholding

## Table of contents

### Properties

- [amount](types_indexer.AssetHolding.md#amount)
- [asset-id](types_indexer.AssetHolding.md#asset-id)
- [deleted](types_indexer.AssetHolding.md#deleted)
- [is-frozen](types_indexer.AssetHolding.md#is-frozen)
- [opted-in-at-round](types_indexer.AssetHolding.md#opted-in-at-round)
- [opted-out-at-round](types_indexer.AssetHolding.md#opted-out-at-round)

## Properties

### amount

• **amount**: `number`

(a) number of units held.

#### Defined in

[src/types/indexer.ts:642](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L642)

___

### asset-id

• **asset-id**: `number`

Asset ID of the holding.

#### Defined in

[src/types/indexer.ts:646](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L646)

___

### deleted

• `Optional` **deleted**: `boolean`

Whether or not the asset holding is currently deleted from its account.

#### Defined in

[src/types/indexer.ts:648](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L648)

___

### is-frozen

• **is-frozen**: `boolean`

[f] whether or not the holding is frozen.

#### Defined in

[src/types/indexer.ts:652](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L652)

___

### opted-in-at-round

• **opted-in-at-round**: `number`

Round during which the account opted into this asset holding.

#### Defined in

[src/types/indexer.ts:654](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L654)

___

### opted-out-at-round

• **opted-out-at-round**: `number`

Round during which the account opted out of this asset holding.

#### Defined in

[src/types/indexer.ts:656](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L656)
