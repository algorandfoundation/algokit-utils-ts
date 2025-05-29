[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/client-manager](../README.md) / TypedAppClient

# Interface: TypedAppClient\<TClient\>

Defined in: [src/types/client-manager.ts:693](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L693)

Interface to identify a typed client that can be used to interact with an application.

## Type Parameters

### TClient

`TClient`

## Constructors

### Constructor

> **new TypedAppClient**(`params`): `TClient`

Defined in: [src/types/client-manager.ts:694](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L694)

#### Parameters

##### params

`Omit`\<[`AppClientParams`](../../app-client/interfaces/AppClientParams.md), `"appSpec"`\>

#### Returns

`TClient`

## Methods

### fromCreatorAndName()

> **fromCreatorAndName**(`params`): `Promise`\<`TClient`\>

Defined in: [src/types/client-manager.ts:696](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L696)

#### Parameters

##### params

`Omit`\<[`ResolveAppClientByCreatorAndName`](../../app-client/type-aliases/ResolveAppClientByCreatorAndName.md), `"appSpec"`\>

#### Returns

`Promise`\<`TClient`\>

***

### fromNetwork()

> **fromNetwork**(`params`): `Promise`\<`TClient`\>

Defined in: [src/types/client-manager.ts:695](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L695)

#### Parameters

##### params

`Omit`\<[`AppClientParams`](../../app-client/interfaces/AppClientParams.md), `"appId"` \| `"appSpec"`\>

#### Returns

`Promise`\<`TClient`\>
