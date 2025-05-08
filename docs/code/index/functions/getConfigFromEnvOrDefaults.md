[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getConfigFromEnvOrDefaults

# Function: ~~getConfigFromEnvOrDefaults()~~

> **getConfigFromEnvOrDefaults**(): [`AlgoConfig`](../../types/network-client/interfaces/AlgoConfig.md)

Defined in: [src/network-client.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L13)

## Returns

[`AlgoConfig`](../../types/network-client/interfaces/AlgoConfig.md)

## Deprecated

Use `ClientManager.getConfigFromEnvironmentOrLocalNet()` instead.

Retrieve configurations from environment variables when defined or get defaults (expects to be called from a Node.js environment not algod-side)
