# Algorand client

`AlgorandClient` is a client class that brokers easy access to Algorand functionality. It's the [default entrypoint](../README.md#usage) into AlgoKit Utils functionality.

The main entrypoint to the bulk of the functionality in AlgoKit Utils is the `AlgorandClient` class, most of the time you can get started by typing `algokit.AlgorandClient.` and choosing one of the static initialisation methods to create an [Algorand client](./capabilities/algorand-client.md), e.g.:

```typescript
// Point to the network configured through environment variables or
//  if no environment variables it will point to the default LocalNet
//  configuration
const algorand = algokit.AlgorandClient.fromEnvironment()
// Point to default LocalNet configuration
const algorand = algokit.AlgorandClient.defaultLocalNet()
// Point to TestNet using AlgoNode free tier
const algorand = algokit.AlgorandClient.testNet()
// Point to MainNet using AlgoNode free tier
const algorand = algokit.AlgorandClient.mainNet()
// Point to a pre-created algod client
const algorand = algokit.AlgorandClient.fromClients({ algod })
// Point to pre-created algod, indexer and kmd clients
const algorand = algokit.AlgorandClient.fromClients({ algod, indexer, kmd })
// Point to custom configuration for algod
const algorand = algokit.AlgorandClient.fromConfig({ algodConfig })
// Point to custom configuration for algod, indexer and kmd
const algorand = algokit.AlgorandClient.fromConfig({ algodConfig, indexerConfig, kmdConfig })
```

## Accessing SDK clients

Once you have an `AlgorandClient` instance, you can access the SDK clients for the various Algorand APIs via the `algorand.client` property.

```ts
const algorand = AlgorandClient.defaultLocalNet()

const algodClient = algorand.client.algod
const indexerClient = algorand.client.indexer
const kmdClient = algorand.client.kmd
```
