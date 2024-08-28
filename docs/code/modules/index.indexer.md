[@algorandfoundation/algokit-utils](../README.md) / [index](index.md) / indexer

# Namespace: indexer

[index](index.md).indexer

## Table of contents

### Functions

- [executePaginatedRequest](index.indexer.md#executepaginatedrequest)
- [lookupAccountByAddress](index.indexer.md#lookupaccountbyaddress)
- [lookupAccountCreatedApplicationByAddress](index.indexer.md#lookupaccountcreatedapplicationbyaddress)
- [lookupAssetHoldings](index.indexer.md#lookupassetholdings)
- [lookupTransactionById](index.indexer.md#lookuptransactionbyid)
- [searchTransactions](index.indexer.md#searchtransactions)

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

[src/indexer-lookup.ts:152](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L152)

___

### lookupAccountByAddress

▸ **lookupAccountByAddress**(`accountAddress`, `indexer`): `Promise`\<[`AccountLookupResult`](../interfaces/types_indexer.AccountLookupResult.md)\>

Looks up an account by address using Indexer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `accountAddress` | `string` | The address of the account to look up |
| `indexer` | `default` | An indexer client |

#### Returns

`Promise`\<[`AccountLookupResult`](../interfaces/types_indexer.AccountLookupResult.md)\>

The result of the look-up

#### Defined in

[src/indexer-lookup.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L33)

___

### lookupAccountCreatedApplicationByAddress

▸ **lookupAccountCreatedApplicationByAddress**(`indexer`, `address`, `getAll?`, `paginationLimit?`): `Promise`\<[`ApplicationResult`](../interfaces/types_indexer.ApplicationResult.md)[]\>

Looks up applications that were created by the given address; will automatically paginate through all data.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `indexer` | `default` | `undefined` | An indexer instance |
| `address` | `string` | `undefined` | The address of the creator to look up |
| `getAll` | `undefined` \| `boolean` | `undefined` | Whether or not to include deleted applications |
| `paginationLimit?` | `number` | `undefined` | The number of records to return per paginated request, default 1000 |

#### Returns

`Promise`\<[`ApplicationResult`](../interfaces/types_indexer.ApplicationResult.md)[]\>

The list of application results

#### Defined in

[src/indexer-lookup.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L45)

___

### lookupAssetHoldings

▸ **lookupAssetHoldings**(`indexer`, `assetId`, `options?`, `paginationLimit?`): `Promise`\<[`MiniAssetHolding`](../interfaces/types_indexer.MiniAssetHolding.md)[]\>

Looks up asset holdings for the given asset; will automatically paginate through all data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexer` | `default` | An indexer instance |
| `assetId` | `number` \| `bigint` | The ID of the asset to look up holdings for |
| `options?` | [`LookupAssetHoldingsOptions`](../interfaces/types_indexer.LookupAssetHoldingsOptions.md) | Optional options to control the lookup |
| `paginationLimit?` | `number` | The number of records to return per paginated request, default 1000 |

#### Returns

`Promise`\<[`MiniAssetHolding`](../interfaces/types_indexer.MiniAssetHolding.md)[]\>

The list of application results

#### Defined in

[src/indexer-lookup.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L79)

___

### lookupTransactionById

▸ **lookupTransactionById**(`transactionId`, `indexer`): `Promise`\<[`TransactionLookupResult`](../interfaces/types_indexer.TransactionLookupResult.md)\>

Looks up a transaction by ID using Indexer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionId` | `string` | The ID of the transaction to look up |
| `indexer` | `default` | An indexer client |

#### Returns

`Promise`\<[`TransactionLookupResult`](../interfaces/types_indexer.TransactionLookupResult.md)\>

The result of the look-up

#### Defined in

[src/indexer-lookup.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L23)

___

### searchTransactions

▸ **searchTransactions**(`indexer`, `searchCriteria`, `paginationLimit?`): `Promise`\<[`TransactionSearchResults`](../interfaces/types_indexer.TransactionSearchResults.md)\>

Allows transactions to be searched for the given criteria.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexer` | `default` | An indexer client |
| `searchCriteria` | (`s`: `default`) => `default` | The criteria to search for |
| `paginationLimit?` | `number` | The number of records to return per paginated request, default 1000 |

#### Returns

`Promise`\<[`TransactionSearchResults`](../interfaces/types_indexer.TransactionSearchResults.md)\>

The search results

#### Defined in

[src/indexer-lookup.ts:118](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L118)
