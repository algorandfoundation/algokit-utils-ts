[@algorandfoundation/algokit-utils](../README.md) / [types/client-manager](../modules/types_client_manager.md) / ClientManager

# Class: ClientManager

[types/client-manager](../modules/types_client_manager.md).ClientManager

Exposes access to various API clients.

## Table of contents

### Constructors

- [constructor](types_client_manager.ClientManager.md#constructor)

### Properties

- [\_algod](types_client_manager.ClientManager.md#_algod)
- [\_getNetworkPromise](types_client_manager.ClientManager.md#_getnetworkpromise)
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
- [isLocalNet](types_client_manager.ClientManager.md#islocalnet)
- [isMainNet](types_client_manager.ClientManager.md#ismainnet)
- [isTestNet](types_client_manager.ClientManager.md#istestnet)
- [network](types_client_manager.ClientManager.md#network)
- [genesisIdIsLocalNet](types_client_manager.ClientManager.md#genesisidislocalnet)
- [getAlgoNodeConfig](types_client_manager.ClientManager.md#getalgonodeconfig)
- [getAlgodClient](types_client_manager.ClientManager.md#getalgodclient)
- [getAlgodClientFromEnvironment](types_client_manager.ClientManager.md#getalgodclientfromenvironment)
- [getAlgodConfigFromEnvironment](types_client_manager.ClientManager.md#getalgodconfigfromenvironment)
- [getConfigFromEnvironmentOrLocalNet](types_client_manager.ClientManager.md#getconfigfromenvironmentorlocalnet)
- [getDefaultLocalNetConfig](types_client_manager.ClientManager.md#getdefaultlocalnetconfig)
- [getIndexerClient](types_client_manager.ClientManager.md#getindexerclient)
- [getIndexerClientFromEnvironment](types_client_manager.ClientManager.md#getindexerclientfromenvironment)
- [getIndexerConfigFromEnvironment](types_client_manager.ClientManager.md#getindexerconfigfromenvironment)
- [getKmdClient](types_client_manager.ClientManager.md#getkmdclient)
- [getKmdClientFromEnvironment](types_client_manager.ClientManager.md#getkmdclientfromenvironment)

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

**`Example`**

```typescript
const clientManager = new ClientManager({ algod: algodClient })
```

**`Example`**

```typescript
const clientManager = new ClientManager({ algod: algodClient, indexer: indexerClient, kmd: kmdClient })
```

**`Example`**

```typescript
const clientManager = new ClientManager({ algodConfig })
```

**`Example`**

```typescript
const clientManager = new ClientManager({ algodConfig, indexerConfig, kmdConfig })
```

#### Defined in

[src/types/client-manager.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L70)

## Properties

### \_algod

• `Private` **\_algod**: `default`

#### Defined in

[src/types/client-manager.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L46)

___

### \_getNetworkPromise

• `Private` **\_getNetworkPromise**: `undefined` \| `Promise`\<`SuggestedParamsWithMinFee`\>

#### Defined in

[src/types/client-manager.ts:101](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L101)

___

### \_indexer

• `Private` `Optional` **\_indexer**: `default`

#### Defined in

[src/types/client-manager.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L47)

___

### \_kmd

• `Private` `Optional` **\_kmd**: `default`

#### Defined in

[src/types/client-manager.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L48)

## Accessors

### algod

• `get` **algod**(): `default`

Returns an algosdk Algod API client.

#### Returns

`default`

#### Defined in

[src/types/client-manager.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L85)

___

### indexer

• `get` **indexer**(): `default`

Returns an algosdk Indexer API client or throws an error if it's not been provided.

#### Returns

`default`

#### Defined in

[src/types/client-manager.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L90)

___

### kmd

• `get` **kmd**(): `default`

Returns an algosdk KMD API client or throws an error if it's not been provided.

#### Returns

`default`

#### Defined in

[src/types/client-manager.ts:96](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L96)

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

[src/types/client-manager.ts:185](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L185)

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

[src/types/client-manager.ts:197](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L197)

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
const client = clientManager.getTestNetDispenser(
    {
      authToken: 'your_auth_token',
      requestTimeout: 15,
    }
)
```

#### Defined in

[src/types/client-manager.ts:175](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L175)

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

[src/types/client-manager.ts:208](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L208)

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

[src/types/client-manager.ts:222](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L222)

___

### isLocalNet

▸ **isLocalNet**(): `Promise`\<`boolean`\>

Returns true if the current network is LocalNet.

#### Returns

`Promise`\<`boolean`\>

True if the current network is LocalNet.

#### Defined in

[src/types/client-manager.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L139)

___

### isMainNet

▸ **isMainNet**(): `Promise`\<`boolean`\>

Returns true if the current network is MainNet.

#### Returns

`Promise`\<`boolean`\>

True if the current network is MainNet.

#### Defined in

[src/types/client-manager.ts:155](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L155)

___

### isTestNet

▸ **isTestNet**(): `Promise`\<`boolean`\>

Returns true if the current network is TestNet.

#### Returns

`Promise`\<`boolean`\>

True if the current network is TestNet.

#### Defined in

[src/types/client-manager.ts:147](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L147)

___

### network

▸ **network**(): `Promise`\<[`NetworkDetails`](../interfaces/types_client_manager.NetworkDetails.md)\>

Get details about the current network.

#### Returns

`Promise`\<[`NetworkDetails`](../interfaces/types_client_manager.NetworkDetails.md)\>

The current network details

**`Example`**

```typescript
const network = await networkClient.network()
const genesisId = network.genesisId
```

#### Defined in

[src/types/client-manager.ts:111](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L111)

___

### genesisIdIsLocalNet

▸ **genesisIdIsLocalNet**(`genesisId`): `boolean`

Returns true if the given network genesisId is associated with a LocalNet network.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `genesisId` | `string` | The network genesis ID |

#### Returns

`boolean`

Whether the given genesis ID is associated with a LocalNet network

#### Defined in

[src/types/client-manager.ts:131](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L131)

___

### getAlgoNodeConfig

▸ **getAlgoNodeConfig**(`network`, `config`): [`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

Returns the Algorand configuration to point to the free tier of the AlgoNode service.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `network` | ``"testnet"`` \| ``"mainnet"`` | Which network to connect to - TestNet or MainNet |
| `config` | ``"algod"`` \| ``"indexer"`` | Which algod config to return - Algod or Indexer |

#### Returns

[`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

#### Defined in

[src/types/client-manager.ts:314](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L314)

___

### getAlgodClient

▸ **getAlgodClient**(`config`): `default`

Returns an algod SDK client that automatically retries on idempotent calls.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md) | The config of the client |

#### Returns

`default`

**`Example`**

```typescript
 const algod = ClientManager.getAlgodClient(ClientManager.getAlgoNodeConfig('testnet', 'algod'))
 await algod.healthCheck().do()
```

**`Example`**

```typescript
 const algod = ClientManager.getAlgodClient(ClientManager.getAlgoNodeConfig('mainnet', 'algod'))
 await algod.healthCheck().do()
```

**`Example`**

```typescript
 const algod = ClientManager.getAlgodClient({server: 'http://localhost', port: '4001', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
 await algod.healthCheck().do()
```

#### Defined in

[src/types/client-manager.ts:353](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L353)

___

### getAlgodClientFromEnvironment

▸ **getAlgodClientFromEnvironment**(): `default`

Returns an algod SDK client that automatically retries on idempotent calls loaded from environment variables (expects to be called from a Node.js environment).

#### Returns

`default`

**`Example`**

```typescript
 // Uses process.env.ALGOD_SERVER, process.env.ALGOD_PORT and process.env.ALGOD_TOKEN
 const algod = ClientManager.getAlgodClientFromEnvironment()
 await algod.healthCheck().do()
 ```

#### Defined in

[src/types/client-manager.ts:370](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L370)

___

### getAlgodConfigFromEnvironment

▸ **getAlgodConfigFromEnvironment**(): [`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

Retrieve the algod configuration from environment variables (expects to be called from a Node.js environment)

Expects `process.env.ALGOD_SERVER` to be defined, and you can also specify `process.env.ALGOD_PORT` and `process.env.ALGOD_TOKEN`.

#### Returns

[`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

#### Defined in

[src/types/client-manager.ts:272](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L272)

___

### getConfigFromEnvironmentOrLocalNet

▸ **getConfigFromEnvironmentOrLocalNet**(): [`AlgoConfig`](../interfaces/types_network_client.AlgoConfig.md)

Retrieve client configurations from environment variables when defined or get defaults (expects to be called from a Node.js environment)

If both `process.env.INDEXER_SERVER` and `process.env.ALGOD_SERVER` is defined it will use both along with optional `process.env.ALGOD_PORT`, `process.env.ALGOD_TOKEN`, `process.env.INDEXER_PORT` and `process.env.INDEXER_TOKEN`.

If only `process.env.ALGOD_SERVER` is defined it will use this along with optional `process.env.ALGOD_PORT` and `process.env.ALGOD_TOKEN` and leave indexer as `undefined`.

If only `process.env.INDEXER_SERVER` is defined it will use the default (LocalNet) configuration for both algod and indexer.

It will return a KMD configuration that uses `process.env.KMD_PORT` (or port 4002) if `process.env.ALGOD_SERVER` is defined,
otherwise it will use the default LocalNet config unless it detects testnet or mainnet.

#### Returns

[`AlgoConfig`](../interfaces/types_network_client.AlgoConfig.md)

The config for algod, indexer and kmd

**`Example`**

```typescript
const config = ClientManager.getConfigFromEnvironmentOrLocalNet()
```

#### Defined in

[src/types/client-manager.ts:243](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L243)

___

### getDefaultLocalNetConfig

▸ **getDefaultLocalNetConfig**(`configOrPort`): [`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

Returns the Algorand configuration to point to the default LocalNet.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `configOrPort` | `number` \| ``"algod"`` \| ``"indexer"`` \| ``"kmd"`` | Which algod config to return - algod, kmd, or indexer OR a port number |

#### Returns

[`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

#### Defined in

[src/types/client-manager.ts:325](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L325)

___

### getIndexerClient

▸ **getIndexerClient**(`config`, `overrideIntDecoding?`): `default`

Returns an indexer SDK client that automatically retries on idempotent calls

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md) | The config of the client |
| `overrideIntDecoding?` | `IntDecoding` | Override the default int decoding for responses, uses MIXED by default to avoid lost precision for big integers |

#### Returns

`default`

**`Example`**

```typescript
 const indexer = ClientManager.getIndexerClient(ClientManager.getAlgoNodeConfig('testnet', 'indexer'))
 await indexer.makeHealthCheck().do()
```

**`Example`**

```typescript
 const indexer = ClientManager.getIndexerClient(ClientManager.getAlgoNodeConfig('mainnet', 'indexer'))
 await indexer.makeHealthCheck().do()
```

**`Example`**

```typescript
 const indexer = ClientManager.getIndexerClient({server: 'http://localhost', port: '8980', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
 await indexer.makeHealthCheck().do()
```

**`Example`**

```typescript
 const indexer = ClientManager.getIndexerClient(config, IntDecoding.BIGINT)
```

#### Defined in

[src/types/client-manager.ts:399](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L399)

___

### getIndexerClientFromEnvironment

▸ **getIndexerClientFromEnvironment**(`overrideIntDecoding?`): `default`

Returns an indexer SDK client that automatically retries on idempotent calls loaded from environment variables (expects to be called from a Node.js environment).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `overrideIntDecoding?` | `IntDecoding` | Override the default int decoding for responses, uses MIXED by default to avoid lost precision for big integers |

#### Returns

`default`

**`Example`**

```typescript
 // Uses process.env.INDEXER_SERVER, process.env.INDEXER_PORT and process.env.INDEXER_TOKEN
 const indexer = ClientManager.getIndexerClientFromEnvironment()
 await indexer.makeHealthCheck().do()
 ```

#### Defined in

[src/types/client-manager.ts:421](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L421)

___

### getIndexerConfigFromEnvironment

▸ **getIndexerConfigFromEnvironment**(): [`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

Retrieve the indexer configuration from environment variables (expects to be called from a Node.js environment).

Expects `process.env.INDEXER_SERVER` to be defined, and you can also specify `process.env.INDEXER_PORT` and `process.env.INDEXER_TOKEN`.

#### Returns

[`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md)

#### Defined in

[src/types/client-manager.ts:293](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L293)

___

### getKmdClient

▸ **getKmdClient**(`config`): `default`

Returns a KMD SDK client.

KMD client allows you to export private keys, which is useful to (for instance) get the default account in a LocalNet network.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`AlgoClientConfig`](../interfaces/types_network_client.AlgoClientConfig.md) | The config for the client |

#### Returns

`default`

**`Example`**

```typescript
 const kmd = ClientManager.getKmdClient({server: 'http://localhost', port: '4002', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
```

#### Defined in

[src/types/client-manager.ts:436](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L436)

___

### getKmdClientFromEnvironment

▸ **getKmdClientFromEnvironment**(): `default`

Returns a KMD SDK client that automatically retries on idempotent calls loaded from environment variables (expects to be called from a Node.js environment).

#### Returns

`default`

**`Example`**

```typescript
 // Uses process.env.ALGOD_SERVER, process.env.KMD_PORT (or if not specified: port 4002) and process.env.ALGOD_TOKEN
 const kmd = ClientManager.getKmdClientFromEnvironment()
 ```

#### Defined in

[src/types/client-manager.ts:450](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/client-manager.ts#L450)
