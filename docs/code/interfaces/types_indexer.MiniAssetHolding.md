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

[src/types/indexer.ts:925](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L925)

___

### amount

• **amount**: `number` \| `bigint`

(a) number of units held.

#### Defined in

[src/types/indexer.ts:929](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L929)

___

### deleted

• `Optional` **deleted**: `boolean`

Whether or not the asset holding is currently deleted from its account.

#### Defined in

[src/types/indexer.ts:931](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L931)

___

### is-frozen

• **is-frozen**: `boolean`

[f] whether or not the holding is frozen.

#### Defined in

[src/types/indexer.ts:935](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L935)

___

### opted-in-at-round

• `Optional` **opted-in-at-round**: `number`

Round during which the account opted into this asset holding.

#### Defined in

[src/types/indexer.ts:937](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L937)

___

### opted-out-at-round

• `Optional` **opted-out-at-round**: `number`

Round during which the account opted out of this asset holding.

#### Defined in

[src/types/indexer.ts:939](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L939)
