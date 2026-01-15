[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [indexer-client](../README.md) / lookupAccountCreatedApplicationByAddress

# Function: lookupAccountCreatedApplicationByAddress()

> **lookupAccountCreatedApplicationByAddress**(`indexer`, `address`, `getAll`, `paginationLimit?`): `Promise`\<[`Application`](../type-aliases/Application.md)[]\>

Defined in: [src/indexer-client/indexer-lookup.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-client/indexer-lookup.ts#L23)

Looks up applications that were created by the given address; will automatically paginate through all data.

## Parameters

### indexer

[`IndexerClient`](../classes/IndexerClient.md)

An indexer instance

### address

The address of the creator to look up

`string` | [`Address`](../../index/classes/Address.md)

### getAll

`boolean` = `true`

Whether or not to include deleted applications. Default true.

### paginationLimit?

`number`

The number of records to return per paginated request, default 1000

## Returns

`Promise`\<[`Application`](../type-aliases/Application.md)[]\>

The list of application results
