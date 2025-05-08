[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-client](../README.md) / ResolveAppByIdBase

# Interface: ResolveAppByIdBase

Defined in: [src/types/app-client.ts:110](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L110)

Configuration to resolve app by ID

## Extended by

- [`ResolveAppById`](ResolveAppById.md)

## Properties

### id

> **id**: `number` \| `bigint`

Defined in: [src/types/app-client.ts:112](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L112)

The id of an existing app to call using this client, or 0 if the app hasn't been created yet

***

### name?

> `optional` **name**: `string`

Defined in: [src/types/app-client.ts:114](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L114)

The optional name to use to mark the app when deploying `ApplicationClient.deploy` (default: uses the name in the ABI contract)
