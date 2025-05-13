[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / lookupAssetHoldings

# Function: lookupAssetHoldings()

> **lookupAssetHoldings**(`indexer`, `assetId`, `options?`, `paginationLimit?`): `Promise`\<`MiniAssetHolding`[]\>

Defined in: [src/indexer-lookup.ts:72](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L72)

Looks up asset holdings for the given asset; will automatically paginate through all data.

## Parameters

### indexer

`IndexerClient`

An indexer instance

### assetId

The ID of the asset to look up holdings for

`number` | `bigint`

### options?

[`LookupAssetHoldingsOptions`](../../types/indexer/interfaces/LookupAssetHoldingsOptions.md)

Optional options to control the lookup

### paginationLimit?

`number`

The number of records to return per paginated request, default 1000

## Returns

`Promise`\<`MiniAssetHolding`[]\>

The list of application results
