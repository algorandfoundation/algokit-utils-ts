[@algorandfoundation/algokit-utils](../README.md) / [index](index.md) / indexer

# Namespace: indexer

[index](index.md).indexer

## Table of contents

### Type Aliases

- [SearchForTransactionsCriteria](index.indexer.md#searchfortransactionscriteria)

### Functions

- [executePaginatedRequest](index.indexer.md#executepaginatedrequest)
- [lookupAccountCreatedApplicationByAddress](index.indexer.md#lookupaccountcreatedapplicationbyaddress)
- [lookupAssetHoldings](index.indexer.md#lookupassetholdings)
- [searchTransactions](index.indexer.md#searchtransactions)

## Type Aliases

### SearchForTransactionsCriteria

Ƭ **SearchForTransactionsCriteria**: `Omit`\<`NonNullable`\<`Parameters`\<`IndexerClient`[``"searchForTransactions"``]\>[``0``]\>, ``"limit"`` \| ``"next"``\>

#### Defined in

[src/indexer-lookup.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L11)

## Functions

### executePaginatedRequest

▸ **executePaginatedRequest**\<`TResult`, `TRequest`\>(`extractItems`, `buildRequest`): `Promise`\<`TResult`[]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TResult` | `TResult` |
| `TRequest` | extends `Promise`\<`any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `extractItems` | (`response`: `any`) => `TResult`[] |
| `buildRequest` | (`nextToken?`: `string`) => `TRequest` |

#### Returns

`Promise`\<`TResult`[]\>

#### Defined in

[src/indexer-lookup.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L120)

___

### lookupAccountCreatedApplicationByAddress

▸ **lookupAccountCreatedApplicationByAddress**(`indexer`, `address`, `getAll?`, `paginationLimit?`): `Promise`\<`Application`[]\>

Looks up applications that were created by the given address; will automatically paginate through all data.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `indexer` | `IndexerClient` | `undefined` | An indexer instance |
| `address` | `string` \| [`Address`](../classes/index.Address.md) | `undefined` | The address of the creator to look up |
| `getAll` | `boolean` | `true` | Whether or not to include deleted applications. Default true. |
| `paginationLimit?` | `number` | `undefined` | The number of records to return per paginated request, default 1000 |

#### Returns

`Promise`\<`Application`[]\>

The list of application results

#### Defined in

[src/indexer-lookup.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L23)

___

### lookupAssetHoldings

▸ **lookupAssetHoldings**(`indexer`, `assetId`, `options?`, `paginationLimit?`): `Promise`\<`MiniAssetHolding`[]\>

Looks up asset holdings for the given asset; will automatically paginate through all data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexer` | `IndexerClient` | An indexer instance |
| `assetId` | `number` \| `bigint` | The ID of the asset to look up holdings for |
| `options?` | [`LookupAssetHoldingsOptions`](../interfaces/types_indexer.LookupAssetHoldingsOptions.md) | Optional options to control the lookup |
| `paginationLimit?` | `number` | The number of records to return per paginated request, default 1000 |

#### Returns

`Promise`\<`MiniAssetHolding`[]\>

The list of application results

#### Defined in

[src/indexer-lookup.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L54)

___

### searchTransactions

▸ **searchTransactions**(`indexer`, `searchCriteria`, `paginationLimit?`): `Promise`\<`TransactionsResponse`\>

Allows transactions to be searched for the given criteria.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexer` | `IndexerClient` | An indexer client |
| `searchCriteria` | [`SearchForTransactionsCriteria`](index.indexer.md#searchfortransactionscriteria) | The criteria to search for |
| `paginationLimit?` | `number` | The number of records to return per paginated request, default 1000 |

#### Returns

`Promise`\<`TransactionsResponse`\>

The search results

#### Defined in

[src/indexer-lookup.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L86)
