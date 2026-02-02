[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / TypedAppFactory

# Interface: TypedAppFactory\<TClient\>

Defined in: [src/client-manager.ts:712](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/client-manager.ts#L712)

Interface to identify a typed factory that can be used to create and deploy an application.

## Type Parameters

### TClient

`TClient`

## Constructors

### Constructor

> **new TypedAppFactory**(`params`): `TClient`

Defined in: [src/client-manager.ts:713](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/src/client-manager.ts#L713)

#### Parameters

##### params

`Omit`\<[`AppFactoryParams`](AppFactoryParams.md), `"appSpec"`\>

#### Returns

`TClient`
