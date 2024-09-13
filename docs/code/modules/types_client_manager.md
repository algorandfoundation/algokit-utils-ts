[@algorandfoundation/algokit-utils](../README.md) / types/client-manager

# Module: types/client-manager

## Table of contents

### Classes

- [ClientManager](../classes/types_client_manager.ClientManager.md)

### Interfaces

- [AlgoSdkClients](../interfaces/types_client_manager.AlgoSdkClients.md)
- [TypedAppClient](../interfaces/types_client_manager.TypedAppClient.md)
<<<<<<< HEAD
<<<<<<< HEAD
- [TypedAppFactory](../interfaces/types_client_manager.TypedAppFactory.md)
=======

### Type Aliases

- [TypedAppClientByCreatorAndNameDetails](types_client_manager.md#typedappclientbycreatorandnamedetails)
- [TypedAppClientByIdDetails](types_client_manager.md#typedappclientbyiddetails)

## Type Aliases

### TypedAppClientByCreatorAndNameDetails

Ƭ **TypedAppClientByCreatorAndNameDetails**: [`AppDetailsBase`](types_app_client.md#appdetailsbase) & `Omit`\<[`ResolveAppByCreatorAndNameBase`](types_app_client.md#resolveappbycreatorandnamebase), ``"findExistingUsing"``\>

Details to resolve a typed app creator address and name.

#### Defined in

[src/types/client-manager.ts:574](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L574)

___

### TypedAppClientByIdDetails

Ƭ **TypedAppClientByIdDetails**: [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppByIdBase`](../interfaces/types_app_client.ResolveAppByIdBase.md)

Details to resolve a typed app by app ID.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/client-manager.ts:561](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L561)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/client-manager.ts:555](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L555)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/client-manager.ts:579](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L579)
>>>>>>> c8daa04 (docs: Added migration guide and app-client documentation)
=======
- [TypedAppFactory](../interfaces/types_client_manager.TypedAppFactory.md)
>>>>>>> b95895f (feat: ARC-56 Typed client support)
