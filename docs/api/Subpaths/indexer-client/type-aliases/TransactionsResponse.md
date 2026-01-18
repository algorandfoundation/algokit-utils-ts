[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/indexer-client](../README.md) / TransactionsResponse

# Type Alias: TransactionsResponse

> **TransactionsResponse** = `object`

Defined in: [packages/indexer\_client/src/models/transactions-response.ts:6](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/transactions-response.ts#L6)

## Properties

### currentRound

> **currentRound**: `bigint`

Defined in: [packages/indexer\_client/src/models/transactions-response.ts:10](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/transactions-response.ts#L10)

Round at which the results were computed.

***

### nextToken?

> `optional` **nextToken**: `string`

Defined in: [packages/indexer\_client/src/models/transactions-response.ts:15](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/transactions-response.ts#L15)

Used for pagination, when making another request provide this token with the next parameter.

***

### transactions

> **transactions**: [`Transaction`](Transaction.md)[]

Defined in: [packages/indexer\_client/src/models/transactions-response.ts:16](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/transactions-response.ts#L16)
