[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/indexer-client](../README.md) / ApplicationLocalStatesResponse

# Type Alias: ApplicationLocalStatesResponse

> **ApplicationLocalStatesResponse** = `object`

Defined in: [packages/indexer\_client/src/models/application-local-states-response.ts:6](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/application-local-states-response.ts#L6)

## Properties

### appsLocalStates

> **appsLocalStates**: [`ApplicationLocalState`](ApplicationLocalState.md)[]

Defined in: [packages/indexer\_client/src/models/application-local-states-response.ts:7](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/application-local-states-response.ts#L7)

***

### currentRound

> **currentRound**: `bigint`

Defined in: [packages/indexer\_client/src/models/application-local-states-response.ts:12](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/application-local-states-response.ts#L12)

Round at which the results were computed.

***

### nextToken?

> `optional` **nextToken**: `string`

Defined in: [packages/indexer\_client/src/models/application-local-states-response.ts:17](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/application-local-states-response.ts#L17)

Used for pagination, when making another request provide this token with the next parameter.
