[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / AlgoClientConfig

# Interface: AlgoClientConfig

[index](../modules/index.md).AlgoClientConfig

Config for an Algorand SDK client

## Table of contents

### Properties

- [port](index.AlgoClientConfig.md#port)
- [server](index.AlgoClientConfig.md#server)
- [token](index.AlgoClientConfig.md#token)

## Properties

### port

• `Optional` **port**: `string` \| `number`

The port to use e.g. 4001, 443, etc.

#### Defined in

[network-client.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/network-client.ts#L10)

___

### server

• **server**: `string`

Base URL of the server e.g. http://localhost, https://testnet-api.algonode.cloud/, etc.

#### Defined in

[network-client.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/network-client.ts#L8)

___

### token

• `Optional` **token**: `string` \| `TokenHeader`

The token to use for API authentication (or undefined if none needed) - can be a string, or an object with the header key => value

#### Defined in

[network-client.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/88a7c0f/src/network-client.ts#L12)
