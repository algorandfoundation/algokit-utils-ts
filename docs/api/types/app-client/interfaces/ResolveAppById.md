[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / ResolveAppById

# Interface: ResolveAppById

Defined in: [src/types/app-client.ts:101](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L101)

Configuration to resolve app by ID

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`ResolveAppByIdBase`](ResolveAppByIdBase.md)

## Properties

### id

> **id**: `number` \| `bigint`

Defined in: [src/types/app-client.ts:96](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L96)

The id of an existing app to call using this client, or 0 if the app hasn't been created yet

#### Inherited from

[`ResolveAppByIdBase`](ResolveAppByIdBase.md).[`id`](ResolveAppByIdBase.md#id)

***

### name?

> `optional` **name**: `string`

Defined in: [src/types/app-client.ts:98](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L98)

The optional name to use to mark the app when deploying `ApplicationClient.deploy` (default: uses the name in the ABI contract)

#### Inherited from

[`ResolveAppByIdBase`](ResolveAppByIdBase.md).[`name`](ResolveAppByIdBase.md#name)

***

### resolveBy

> **resolveBy**: `"id"`

Defined in: [src/types/app-client.ts:103](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/app-client.ts#L103)

How the app ID is resolved, either by `'id'` or `'creatorAndName'`; must be `'creatorAndName'` if you want to use `deploy`
