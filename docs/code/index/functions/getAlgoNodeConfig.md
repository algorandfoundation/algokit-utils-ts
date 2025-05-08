[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getAlgoNodeConfig

# Function: ~~getAlgoNodeConfig()~~

> **getAlgoNodeConfig**(`network`, `config`): [`AlgoClientConfig`](../../types/network-client/interfaces/AlgoClientConfig.md)

Defined in: [src/network-client.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L43)

## Parameters

### network

Which network to connect to - TestNet or MainNet

`"testnet"` | `"mainnet"`

### config

Which algod config to return - Algod or Indexer

`"algod"` | `"indexer"`

## Returns

[`AlgoClientConfig`](../../types/network-client/interfaces/AlgoClientConfig.md)

## Deprecated

Use `ClientManager.getAlgoNodeConfig(network, config)` instead.

Returns the Algorand configuration to point to the AlgoNode service
