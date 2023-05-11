[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / ResolveAppById

# Interface: ResolveAppById

[types/app-client](../modules/types_app_client.md).ResolveAppById

Configuration to resolve app by ID

## Table of contents

### Properties

- [id](types_app_client.ResolveAppById.md#id)
- [name](types_app_client.ResolveAppById.md#name)
- [resolveBy](types_app_client.ResolveAppById.md#resolveby)

## Properties

### id

• **id**: `number`

The id of an existing app to call using this client, or 0 if the app hasn't been created yet

#### Defined in

[src/types/app-client.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L69)

___

### name

• `Optional` **name**: `string`

The optional name to use to mark the app when deploying `ApplicationClient.deploy` (default: uses the name in the ABI contract)

#### Defined in

[src/types/app-client.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L71)

___

### resolveBy

• **resolveBy**: ``"id"``

How the app ID is resolved, either by `'id'` or `'creatorAndName'`

#### Defined in

[src/types/app-client.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L67)
