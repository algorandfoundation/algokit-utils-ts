[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / ResolveAppById

# Interface: ResolveAppById

[types/app-client](../modules/types_app_client.md).ResolveAppById

Configuration to resolve app by ID

## Hierarchy

- [`ResolveAppByIdBase`](types_app_client.ResolveAppByIdBase.md)

  ↳ **`ResolveAppById`**

## Table of contents

### Properties

- [id](types_app_client.ResolveAppById.md#id)
- [name](types_app_client.ResolveAppById.md#name)
- [resolveBy](types_app_client.ResolveAppById.md#resolveby)

## Properties

### id

• **id**: `number` \| `bigint`

The id of an existing app to call using this client, or 0 if the app hasn't been created yet

#### Inherited from

[ResolveAppByIdBase](types_app_client.ResolveAppByIdBase.md).[id](types_app_client.ResolveAppByIdBase.md#id)

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:76](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L76)
=======
[src/types/app-client.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L79)
>>>>>>> origin/main

___

### name

• `Optional` **name**: `string`

The optional name to use to mark the app when deploying `ApplicationClient.deploy` (default: uses the name in the ABI contract)

#### Inherited from

[ResolveAppByIdBase](types_app_client.ResolveAppByIdBase.md).[name](types_app_client.ResolveAppByIdBase.md#name)

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:78](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L78)
=======
[src/types/app-client.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L81)
>>>>>>> origin/main

___

### resolveBy

• **resolveBy**: ``"id"``

How the app ID is resolved, either by `'id'` or `'creatorAndName'`; must be `'creatorAndName'` if you want to use `deploy`

#### Defined in

<<<<<<< HEAD
[src/types/app-client.ts:83](https://github.com/joe-p/algokit-utils-ts/blob/main/src/types/app-client.ts#L83)
=======
[src/types/app-client.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L86)
>>>>>>> origin/main
