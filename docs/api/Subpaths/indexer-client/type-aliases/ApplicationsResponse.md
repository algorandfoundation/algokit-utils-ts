[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/indexer-client](../README.md) / ApplicationsResponse

# Type Alias: ApplicationsResponse

> **ApplicationsResponse** = `object`

Defined in: [packages/indexer\_client/src/models/applications-response.ts:6](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/indexer_client/src/models/applications-response.ts#L6)

## Properties

### applications

> **applications**: [`Application`](Application.md)[]

Defined in: [packages/indexer\_client/src/models/applications-response.ts:7](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/indexer_client/src/models/applications-response.ts#L7)

***

### currentRound

> **currentRound**: `bigint`

Defined in: [packages/indexer\_client/src/models/applications-response.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/indexer_client/src/models/applications-response.ts#L12)

Round at which the results were computed.

***

### nextToken?

> `optional` **nextToken**: `string`

Defined in: [packages/indexer\_client/src/models/applications-response.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/indexer_client/src/models/applications-response.ts#L17)

Used for pagination, when making another request provide this token with the next parameter.
