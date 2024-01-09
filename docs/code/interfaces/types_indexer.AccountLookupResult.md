[@algorandfoundation/algokit-utils](../README.md) / [types/indexer](../modules/types_indexer.md) / AccountLookupResult

# Interface: AccountLookupResult

[types/indexer](../modules/types_indexer.md).AccountLookupResult

Indexer result for an account lookup, https://developer.algorand.org/docs/rest-apis/indexer/#get-v2accountsaccount-id

## Table of contents

### Properties

- [account](types_indexer.AccountLookupResult.md#account)
- [current-round](types_indexer.AccountLookupResult.md#current-round)

## Properties

### account

• **account**: [`AccountResult`](types_indexer.AccountResult.md)

The returned account

#### Defined in

[src/types/indexer.ts:20](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/indexer.ts#L20)

___

### current-round

• **current-round**: `number`

Round at which the results were computed.

#### Defined in

[src/types/indexer.ts:18](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/indexer.ts#L18)
