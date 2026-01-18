[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/algod-client](../README.md) / ApplicationInitialStates

# Type Alias: ApplicationInitialStates

> **ApplicationInitialStates** = `object`

Defined in: [packages/algod\_client/src/models/application-initial-states.ts:9](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/models/application-initial-states.ts#L9)

An application's initial global/local/box states that were accessed during simulation.

## Properties

### appBoxes?

> `optional` **appBoxes**: [`ApplicationKvStorage`](ApplicationKvStorage.md)

Defined in: [packages/algod\_client/src/models/application-initial-states.ts:20](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/models/application-initial-states.ts#L20)

***

### appGlobals?

> `optional` **appGlobals**: [`ApplicationKvStorage`](ApplicationKvStorage.md)

Defined in: [packages/algod\_client/src/models/application-initial-states.ts:19](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/models/application-initial-states.ts#L19)

***

### appLocals?

> `optional` **appLocals**: [`ApplicationKvStorage`](ApplicationKvStorage.md)[]

Defined in: [packages/algod\_client/src/models/application-initial-states.ts:18](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/models/application-initial-states.ts#L18)

An application's initial local states tied to different accounts.

***

### id

> **id**: `bigint`

Defined in: [packages/algod\_client/src/models/application-initial-states.ts:13](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algod_client/src/models/application-initial-states.ts#L13)

Application index.
