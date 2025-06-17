[@algorandfoundation/algokit-utils](../README.md) / types/client-manager

# Module: types/client-manager

## Table of contents

### Classes

- [ClientManager](../classes/types_client_manager.ClientManager.md)

### Interfaces

- [AlgoSdkClients](../interfaces/types_client_manager.AlgoSdkClients.md)
- [TypedAppClient](../interfaces/types_client_manager.TypedAppClient.md)
- [TypedAppFactory](../interfaces/types_client_manager.TypedAppFactory.md)

### Type Aliases

- [ClientAppClientByNetworkParams](types_client_manager.md#clientappclientbynetworkparams)
- [ClientAppClientParams](types_client_manager.md#clientappclientparams)
- [ClientAppFactoryParams](types_client_manager.md#clientappfactoryparams)
- [ClientResolveAppClientByCreatorAndNameParams](types_client_manager.md#clientresolveappclientbycreatorandnameparams)
- [ClientTypedAppClientByCreatorAndNameParams](types_client_manager.md#clienttypedappclientbycreatorandnameparams)
- [ClientTypedAppClientByNetworkParams](types_client_manager.md#clienttypedappclientbynetworkparams)
- [ClientTypedAppClientParams](types_client_manager.md#clienttypedappclientparams)
- [ClientTypedAppFactoryParams](types_client_manager.md#clienttypedappfactoryparams)

## Type Aliases

### ClientAppClientByNetworkParams

Ƭ **ClientAppClientByNetworkParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppClientParams`](../interfaces/types_app_client.AppClientParams.md), ``"algorand"`` \| ``"appId"``\>\>

Params to get an app client by network from `ClientManager`.

#### Defined in

[src/types/client-manager.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L34)

___

### ClientAppClientParams

Ƭ **ClientAppClientParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppClientParams`](../interfaces/types_app_client.AppClientParams.md), ``"algorand"``\>\>

Params to get an app client by ID from `ClientManager`.

#### Defined in

[src/types/client-manager.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L31)

___

### ClientAppFactoryParams

Ƭ **ClientAppFactoryParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppFactoryParams`](../interfaces/types_app_factory.AppFactoryParams.md), ``"algorand"``\>\>

Params to get an app factory from `ClientManager`.

#### Defined in

[src/types/client-manager.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L25)

___

### ClientResolveAppClientByCreatorAndNameParams

Ƭ **ClientResolveAppClientByCreatorAndNameParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`ResolveAppClientByCreatorAndName`](types_app_client.md#resolveappclientbycreatorandname), ``"algorand"``\>\>

Params to get an app client by creator address and name from `ClientManager`.

#### Defined in

[src/types/client-manager.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L28)

___

### ClientTypedAppClientByCreatorAndNameParams

Ƭ **ClientTypedAppClientByCreatorAndNameParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`ResolveAppClientByCreatorAndName`](types_app_client.md#resolveappclientbycreatorandname), ``"algorand"`` \| ``"appSpec"``\>\>

Params to get a typed app client by creator address and name from `ClientManager`.

#### Defined in

[src/types/client-manager.ts:37](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L37)

___

### ClientTypedAppClientByNetworkParams

Ƭ **ClientTypedAppClientByNetworkParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppClientParams`](../interfaces/types_app_client.AppClientParams.md), ``"algorand"`` \| ``"appSpec"`` \| ``"appId"``\>\>

Params to get a typed app client by network from `ClientManager`.

#### Defined in

[src/types/client-manager.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L43)

___

### ClientTypedAppClientParams

Ƭ **ClientTypedAppClientParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppClientParams`](../interfaces/types_app_client.AppClientParams.md), ``"algorand"`` \| ``"appSpec"``\>\>

Params to get a typed app client by ID from `ClientManager`.

#### Defined in

[src/types/client-manager.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L40)

___

### ClientTypedAppFactoryParams

Ƭ **ClientTypedAppFactoryParams**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`AppFactoryParams`](../interfaces/types_app_factory.AppFactoryParams.md), ``"algorand"`` \| ``"appSpec"``\>\>

Params to get a typed app factory from `ClientManager`.

#### Defined in

[src/types/client-manager.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L46)
