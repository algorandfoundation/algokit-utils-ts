[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Packages/Algod Client](../README.md) / PendingTransactionsResponse

# Type Alias: PendingTransactionsResponse

> **PendingTransactionsResponse** = `object`

Defined in: [packages/algod\_client/src/models/pending-transactions-response.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/algod_client/src/models/pending-transactions-response.ts#L9)

PendingTransactions is an array of signed transactions exactly as they were submitted.

## Properties

### topTransactions

> **topTransactions**: [`SignedTransaction`](../../Transact/type-aliases/SignedTransaction.md)[]

Defined in: [packages/algod\_client/src/models/pending-transactions-response.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/algod_client/src/models/pending-transactions-response.ts#L13)

An array of signed transaction objects.

***

### totalTransactions

> **totalTransactions**: `number`

Defined in: [packages/algod\_client/src/models/pending-transactions-response.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/algod_client/src/models/pending-transactions-response.ts#L18)

Total number of transactions in the pool.
