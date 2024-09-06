[@algorandfoundation/algokit-utils](../README.md) / types/client-manager

# Module: types/client-manager

## Table of contents

### Classes

- [ClientManager](../classes/types_client_manager.ClientManager.md)

### Interfaces

- [AlgoSdkClients](../interfaces/types_client_manager.AlgoSdkClients.md)
- [TypedAppClient](../interfaces/types_client_manager.TypedAppClient.md)

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

[src/types/client-manager.ts:579](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L579)
