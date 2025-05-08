[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / ResolveAppById

# Interface: ResolveAppById

Defined in: [src/types/app-client.ts:117](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L117)

Configuration to resolve app by ID

## Extends

- [`ResolveAppByIdBase`](ResolveAppByIdBase.md)

## Properties

### id

> **id**: `number` \| `bigint`

Defined in: [src/types/app-client.ts:112](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L112)

The id of an existing app to call using this client, or 0 if the app hasn't been created yet

#### Inherited from

[`ResolveAppByIdBase`](ResolveAppByIdBase.md).[`id`](ResolveAppByIdBase.md#id)

***

### name?

> `optional` **name**: `string`

Defined in: [src/types/app-client.ts:114](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L114)

The optional name to use to mark the app when deploying `ApplicationClient.deploy` (default: uses the name in the ABI contract)

#### Inherited from

[`ResolveAppByIdBase`](ResolveAppByIdBase.md).[`name`](ResolveAppByIdBase.md#name)

***

### resolveBy

> **resolveBy**: `"id"`

Defined in: [src/types/app-client.ts:119](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L119)

How the app ID is resolved, either by `'id'` or `'creatorAndName'`; must be `'creatorAndName'` if you want to use `deploy`
