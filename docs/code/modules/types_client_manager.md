[@algorandfoundation/algokit-utils](../README.md) / types/client-manager

# Module: types/client-manager

## Table of contents

### Classes

- [ClientManager](../classes/types_client_manager.ClientManager.md)

### Interfaces

- [AlgoSdkClients](../interfaces/types_client_manager.AlgoSdkClients.md)
- [TypedAppClient](../interfaces/types_client_manager.TypedAppClient.md)

### Type Aliases

- [AppClientByCreatorAndNameDetails](types_client_manager.md#appclientbycreatorandnamedetails)
- [AppClientByIdDetails](types_client_manager.md#appclientbyiddetails)
- [TypedAppClientByCreatorAndNameDetails](types_client_manager.md#typedappclientbycreatorandnamedetails)
- [TypedAppClientByIdDetails](types_client_manager.md#typedappclientbyiddetails)

## Type Aliases

### AppClientByCreatorAndNameDetails

Ƭ **AppClientByCreatorAndNameDetails**: [`AppSpecAppDetailsBase`](types_app_client.md#appspecappdetailsbase) & [`AppDetailsBase`](types_app_client.md#appdetailsbase) & `Omit`\<[`ResolveAppByCreatorAndNameBase`](types_app_client.md#resolveappbycreatorandnamebase), ``"findExistingUsing"``\>

#### Defined in

[src/types/client-manager.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L139)

___

### AppClientByIdDetails

Ƭ **AppClientByIdDetails**: [`AppSpecAppDetailsBase`](types_app_client.md#appspecappdetailsbase) & [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppByIdBase`](../interfaces/types_app_client.ResolveAppByIdBase.md)

#### Defined in

[src/types/client-manager.ts:145](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L145)

___

### TypedAppClientByCreatorAndNameDetails

Ƭ **TypedAppClientByCreatorAndNameDetails**: [`AppDetailsBase`](types_app_client.md#appdetailsbase) & `Omit`\<[`ResolveAppByCreatorAndNameBase`](types_app_client.md#resolveappbycreatorandnamebase), ``"findExistingUsing"``\>

#### Defined in

[src/types/client-manager.ts:143](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L143)

___

### TypedAppClientByIdDetails

Ƭ **TypedAppClientByIdDetails**: [`AppDetailsBase`](types_app_client.md#appdetailsbase) & [`ResolveAppByIdBase`](../interfaces/types_app_client.ResolveAppByIdBase.md)

#### Defined in

[src/types/client-manager.ts:147](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L147)
