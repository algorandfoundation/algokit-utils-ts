[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/indexer-client](../README.md) / BoxesResponse

# Type Alias: BoxesResponse

> **BoxesResponse** = `object`

Defined in: [packages/indexer\_client/src/models/boxes-response.ts:6](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/boxes-response.ts#L6)

## Properties

### applicationId

> **applicationId**: `bigint`

Defined in: [packages/indexer\_client/src/models/boxes-response.ts:10](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/boxes-response.ts#L10)

\[appidx\] application index.

***

### boxes

> **boxes**: [`BoxDescriptor`](BoxDescriptor.md)[]

Defined in: [packages/indexer\_client/src/models/boxes-response.ts:11](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/boxes-response.ts#L11)

***

### nextToken?

> `optional` **nextToken**: `string`

Defined in: [packages/indexer\_client/src/models/boxes-response.ts:16](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/boxes-response.ts#L16)

Used for pagination, when making another request provide this token with the next parameter.
