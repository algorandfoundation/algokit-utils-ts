[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/indexer-client](../README.md) / AssetHoldingsResponse

# Type Alias: AssetHoldingsResponse

> **AssetHoldingsResponse** = `object`

Defined in: [packages/indexer\_client/src/models/asset-holdings-response.ts:6](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/asset-holdings-response.ts#L6)

## Properties

### assets

> **assets**: [`AssetHolding`](AssetHolding.md)[]

Defined in: [packages/indexer\_client/src/models/asset-holdings-response.ts:16](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/asset-holdings-response.ts#L16)

***

### currentRound

> **currentRound**: `bigint`

Defined in: [packages/indexer\_client/src/models/asset-holdings-response.ts:10](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/asset-holdings-response.ts#L10)

Round at which the results were computed.

***

### nextToken?

> `optional` **nextToken**: `string`

Defined in: [packages/indexer\_client/src/models/asset-holdings-response.ts:15](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/asset-holdings-response.ts#L15)

Used for pagination, when making another request provide this token with the next parameter.
