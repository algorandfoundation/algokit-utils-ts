[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / lookupTransactionById

# Function: ~~lookupTransactionById()~~

> **lookupTransactionById**(`transactionId`, `indexer`): `Promise`\<`TransactionResponse`\>

Defined in: [src/indexer-lookup.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L15)

## Parameters

### transactionId

`string`

The ID of the transaction to look up

### indexer

`IndexerClient`

An indexer client

## Returns

`Promise`\<`TransactionResponse`\>

The result of the look-up

## Deprecated

Use `indexer.lookupTransactionByID(transactionId).do()`.
Looks up a transaction by ID using Indexer.
