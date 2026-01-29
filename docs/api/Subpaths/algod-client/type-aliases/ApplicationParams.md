[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/algod-client](../README.md) / ApplicationParams

# Type Alias: ApplicationParams

> **ApplicationParams** = `object`

Defined in: [packages/algod\_client/src/models/application-params.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-params.ts#L11)

Stores the global information associated with an application.

## Properties

### approvalProgram

> **approvalProgram**: `Uint8Array`

Defined in: [packages/algod\_client/src/models/application-params.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-params.ts#L20)

\[approv\] approval program.

***

### clearStateProgram

> **clearStateProgram**: `Uint8Array`

Defined in: [packages/algod\_client/src/models/application-params.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-params.ts#L25)

\[clearp\] approval program.

***

### creator

> **creator**: [`Address`](../../../algokit-utils/classes/Address.md)

Defined in: [packages/algod\_client/src/models/application-params.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-params.ts#L15)

The address that created this application. This is the address where the parameters and global state for this application can be found.

***

### extraProgramPages?

> `optional` **extraProgramPages**: `number`

Defined in: [packages/algod\_client/src/models/application-params.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-params.ts#L30)

\[epp\] the amount of extra program pages available to this app.

***

### globalState?

> `optional` **globalState**: [`TealKeyValueStore`](TealKeyValueStore.md)

Defined in: [packages/algod\_client/src/models/application-params.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-params.ts#L33)

***

### globalStateSchema?

> `optional` **globalStateSchema**: [`ApplicationStateSchema`](ApplicationStateSchema.md)

Defined in: [packages/algod\_client/src/models/application-params.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-params.ts#L32)

***

### localStateSchema?

> `optional` **localStateSchema**: [`ApplicationStateSchema`](ApplicationStateSchema.md)

Defined in: [packages/algod\_client/src/models/application-params.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-params.ts#L31)

***

### version?

> `optional` **version**: `number`

Defined in: [packages/algod\_client/src/models/application-params.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-params.ts#L38)

\[v\] the number of updates to the application programs
