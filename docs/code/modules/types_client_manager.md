[@algorandfoundation/algokit-utils](../README.md) / types/client-manager

# Module: types/client-manager

## Table of contents

### Classes

- [ClientManager](../classes/types_client_manager.ClientManager.md)

### Interfaces

- [AlgoSdkClients](../interfaces/types_client_manager.AlgoSdkClients.md)
- [NetworkDetails](../interfaces/types_client_manager.NetworkDetails.md)
- [TypedAppClient](../interfaces/types_client_manager.TypedAppClient.md)

### Type Aliases

- [AppClientByCreatorAndNameDetails](types_client_manager.md#appclientbycreatorandnamedetails)
- [AppClientByIdDetails](types_client_manager.md#appclientbyiddetails)
- [TypedAppClientByCreatorAndNameDetails](types_client_manager.md#typedappclientbycreatorandnamedetails)
- [TypedAppClientByIdDetails](types_client_manager.md#typedappclientbyiddetails)

## Type Aliases

### AppClientByCreatorAndNameDetails

Ƭ **AppClientByCreatorAndNameDetails**: [`AppSpecAppDetailsBase`](types_app_client.md#appspecappdetailsbase) & [`AppDetailsBase`](types_app_client.md#appdetailsbase) & `Omit`\<[`ResolveAppByCreatorAndNameBase`](types_app_client.md#resolveappbycreatorandnamebase), ``"findExistingUsing"``\>

Details to resolve an app client by creator address and name.

#### Defined in

[src/types/client-manager.ts:500](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L500)

___

### AppClientByIdDetails

Ƭ **AppClientByIdDetails**: [`AppSpecAppDetailsBase`](types_app_client.md#appspecappdetailsbase) & [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppByIdBase`](../interfaces/types_app_client.ResolveAppByIdBase.md)

Details to resolve an app client by app ID.

#### Defined in

[src/types/client-manager.ts:512](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L512)

___

### TypedAppClientByCreatorAndNameDetails

Ƭ **TypedAppClientByCreatorAndNameDetails**: [`AppDetailsBase`](types_app_client.md#appdetailsbase) & `Omit`\<[`ResolveAppByCreatorAndNameBase`](types_app_client.md#resolveappbycreatorandnamebase), ``"findExistingUsing"``\>

Details to resolve a typed app creator address and name.

#### Defined in

[src/types/client-manager.ts:507](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L507)

___

### TypedAppClientByIdDetails

Ƭ **TypedAppClientByIdDetails**: [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppByIdBase`](../interfaces/types_app_client.ResolveAppByIdBase.md)

Details to resolve a typed app by app ID.

#### Defined in

[src/types/client-manager.ts:517](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L517)
