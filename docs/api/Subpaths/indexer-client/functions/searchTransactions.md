[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/indexer-client](../README.md) / searchTransactions

# Function: searchTransactions()

> **searchTransactions**(`indexer`, `searchCriteria`, `paginationLimit?`): `Promise`\<[`TransactionsResponse`](../type-aliases/TransactionsResponse.md)\>

Defined in: [src/indexer-client/indexer-lookup.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-client/indexer-lookup.ts#L86)

Allows transactions to be searched for the given criteria.

## Parameters

### indexer

[`IndexerClient`](../classes/IndexerClient.md)

An indexer client

### searchCriteria

[`SearchForTransactionsCriteria`](../type-aliases/SearchForTransactionsCriteria.md)

The criteria to search for

### paginationLimit?

`number`

The number of records to return per paginated request, default 1000

## Returns

`Promise`\<[`TransactionsResponse`](../type-aliases/TransactionsResponse.md)\>

The search results
