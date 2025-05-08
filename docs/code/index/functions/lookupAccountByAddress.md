[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / lookupAccountByAddress

# Function: ~~lookupAccountByAddress()~~

> **lookupAccountByAddress**(`accountAddress`, `indexer`): `Promise`\<`AccountResponse`\>

Defined in: [src/indexer-lookup.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L26)

## Parameters

### accountAddress

The address of the account to look up

`string` | `Address`

### indexer

`IndexerClient`

An indexer client

## Returns

`Promise`\<`AccountResponse`\>

The result of the look-up

## Deprecated

Use `indexer.lookupAccountByID(accountAddress).do()`.
Looks up an account by address using Indexer.
