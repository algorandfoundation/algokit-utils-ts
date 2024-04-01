[@algorandfoundation/algokit-utils](../README.md) / [types/client-manager](../modules/types_client_manager.md) / ClientManager

# Class: ClientManager

[types/client-manager](../modules/types_client_manager.md).ClientManager

Exposes access to various API clients.

## Table of contents

### Constructors

- [constructor](types_client_manager.ClientManager.md#constructor)

### Properties

- [\_algod](types_client_manager.ClientManager.md#_algod)
- [\_indexer](types_client_manager.ClientManager.md#_indexer)
- [\_kmd](types_client_manager.ClientManager.md#_kmd)

### Accessors

- [algod](types_client_manager.ClientManager.md#algod)
- [indexer](types_client_manager.ClientManager.md#indexer)
- [kmd](types_client_manager.ClientManager.md#kmd)

### Methods

- [getAppClientByCreatorAndName](types_client_manager.ClientManager.md#getappclientbycreatorandname)
- [getAppClientById](types_client_manager.ClientManager.md#getappclientbyid)
- [getTestNetDispenser](types_client_manager.ClientManager.md#gettestnetdispenser)
- [getTypedAppClientByCreatorAndName](types_client_manager.ClientManager.md#gettypedappclientbycreatorandname)
- [getTypedAppClientById](types_client_manager.ClientManager.md#gettypedappclientbyid)

## Constructors

### constructor

• **new ClientManager**(`clientsOrConfig`): [`ClientManager`](types_client_manager.ClientManager.md)

algosdk clients or config for interacting with the official Algorand APIs.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `clientsOrConfig` | [`AlgoConfig`](../interfaces/types_network_client.AlgoConfig.md) \| [`AlgoSdkClients`](../interfaces/types_client_manager.AlgoSdkClients.md) | The clients or config to use |

#### Returns

[`ClientManager`](types_client_manager.ClientManager.md)

#### Defined in

[src/types/client-manager.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L36)

## Properties

### \_algod

• `Private` **\_algod**: `default`

#### Defined in

[src/types/client-manager.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L28)

___

### \_indexer

• `Private` `Optional` **\_indexer**: `default`

#### Defined in

[src/types/client-manager.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L29)

___

### \_kmd

• `Private` `Optional` **\_kmd**: `default`

#### Defined in

[src/types/client-manager.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L30)

## Accessors

### algod

• `get` **algod**(): `default`

Returns an algosdk Algod API client.

#### Returns

`default`

#### Defined in

[src/types/client-manager.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L51)

___

### indexer

• `get` **indexer**(): `default`

Returns an algosdk Indexer API client or throws an error if it's not been provided.

#### Returns

`default`

#### Defined in

[src/types/client-manager.ts:56](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L56)

___

### kmd

• `get` **kmd**(): `default`

Returns an algosdk KMD API client or throws an error if it's not been provided.

#### Returns

`default`

#### Defined in

[src/types/client-manager.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L62)

## Methods

### getAppClientByCreatorAndName

▸ **getAppClientByCreatorAndName**(`details`, `cachedAppLookup?`): [`ApplicationClient`](types_app_client.ApplicationClient.md)

Returns a new `ApplicationClient` client, resolving the app by creator address and name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `details` | [`AppClientByCreatorAndNameDetails`](../modules/types_client_manager.md#appclientbycreatorandnamedetails) | The details to resolve the app by creator address and name |
| `cachedAppLookup?` | [`AppLookup`](../interfaces/types_app.AppLookup.md) | A cached app lookup that matches a name to on-chain details; either this is needed or indexer is required to be passed in to this manager on construction. |

#### Returns

[`ApplicationClient`](types_app_client.ApplicationClient.md)

The `ApplicationClient`

#### Defined in

[src/types/client-manager.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L93)

___

### getAppClientById

▸ **getAppClientById**(`details`): [`ApplicationClient`](types_app_client.ApplicationClient.md)

Returns a new `ApplicationClient` client, resolving the app by app ID.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `details` | [`AppClientByIdDetails`](../modules/types_client_manager.md#appclientbyiddetails) | The details to resolve the app by ID |

#### Returns

[`ApplicationClient`](types_app_client.ApplicationClient.md)

The `ApplicationClient`

#### Defined in

[src/types/client-manager.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L105)

___

### getTestNetDispenser

▸ **getTestNetDispenser**(`params?`): [`TestNetDispenserApiClient`](types_dispenser_client.TestNetDispenserApiClient.md)

Returns a TestNet Dispenser API client.
Refer to [docs](https://github.com/algorandfoundation/algokit/blob/main/docs/testnet_api.md) on guidance to obtain an access token.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `params` | ``null`` \| [`TestNetDispenserApiClientParams`](../interfaces/types_dispenser_client.TestNetDispenserApiClientParams.md) | `null` | An object containing parameters for the TestNetDispenserApiClient class. Or null if you want the client to load the access token from the environment variable `ALGOKIT_DISPENSER_ACCESS_TOKEN`. |

#### Returns

[`TestNetDispenserApiClient`](types_dispenser_client.TestNetDispenserApiClient.md)

An instance of the TestNetDispenserApiClient class.

**`Example`**

```ts
const client = algokit.getTestNetDispenserApiClient(
    {
      authToken: 'your_auth_token',
      requestTimeout: 15,
    }
)
```

#### Defined in

[src/types/client-manager.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L83)

___

### getTypedAppClientByCreatorAndName

▸ **getTypedAppClientByCreatorAndName**\<`TClient`\>(`typedClient`, `details`, `cachedAppLookup?`): `TClient`

Returns a new typed client, resolving the app by creator address and name.

#### Type parameters

| Name |
| :------ |
| `TClient` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `typedClient` | [`TypedAppClient`](../interfaces/types_client_manager.TypedAppClient.md)\<`TClient`\> | The typed client type to use |
| `details` | [`TypedAppClientByCreatorAndNameDetails`](../modules/types_client_manager.md#typedappclientbycreatorandnamedetails) | The details to resolve the app by creator address and name |
| `cachedAppLookup?` | [`AppLookup`](../interfaces/types_app.AppLookup.md) | A cached app lookup that matches a name to on-chain details; either this is needed or indexer is required to be passed in to this manager on construction. |

#### Returns

`TClient`

The typed client instance

#### Defined in

[src/types/client-manager.ts:116](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L116)

___

### getTypedAppClientById

▸ **getTypedAppClientById**\<`TClient`\>(`typedClient`, `details`): `TClient`

Returns a new typed client, resolving the app by app ID.

#### Type parameters

| Name |
| :------ |
| `TClient` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `typedClient` | [`TypedAppClient`](../interfaces/types_client_manager.TypedAppClient.md)\<`TClient`\> | The typed client type to use |
| `details` | [`TypedAppClientByIdDetails`](../modules/types_client_manager.md#typedappclientbyiddetails) | The details to resolve the app by ID |

#### Returns

`TClient`

The typed client instance

#### Defined in

[src/types/client-manager.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L130)
