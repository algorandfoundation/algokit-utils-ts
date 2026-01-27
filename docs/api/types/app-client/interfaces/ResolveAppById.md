[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app-client](../README.md) / ResolveAppById

# Interface: ResolveAppById

Defined in: [src/types/app-client.ts:102](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L102)

Configuration to resolve app by ID

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`ResolveAppByIdBase`](ResolveAppByIdBase.md)

## Properties

### id

> **id**: `number` \| `bigint`

Defined in: [src/types/app-client.ts:97](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L97)

The id of an existing app to call using this client, or 0 if the app hasn't been created yet

#### Inherited from

[`ResolveAppByIdBase`](ResolveAppByIdBase.md).[`id`](ResolveAppByIdBase.md#id)

***

### name?

> `optional` **name**: `string`

Defined in: [src/types/app-client.ts:99](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L99)

The optional name to use to mark the app when deploying `ApplicationClient.deploy` (default: uses the name in the ABI contract)

#### Inherited from

[`ResolveAppByIdBase`](ResolveAppByIdBase.md).[`name`](ResolveAppByIdBase.md#name)

***

### resolveBy

> **resolveBy**: `"id"`

Defined in: [src/types/app-client.ts:104](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L104)

How the app ID is resolved, either by `'id'` or `'creatorAndName'`; must be `'creatorAndName'` if you want to use `deploy`
