[@algorandfoundation/algokit-utils](../README.md) / [types/network-client](../modules/types_network_client.md) / AlgoClientConfig

# Interface: AlgoClientConfig

[types/network-client](../modules/types_network_client.md).AlgoClientConfig

Config for an Algorand SDK client

## Table of contents

### Properties

- [port](types_network_client.AlgoClientConfig.md#port)
- [server](types_network_client.AlgoClientConfig.md#server)
- [token](types_network_client.AlgoClientConfig.md#token)

## Properties

### port

• `Optional` **port**: `string` \| `number`

The port to use e.g. 4001, 443, etc.

#### Defined in

types/network-client.ts:8

___

### server

• **server**: `string`

Base URL of the server e.g. http://localhost, https://testnet-api.algonode.cloud/, etc.

#### Defined in

types/network-client.ts:6

___

### token

• `Optional` **token**: `string` \| `TokenHeader`

The token to use for API authentication (or undefined if none needed) - can be a string, or an object with the header key => value

#### Defined in

types/network-client.ts:10
