[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/algod-client](../README.md) / ApplicationStateOperation

# Type Alias: ApplicationStateOperation

> **ApplicationStateOperation** = `object`

Defined in: [packages/algod\_client/src/models/application-state-operation.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-state-operation.ts#L9)

An operation against an application's global/local/box state.

## Properties

### account?

> `optional` **account**: [`Address`](../../../algokit-utils/classes/Address.md)

Defined in: [packages/algod\_client/src/models/application-state-operation.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-state-operation.ts#L29)

For local state changes, the address of the account associated with the local state.

***

### appStateType

> **appStateType**: `string`

Defined in: [packages/algod\_client/src/models/application-state-operation.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-state-operation.ts#L18)

Type of application state. Value `g` is **global state**, `l` is **local state**, `b` is **boxes**.

***

### key

> **key**: `Uint8Array`

Defined in: [packages/algod\_client/src/models/application-state-operation.ts:23](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-state-operation.ts#L23)

The key (name) of the global/local/box state.

***

### newValue?

> `optional` **newValue**: [`AvmValue`](AvmValue.md)

Defined in: [packages/algod\_client/src/models/application-state-operation.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-state-operation.ts#L24)

***

### operation

> **operation**: `string`

Defined in: [packages/algod\_client/src/models/application-state-operation.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/algod_client/src/models/application-state-operation.ts#L13)

Operation type. Value `w` is **write**, `d` is **delete**.
