[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / ResolveAppByIdBase

# Interface: ResolveAppByIdBase

Defined in: [src/types/app-client.ts:94](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L94)

Configuration to resolve app by ID

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extended by

- [`ResolveAppById`](ResolveAppById.md)

## Properties

### id

> **id**: `number` \| `bigint`

Defined in: [src/types/app-client.ts:96](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L96)

The id of an existing app to call using this client, or 0 if the app hasn't been created yet

***

### name?

> `optional` **name**: `string`

Defined in: [src/types/app-client.ts:98](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L98)

The optional name to use to mark the app when deploying `ApplicationClient.deploy` (default: uses the name in the ABI contract)
