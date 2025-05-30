[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / lookupAccountCreatedApplicationByAddress

# Function: lookupAccountCreatedApplicationByAddress()

> **lookupAccountCreatedApplicationByAddress**(`indexer`, `address`, `getAll`, `paginationLimit?`): `Promise`\<`Application`[]\>

Defined in: [src/indexer-lookup.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/indexer-lookup.ts#L38)

Looks up applications that were created by the given address; will automatically paginate through all data.

## Parameters

### indexer

`IndexerClient`

An indexer instance

### address

The address of the creator to look up

`string` | `Address`

### getAll

Whether or not to include deleted applications

`undefined` | `boolean`

### paginationLimit?

`number`

The number of records to return per paginated request, default 1000

## Returns

`Promise`\<`Application`[]\>

The list of application results
