[@algorandfoundation/algokit-utils](../README.md) / [index](index.md) / indexer

# Namespace: indexer

[index](index.md).indexer

## Table of contents

### Type Aliases

- [SearchForTransactions](index.indexer.md#searchfortransactions)

### Functions

- [executePaginatedRequest](index.indexer.md#executepaginatedrequest)
- [lookupAccountCreatedApplicationByAddress](index.indexer.md#lookupaccountcreatedapplicationbyaddress)
- [lookupAssetHoldings](index.indexer.md#lookupassetholdings)
- [searchTransactions](index.indexer.md#searchtransactions)

## Type Aliases

### SearchForTransactions

Ƭ **SearchForTransactions**: `ReturnType`\<`Indexer`[``"searchForTransactions"``]\>

#### Defined in

[src/indexer-lookup.ts:5](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L5)

## Functions

### executePaginatedRequest

▸ **executePaginatedRequest**\<`TResult`, `TRequest`\>(`extractItems`, `buildRequest`): `Promise`\<`TResult`[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `TResult` |
| `TRequest` | extends `Object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extractItems` | (`response`: `any`) => `TResult`[] |
| `buildRequest` | (`nextToken?`: `string`) => `TRequest` |

#### Returns

`Promise`\<`TResult`[]\>

#### Defined in

[src/indexer-lookup.ts:124](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L124)

___

### lookupAccountCreatedApplicationByAddress

▸ **lookupAccountCreatedApplicationByAddress**(`indexer`, `address`, `getAll?`, `paginationLimit?`): `Promise`\<`algosdk.indexerModels.Application`[]\>

Looks up applications that were created by the given address; will automatically paginate through all data.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `indexer` | `IndexerClient` | `undefined` | An indexer instance |
| `address` | `string` \| `Address` | `undefined` | The address of the creator to look up |
| `getAll` | `undefined` \| `boolean` | `undefined` | Whether or not to include deleted applications |
| `paginationLimit?` | `number` | `undefined` | The number of records to return per paginated request, default 1000 |

#### Returns

`Promise`\<`algosdk.indexerModels.Application`[]\>

The list of application results

#### Defined in

[src/indexer-lookup.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L17)

___

### lookupAssetHoldings

▸ **lookupAssetHoldings**(`indexer`, `assetId`, `options?`, `paginationLimit?`): `Promise`\<`algosdk.indexerModels.MiniAssetHolding`[]\>

Looks up asset holdings for the given asset; will automatically paginate through all data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexer` | `IndexerClient` | An indexer instance |
| `assetId` | `number` \| `bigint` | The ID of the asset to look up holdings for |
| `options?` | [`LookupAssetHoldingsOptions`](../interfaces/types_indexer.LookupAssetHoldingsOptions.md) | Optional options to control the lookup |
| `paginationLimit?` | `number` | The number of records to return per paginated request, default 1000 |

#### Returns

`Promise`\<`algosdk.indexerModels.MiniAssetHolding`[]\>

The list of application results

#### Defined in

[src/indexer-lookup.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L51)

___

### searchTransactions

▸ **searchTransactions**(`indexer`, `searchCriteria`, `paginationLimit?`): `Promise`\<`algosdk.indexerModels.TransactionsResponse`\>

Allows transactions to be searched for the given criteria.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexer` | `IndexerClient` | An indexer client |
| `searchCriteria` | (`s`: `default`) => `default` | The criteria to search for |
| `paginationLimit?` | `number` | The number of records to return per paginated request, default 1000 |

#### Returns

`Promise`\<`algosdk.indexerModels.TransactionsResponse`\>

The search results

#### Defined in

[src/indexer-lookup.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L90)
