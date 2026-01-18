[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/indexer-client](../README.md) / executePaginatedRequest

# Function: executePaginatedRequest()

> **executePaginatedRequest**\<`TResult`, `TRequest`\>(`extractItems`, `buildRequest`): `Promise`\<`TResult`[]\>

Defined in: [src/indexer-client/indexer-lookup.ts:120](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/indexer-client/indexer-lookup.ts#L120)

## Type Parameters

### TResult

`TResult`

### TRequest

`TRequest` *extends* `Promise`\<`any`\>

## Parameters

### extractItems

(`response`) => `TResult`[]

### buildRequest

(`nextToken?`) => `TRequest`

## Returns

`Promise`\<`TResult`[]\>
