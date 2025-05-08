[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getDefaultLocalNetConfig

# Function: ~~getDefaultLocalNetConfig()~~

> **getDefaultLocalNetConfig**(`configOrPort`): [`AlgoClientConfig`](../../types/network-client/interfaces/AlgoClientConfig.md)

Defined in: [src/network-client.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L54)

## Parameters

### configOrPort

Which algod config to return - algod, kmd, or indexer OR a port number

`number` | `"algod"` | `"indexer"` | `"kmd"`

## Returns

[`AlgoClientConfig`](../../types/network-client/interfaces/AlgoClientConfig.md)

## Deprecated

Use `ClientManager.getDefaultLocalNetConfig(configOrPort)` instead.

Returns the Algorand configuration to point to the default LocalNet
