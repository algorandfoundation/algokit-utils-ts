[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algod-client](../README.md) / ApplicationKvStorage

# Type Alias: ApplicationKvStorage

> **ApplicationKvStorage** = `object`

Defined in: [packages/algod\_client/src/models/application-kv-storage.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/algod_client/src/models/application-kv-storage.ts#L9)

An application's global/local/box state.

## Properties

### account?

> `optional` **account**: [`Address`](../../index/classes/Address.md)

Defined in: [packages/algod\_client/src/models/application-kv-storage.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/algod_client/src/models/application-kv-storage.ts#L18)

The address of the account associated with the local state.

***

### kvs

> **kvs**: [`AvmKeyValue`](AvmKeyValue.md)[]

Defined in: [packages/algod\_client/src/models/application-kv-storage.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/algod_client/src/models/application-kv-storage.ts#L13)

Key-Value pairs representing application states.
