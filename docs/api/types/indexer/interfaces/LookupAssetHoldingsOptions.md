[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/indexer](../README.md) / LookupAssetHoldingsOptions

# Interface: LookupAssetHoldingsOptions

Defined in: [src/types/indexer.ts:2](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/indexer.ts#L2)

Options when looking up an asset's account holdings, https://dev.algorand.co/reference/rest-apis/indexer#get-v2assetsasset-idbalances

## Properties

### currencyGreaterThan?

> `optional` **currencyGreaterThan**: `number` \| `bigint`

Defined in: [src/types/indexer.ts:6](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/indexer.ts#L6)

Results should have a decimal units amount greater than this value.

***

### currencyLessThan?

> `optional` **currencyLessThan**: `number` \| `bigint`

Defined in: [src/types/indexer.ts:4](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/indexer.ts#L4)

Results should have a decimal units amount less than this value.

***

### includeAll?

> `optional` **includeAll**: `boolean`

Defined in: [src/types/indexer.ts:8](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/indexer.ts#L8)

Include all items including closed accounts and opted-out asset holdings.
