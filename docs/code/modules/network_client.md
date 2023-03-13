[algotstest](../README.md) / network-client

# Module: network-client

## Table of contents

### References

- [isLocalNet](network_client.md#islocalnet)

### Interfaces

- [AlgoClientConfig](../interfaces/network_client.AlgoClientConfig.md)

### Functions

- [getAlgoClient](network_client.md#getalgoclient)
- [getAlgoIndexerClient](network_client.md#getalgoindexerclient)
- [getAlgoKmdClient](network_client.md#getalgokmdclient)
- [getAlgoNodeConfig](network_client.md#getalgonodeconfig)
- [getAlgodConfigFromEnvironment](network_client.md#getalgodconfigfromenvironment)
- [getDefaultLocalNetConfig](network_client.md#getdefaultlocalnetconfig)
- [getIndexerConfigFromEnvironment](network_client.md#getindexerconfigfromenvironment)

## References

### isLocalNet

Re-exports [isLocalNet](localnet.md#islocalnet)

## Functions

### getAlgoClient

▸ **getAlgoClient**(`config?`): `Algodv2`

Returns an algod SDK client that automatically retries on idempotent calls

**`Example`**

Default (load from environment variables)

 ```
 // Uses process.env.ALGOD_SERVER, process.env.ALGOD_PORT and process.env.ALGOD_TOKEN
 // Automatically detects if you are using PureStake to switch in the right header name for ALGOD_TOKEN
 const algod = getAlgoClient()
 await algod.healthCheck().do()
 ```

**`Example`**

AlgoNode (testnet)
```
 const algod = getAlgoClient(getAlgoNodeConfig('testnet', 'algod'))
 await algod.healthCheck().do()
```

**`Example`**

AlgoNode (mainnet)
```
 const algod = getAlgoClient(getAlgoNodeConfig('mainnet', 'algod'))
 await algod.healthCheck().do()
```

**`Example`**

Custom (e.g. default local sandbox, although we recommend loading this into a .env and using the Default option instead)
```
 const algod = getAlgoClient({server: 'http://localhost', port: '4001', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
 await algod.healthCheck().do()
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`AlgoClientConfig`](../interfaces/network_client.AlgoClientConfig.md) | The config if you want to override the default (getting config from process.env) |

#### Returns

`Algodv2`

#### Defined in

[network-client.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/network-client.ts#L108)

___

### getAlgoIndexerClient

▸ **getAlgoIndexerClient**(`config?`): `Indexer`

Returns an indexer SDK client that automatically retries on idempotent calls

**`Example`**

Default (load from environment variables)

 ```
 // Uses process.env.INDEXER_SERVER, process.env.INDEXER_PORT and process.env.INDEXER_TOKEN
 // Automatically detects if you are using PureStake to switch in the right header name for INDEXER_TOKEN
 const indexer = getAlgoIndexerClient()
 await indexer.makeHealthCheck().do()
 ```

**`Example`**

AlgoNode (testnet)
```
 const indexer = getAlgoIndexerClient(getAlgoNodeConfig('testnet', 'indexer'))
 await indexer.makeHealthCheck().do()
```

**`Example`**

AlgoNode (mainnet)
```
 const indexer = getAlgoIndexerClient(getAlgoNodeConfig('mainnet', 'indexer'))
 await indexer.makeHealthCheck().do()
```

**`Example`**

Custom (e.g. default local sandbox, although we recommend loading this into a .env and using the Default option instead)
```
 const indexer = getAlgoIndexerClient({server: 'http://localhost', port: '8980', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
 await indexer.makeHealthCheck().do()
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`AlgoClientConfig`](../interfaces/network_client.AlgoClientConfig.md) | The config if you want to override the default (getting config from process.env) |

#### Returns

`Indexer`

#### Defined in

[network-client.ts:141](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/network-client.ts#L141)

___

### getAlgoKmdClient

▸ **getAlgoKmdClient**(`config?`): `Kmd`

Returns a KMD SDK client that automatically retries on idempotent calls

KMD client allows you to export private keys, which is useful to get the default account in a sandbox network.

**`Example`**

Default (load from environment variables)

 ```
 // Uses process.env.ALGOD_SERVER, process.env.KMD_PORT (or if not specified: port 4002) and process.env.ALGOD_TOKEN
 const kmd = getAlgoKmdClient()
 ```

**`Example`**

Custom (e.g. default local sandbox, although we recommend loading this into a .env and using the Default option instead)
```
 const kmd = getAlgoKmdClient({server: 'http://localhost', port: '4002', token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'})
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | [`AlgoClientConfig`](../interfaces/network_client.AlgoClientConfig.md) | The config if you want to override the default (getting config from process.env) |

#### Returns

`Kmd`

#### Defined in

[network-client.ts:164](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/network-client.ts#L164)

___

### getAlgoNodeConfig

▸ **getAlgoNodeConfig**(`network`, `config`): [`AlgoClientConfig`](../interfaces/network_client.AlgoClientConfig.md)

Returns the Algorand configuration to point to the AlgoNode service

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `network` | ``"testnet"`` \| ``"mainnet"`` | Which network to connect to - TestNet or MainNet |
| `config` | ``"algod"`` \| ``"indexer"`` | Which algod config to return - Algod or Indexer |

#### Returns

[`AlgoClientConfig`](../interfaces/network_client.AlgoClientConfig.md)

#### Defined in

[network-client.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/network-client.ts#L54)

___

### getAlgodConfigFromEnvironment

▸ **getAlgodConfigFromEnvironment**(): [`AlgoClientConfig`](../interfaces/network_client.AlgoClientConfig.md)

Retrieve the algod configuration from environment variables (expects to be called from a Node.js environment not algod-side)

#### Returns

[`AlgoClientConfig`](../interfaces/network_client.AlgoClientConfig.md)

#### Defined in

[network-client.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/network-client.ts#L16)

___

### getDefaultLocalNetConfig

▸ **getDefaultLocalNetConfig**(`configOrPort`): [`AlgoClientConfig`](../interfaces/network_client.AlgoClientConfig.md)

Returns the Algorand configuration to point to the default LocalNet

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `configOrPort` | `number` \| ``"algod"`` \| ``"indexer"`` \| ``"kmd"`` | Which algod config to return - algod, kmd, or indexer OR a port number |

#### Returns

[`AlgoClientConfig`](../interfaces/network_client.AlgoClientConfig.md)

#### Defined in

[network-client.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/network-client.ts#L65)

___

### getIndexerConfigFromEnvironment

▸ **getIndexerConfigFromEnvironment**(): [`AlgoClientConfig`](../interfaces/network_client.AlgoClientConfig.md)

Retrieve the indexer configuration from environment variables (expects to be called from a Node.js environment not algod-side)

#### Returns

[`AlgoClientConfig`](../interfaces/network_client.AlgoClientConfig.md)

#### Defined in

[network-client.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/4edaa90/src/network-client.ts#L33)
