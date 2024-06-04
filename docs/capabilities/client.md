# Client management

Client management is one of the core capabilities provided by AlgoKit Utils. It allows you to create (auto-retry) [algod](https://developer.algorand.org/docs/rest-apis/algod), [indexer](https://developer.algorand.org/docs/rest-apis/indexer) and [kmd](https://developer.algorand.org/docs/rest-apis/kmd) clients against various networks resolved from environment or specified configuration.

Any AlgoKit Utils function that needs one of these clients will take the underlying algosdk classes (`algosdk.Algodv2`, `algosdk.Indexer`, `algosdk.Kmd`) so inline with the [Modularity](../README.md#core-principles) principle you can use existing logic to get instances of these clients without needing to use the Client management capability if you prefer, including use of libraries like [useWallet](https://github.com/TxnLab/use-wallet) that have their own configuration mechanism.

To see some usage examples check out the [automated tests](../../src/network-client.spec.ts).

## ClientManager

The [`ClientManager`](../code/classes/types_client_manager.ClientManager.md) class is used to manage instances of clients to the various Algorand APIs. A `ClientManager` instance can be accessed through an `AlgorandClient` instance via `AlgorandClient.prototype.clients`.

## Common configurations

An `AlgorandClient` instance can be created through a variety of static methods, each of which result in the same underlying `AlgorandClient` instance with the exception of the network details used for `ClientManager` clients.

- [`AlgorandClient.defaultLocalNet()`](../code/classes/types_algorand_client.AlgorandClient.md#defaultlocalnet) - Connection to the default `algokit localnet` ports on `localhost`
- [`AlgorandClient.testNet()`](../code/classes/types_algorand_client.AlgorandClient.md#testnet) - Connection to the Algorand testnet via a free API provider (currently [Nodely](https://nodely.io/))
- [`AlgorandClient.mainNet()`](../code/classes/types_algorand_client.AlgorandClient.md#mainnet) - Connection to the Algorand mainnet via a free API provider (currently [Nodely](https://nodely.io/))
- [`AlgorandClient.fromConfig(config)`](../code/classes/types_algorand_client.AlgorandClient.md#fromconfig) - Connection to a network specified by the provided configuration (see below section for configuration details)
- [`AlgorandClient.fromEnvironment()`](../code/classes/types_algorand_client.AlgorandClient.md#fromEnvironment) - Connection to a network specified by environment variables
- [`AlgorandClient.fromClients(clients)`](../code/classes/types_algorand_client.AlgorandClient.md#fromClients) - Create an `AlgorandClient` instance using pre-existing client instances

## Accessing clients

Once you have an `AlgorandClient` instance, you can access the clients for the various Algorand APIs via the `AlgorandClient.prototype.client` property.

```ts
const algorand = AlgorandClient.defaultLocalNet()

const algodClient = algorand.client.algod
const indexerClient = algorand.client.indexer
const kmdClient = algorand.client.kmd
```

## Automatic retry

When receiving an Algod client from AlgoKit Utils, it will be a special wrapper client that has transient failure retries in there. This is done via the [`AlgoHttpClientWithRetry`](../code/classes/types_algo_http_client_with_retry.AlgoHttpClientWithRetry.md) class.

## Network configuration

The network configuration is specified using the [`AlgoClientConfig`](../code/interfaces/types_network_client.AlgoClientConfig.md) interface. This same interface is used to specify the config for algod, indexer and kmd clients.

There are a number of ways to produce one of these configuration objects:

- Manually specifying an object that conforms with the interface, e.g.
  ```typescript
  {
    server: 'https://myalgodnode.com'
  }
  // Or with the optional values:
  {
    server: 'https://myalgodnode.com',
    port: 443,
    token: 'SECRET_TOKEN'
  }
  ```
- [`algokit.getConfigFromEnvOrDefaults()`](../code/modules/index.md#getconfigfromenvordefaults) - Loads the Algod client config, the Indexer client config and the Kmd config from well-known environment variables; useful to have code that can work across multiple blockchain environments (including LocalNet), without having to change
- [`algokit.getAlgodConfigFromEnvironment()`](../code/modules/index.md#getalgodconfigfromenvironment) - Loads an Algod client config from well-known environment variables; useful to have code that can work across multiple blockchain environments (including LocalNet), without having to change
- [`algokit.getIndexerConfigFromEnvironment()`](../code/modules/index.md#getindexerconfigfromenvironment) - Loads an Indexer client config from well-known environment variables; useful to have code that can work across multiple blockchain environments (including LocalNet), without having to change
- [`algokit.getAlgoNodeConfig(network, config)`](../code/modules/index.md#getalgo) - Loads an Algod or indexer config against [AlgoNode](https://algonode.io/api/) to either MainNet or TestNet
- [`getDefaultLocalNetConfig(configOrPort)`](../code/modules/index.md#getdefaultlocalnetconfig) - Loads an Algod, Indexer or Kmd config against [LocalNet](https://github.com/algorandfoundation/algokit-cli/blob/main/docs/features/localnet.md) using the default configuration
