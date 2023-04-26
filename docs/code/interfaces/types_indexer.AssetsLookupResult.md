[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / AssetsLookupResult

# Interface: AssetsLookupResult

[types/indexer](../modules/types_indexer.md).AssetsLookupResult

Indexer result for an account's asset holdings,

**`See`**

https://developer.algorand.org/docs/rest-apis/indexer/#get-v2accountsaccount-idassets

## Table of contents

### Properties

- [assets](types_indexer.AssetsLookupResult.md#assets)
- [current-round](types_indexer.AssetsLookupResult.md#current-round)
- [next-token](types_indexer.AssetsLookupResult.md#next-token)

## Properties

### assets

• **assets**: [`AssetHolding`](types_indexer.AssetHolding.md)[]

The returned asset holdings

#### Defined in

[src/types/indexer.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L29)

___

### current-round

• **current-round**: `number`

Round at which the results were computed.

#### Defined in

[src/types/indexer.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L25)

___

### next-token

• **next-token**: `string`

Used for pagination, when making another request provide this token with the next parameter.

#### Defined in

[src/types/indexer.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L27)