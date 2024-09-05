[@algorandfoundation/algokit-utils](../README.md) / types/client-manager

# Module: types/client-manager

## Table of contents

### Classes

- [ClientManager](../classes/types_client_manager.ClientManager.md)

### Interfaces

- [AlgoSdkClients](../interfaces/types_client_manager.AlgoSdkClients.md)
- [TypedAppClient](../interfaces/types_client_manager.TypedAppClient.md)
<<<<<<< HEAD
- [TypedAppFactory](../interfaces/types_client_manager.TypedAppFactory.md)
=======

### Type Aliases

- [AppClientByCreatorAndNameDetails](types_client_manager.md#appclientbycreatorandnamedetails)
- [TypedAppClientByCreatorAndNameDetails](types_client_manager.md#typedappclientbycreatorandnamedetails)
- [TypedAppClientByIdDetails](types_client_manager.md#typedappclientbyiddetails)

## Type Aliases

### AppClientByCreatorAndNameDetails

Ƭ **AppClientByCreatorAndNameDetails**: [`AppSpecAppDetailsBase`](types_app_client.md#appspecappdetailsbase) & [`AppDetailsBase`](types_app_client.md#appdetailsbase) & `Omit`\<[`ResolveAppByCreatorAndNameBase`](types_app_client.md#resolveappbycreatorandnamebase), ``"findExistingUsing"``\>

Details to resolve an app client by creator address and name.

#### Defined in

[src/types/client-manager.ts:543](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L543)

___

### TypedAppClientByCreatorAndNameDetails

Ƭ **TypedAppClientByCreatorAndNameDetails**: [`AppDetailsBase`](types_app_client.md#appdetailsbase) & `Omit`\<[`ResolveAppByCreatorAndNameBase`](types_app_client.md#resolveappbycreatorandnamebase), ``"findExistingUsing"``\>

Details to resolve a typed app creator address and name.

#### Defined in

[src/types/client-manager.ts:550](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L550)

___

### TypedAppClientByIdDetails

Ƭ **TypedAppClientByIdDetails**: [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppByIdBase`](../interfaces/types_app_client.ResolveAppByIdBase.md)

Details to resolve a typed app by app ID.

#### Defined in

<<<<<<< HEAD
[src/types/client-manager.ts:561](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L561)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/client-manager.ts:555](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L555)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
