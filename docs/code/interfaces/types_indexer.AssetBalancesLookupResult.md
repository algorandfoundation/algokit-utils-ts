[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / AssetBalancesLookupResult

# Interface: AssetBalancesLookupResult

[types/indexer](../modules/types_indexer.md).AssetBalancesLookupResult

Indexer result for an asset's account holdings, https://developer.algorand.org/docs/rest-apis/indexer/#get-v2assetsasset-idbalances

## Table of contents

### Properties

- [balances](types_indexer.AssetBalancesLookupResult.md#balances)
- [current-round](types_indexer.AssetBalancesLookupResult.md#current-round)
- [next-token](types_indexer.AssetBalancesLookupResult.md#next-token)

## Properties

### balances

• **balances**: [`MiniAssetHolding`](types_indexer.MiniAssetHolding.md)[]

The list of accounts who hold this asset with their balance

#### Defined in

[src/types/indexer.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L78)

___

### current-round

• **current-round**: `number`

Round at which the results were computed.

#### Defined in

[src/types/indexer.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L74)

___

### next-token

• **next-token**: `string`

Used for pagination, when making another request provide this token with the next parameter.

#### Defined in

[src/types/indexer.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/indexer.ts#L76)
