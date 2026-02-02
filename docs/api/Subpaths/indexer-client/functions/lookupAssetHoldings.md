[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/indexer-client](../README.md) / lookupAssetHoldings

# Function: lookupAssetHoldings()

> **lookupAssetHoldings**(`indexer`, `assetId`, `options?`, `paginationLimit?`): `Promise`\<[`MiniAssetHolding`](../type-aliases/MiniAssetHolding.md)[]\>

Defined in: [src/indexer-client/indexer-lookup.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/indexer-client/indexer-lookup.ts#L54)

Looks up asset holdings for the given asset; will automatically paginate through all data.

## Parameters

### indexer

[`IndexerClient`](../classes/IndexerClient.md)

An indexer instance

### assetId

The ID of the asset to look up holdings for

`number` | `bigint`

### options?

[`LookupAssetHoldingsOptions`](../../../algokit-utils/interfaces/LookupAssetHoldingsOptions.md)

Optional options to control the lookup

### paginationLimit?

`number`

The number of records to return per paginated request, default 1000

## Returns

`Promise`\<[`MiniAssetHolding`](../type-aliases/MiniAssetHolding.md)[]\>

The list of application results
