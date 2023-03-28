[@algorandfoundation/algokit-utils](../README.md) / [types/application-client](../modules/types_application_client.md) / ResolveAppById

# Interface: ResolveAppById

[types/application-client](../modules/types_application_client.md).ResolveAppById

Configuration to resolve app by ID

## Table of contents

### Properties

- [id](types_application_client.ResolveAppById.md#id)
- [name](types_application_client.ResolveAppById.md#name)

## Properties

### id

• **id**: `number`

The id of an existing app to call using this client, or 0 if the app hasn't been created yet

#### Defined in

[src/types/application-client.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L67)

___

### name

• `Optional` **name**: `string`

The optional name to use to mark the app when deploying

**`See`**

ApplicationClient.deploy (default: uses the name in the ABI contract)

#### Defined in

[src/types/application-client.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/application-client.ts#L69)
