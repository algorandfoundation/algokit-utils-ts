[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/indexer-client](../README.md) / ApplicationLocalState

# Type Alias: ApplicationLocalState

> **ApplicationLocalState** = `object`

Defined in: [packages/indexer\_client/src/models/application-local-state.ts:11](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/application-local-state.ts#L11)

Stores local state associated with an application.

## Properties

### closedOutAtRound?

> `optional` **closedOutAtRound**: `bigint`

Defined in: [packages/indexer\_client/src/models/application-local-state.ts:30](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/application-local-state.ts#L30)

Round when account closed out of the application.

***

### deleted?

> `optional` **deleted**: `boolean`

Defined in: [packages/indexer\_client/src/models/application-local-state.ts:20](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/application-local-state.ts#L20)

Whether or not the application local state is currently deleted from its account.

***

### id

> **id**: `bigint`

Defined in: [packages/indexer\_client/src/models/application-local-state.ts:15](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/application-local-state.ts#L15)

The application which this local state is for.

***

### keyValue?

> `optional` **keyValue**: [`TealKeyValueStore`](TealKeyValueStore.md)

Defined in: [packages/indexer\_client/src/models/application-local-state.ts:32](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/application-local-state.ts#L32)

***

### optedInAtRound?

> `optional` **optedInAtRound**: `bigint`

Defined in: [packages/indexer\_client/src/models/application-local-state.ts:25](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/application-local-state.ts#L25)

Round when the account opted into the application.

***

### schema

> **schema**: [`ApplicationStateSchema`](ApplicationStateSchema.md)

Defined in: [packages/indexer\_client/src/models/application-local-state.ts:31](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/indexer_client/src/models/application-local-state.ts#L31)
