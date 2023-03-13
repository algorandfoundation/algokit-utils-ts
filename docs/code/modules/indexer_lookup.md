[algotstest](../README.md) / indexer-lookup

# Module: indexer-lookup

## Table of contents

### Functions

- [executePaginatedRequest](indexer_lookup.md#executepaginatedrequest)
- [lookupAccountCreatedApplicationByAddress](indexer_lookup.md#lookupaccountcreatedapplicationbyaddress)
- [lookupTransactionById](indexer_lookup.md#lookuptransactionbyid)
- [searchTransactions](indexer_lookup.md#searchtransactions)

## Functions

### executePaginatedRequest

▸ **executePaginatedRequest**<`TResult`, `TRequest`\>(`extractItems`, `buildRequest`): `Promise`<`TResult`[]\>

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

`Promise`<`TResult`[]\>

#### Defined in

[indexer-lookup.ts:92](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-lookup.ts#L92)

___

### lookupAccountCreatedApplicationByAddress

▸ **lookupAccountCreatedApplicationByAddress**(`indexer`, `address`, `getAll?`, `paginationLimit?`): `Promise`<[`ApplicationResult`](../interfaces/indexer_type.ApplicationResult.md)[]\>

Looks up applications that were created by the given address.

**`See`**

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `indexer` | `default` | `undefined` | An indexer instance |
| `address` | `string` | `undefined` | The address of the creator to look up |
| `getAll` | `undefined` \| `boolean` | `undefined` | Whether or not to include deleted applications |
| `paginationLimit?` | `number` | `undefined` | The number of records to return per paginated request, default |

#### Returns

`Promise`<[`ApplicationResult`](../interfaces/indexer_type.ApplicationResult.md)[]\>

The list of application results

#### Defined in

[indexer-lookup.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-lookup.ts#L25)

___

### lookupTransactionById

▸ **lookupTransactionById**(`transactionId`, `indexer`): `Promise`<[`TransactionLookupResult`](../interfaces/indexer_type.TransactionLookupResult.md)\>

Looks up a transaction by ID using Indexer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `transactionId` | `string` | The ID of the transaction to look up |
| `indexer` | `default` | An indexer client |

#### Returns

`Promise`<[`TransactionLookupResult`](../interfaces/indexer_type.TransactionLookupResult.md)\>

The result of the look-up

#### Defined in

[indexer-lookup.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-lookup.ts#L13)

___

### searchTransactions

▸ **searchTransactions**(`indexer`, `searchCriteria`, `paginationLimit?`): `Promise`<[`TransactionSearchResults`](../interfaces/indexer_type.TransactionSearchResults.md)\>

Allows transactions to be searched for the given criteria.

**`See`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `indexer` | `default` | An indexer client |
| `searchCriteria` | (`s`: `default`) => `default` | The criteria to search for |
| `paginationLimit?` | `number` | The number of records to return per paginated request, default |

#### Returns

`Promise`<[`TransactionSearchResults`](../interfaces/indexer_type.TransactionSearchResults.md)\>

The search results

#### Defined in

[indexer-lookup.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/b75e3eb/src/indexer-lookup.ts#L58)
