[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / MiniAssetHolding

# Interface: MiniAssetHolding

[types/indexer](../modules/types_indexer.md).MiniAssetHolding

Describes an asset holding for an account of a known asset. https://developer.algorand.org/docs/rest-apis/indexer/#miniassetholding

## Table of contents

### Properties

- [address](types_indexer.MiniAssetHolding.md#address)
- [amount](types_indexer.MiniAssetHolding.md#amount)
- [deleted](types_indexer.MiniAssetHolding.md#deleted)
- [is-frozen](types_indexer.MiniAssetHolding.md#is-frozen)
- [opted-in-at-round](types_indexer.MiniAssetHolding.md#opted-in-at-round)
- [opted-out-at-round](types_indexer.MiniAssetHolding.md#opted-out-at-round)

## Properties

### address

• **address**: `string`

Address of the account that holds the asset.

#### Defined in

[src/types/indexer.ts:877](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L877)

___

### amount

• **amount**: `number` \| `bigint`

(a) number of units held.

#### Defined in

[src/types/indexer.ts:881](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L881)

___

### deleted

• `Optional` **deleted**: `boolean`

Whether or not the asset holding is currently deleted from its account.

#### Defined in

[src/types/indexer.ts:883](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L883)

___

### is-frozen

• **is-frozen**: `boolean`

[f] whether or not the holding is frozen.

#### Defined in

[src/types/indexer.ts:887](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L887)

___

### opted-in-at-round

• `Optional` **opted-in-at-round**: `number`

Round during which the account opted into this asset holding.

#### Defined in

[src/types/indexer.ts:889](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L889)

___

### opted-out-at-round

• `Optional` **opted-out-at-round**: `number`

Round during which the account opted out of this asset holding.

#### Defined in

[src/types/indexer.ts:891](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L891)
