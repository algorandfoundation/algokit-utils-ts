[@algorandfoundation/algokit-utils](../README.md) / [types/client-manager](../modules/types_client_manager.md) / TypedAppClient

# Interface: TypedAppClient\<TClient\>

[types/client-manager](../modules/types_client_manager.md).TypedAppClient

Interface to identify a typed client that can be used to interact with an application.

## Type parameters

| Name |
| :------ |
| `TClient` |

## Table of contents

### Constructors

- [constructor](types_client_manager.TypedAppClient.md#constructor)

### Methods

- [fromCreatorAndName](types_client_manager.TypedAppClient.md#fromcreatorandname)
- [fromNetwork](types_client_manager.TypedAppClient.md#fromnetwork)

## Constructors

### constructor

• **new TypedAppClient**(`params`): `TClient`

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Omit`\<[`AppClientParams`](types_app_client.AppClientParams.md), ``"appSpec"``\> |

#### Returns

`TClient`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/client-manager.ts:617](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L617)

## Methods

### fromCreatorAndName

▸ **fromCreatorAndName**(`params`): `Promise`\<`TClient`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Omit`\<\{ `algorand`: [`AlgorandClientInterface`](types_algorand_client_interface.AlgorandClientInterface.md) ; `appLookupCache?`: [`AppLookup`](types_app_deployer.AppLookup.md) ; `appName?`: `string` ; `appSpec`: `string` \| [`Arc56Contract`](types_app_arc56.Arc56Contract.md) \| [`AppSpec`](types_app_spec.AppSpec.md) ; `approvalSourceMap?`: `SourceMap` ; `clearSourceMap?`: `SourceMap` ; `creatorAddress`: `string` ; `defaultSender?`: `string` ; `ignoreCache?`: `boolean`  }, ``"appSpec"``\> |

#### Returns

`Promise`\<`TClient`\>

#### Defined in

[src/types/client-manager.ts:619](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L619)

___

### fromNetwork

▸ **fromNetwork**(`params`): `Promise`\<`TClient`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Omit`\<[`AppClientParams`](types_app_client.AppClientParams.md), ``"appId"`` \| ``"appSpec"``\> |

#### Returns

`Promise`\<`TClient`\>

#### Defined in

[src/types/client-manager.ts:618](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L618)
=======
[src/types/client-manager.ts:543](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L543)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/client-manager.ts:537](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L537)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/client-manager.ts:568](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L568)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
[src/types/client-manager.ts:592](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L592)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
