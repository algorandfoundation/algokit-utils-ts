[@algorandfoundation/algokit-utils](../README.md) / [types/testing](../modules/types_testing.md) / AlgorandFixtureConfig

# Interface: AlgorandFixtureConfig

[types/testing](../modules/types_testing.md).AlgorandFixtureConfig

Configuration for creating an Algorand testing fixture.

## Hierarchy

- `Partial`\<[`AlgoConfig`](types_network_client.AlgoConfig.md)\>

  ↳ **`AlgorandFixtureConfig`**

## Table of contents

### Properties

- [accountGetter](types_testing.AlgorandFixtureConfig.md#accountgetter)
- [algod](types_testing.AlgorandFixtureConfig.md#algod)
- [algodConfig](types_testing.AlgorandFixtureConfig.md#algodconfig)
- [indexer](types_testing.AlgorandFixtureConfig.md#indexer)
- [indexerConfig](types_testing.AlgorandFixtureConfig.md#indexerconfig)
- [kmd](types_testing.AlgorandFixtureConfig.md#kmd)
- [kmdConfig](types_testing.AlgorandFixtureConfig.md#kmdconfig)
- [testAccountFunding](types_testing.AlgorandFixtureConfig.md#testaccountfunding)

## Properties

### accountGetter

• `Optional` **accountGetter**: (`algod`: `default`, `kmd?`: `default`) => `Promise`\<`default`\>

Optional override for how to get an account; this allows you to retrieve accounts from a known or cached list of accounts.

#### Type declaration

▸ (`algod`, `kmd?`): `Promise`\<`default`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `algod` | `default` |
| `kmd?` | `default` |

##### Returns

`Promise`\<`default`\>

#### Defined in

[src/types/testing.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L63)

___

### algod

• `Optional` **algod**: `default`

An optional algod client, if not specified then it will create one against `algodConfig` (if present) then environment variables defined network (if present) or default LocalNet.

#### Defined in

[src/types/testing.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L55)

___

### algodConfig

• `Optional` **algodConfig**: [`AlgoClientConfig`](types_network_client.AlgoClientConfig.md)

Algo client configuration

#### Inherited from

Partial.algodConfig

#### Defined in

[src/types/network-client.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/network-client.ts#L16)

___

### indexer

• `Optional` **indexer**: `default`

An optional indexer client, if not specified then it will create one against `indexerConfig` (if present) then environment variables defined network (if present) or default LocalNet.

#### Defined in

[src/types/testing.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L57)

___

### indexerConfig

• `Optional` **indexerConfig**: [`AlgoClientConfig`](types_network_client.AlgoClientConfig.md)

Indexer client configuration

#### Inherited from

Partial.indexerConfig

#### Defined in

[src/types/network-client.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/network-client.ts#L18)

___

### kmd

• `Optional` **kmd**: `default`

An optional kmd client, if not specified then it will create one against `kmdConfig` (if present) then environment variables defined network (if present) or default LocalNet.

#### Defined in

[src/types/testing.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L59)

___

### kmdConfig

• `Optional` **kmdConfig**: [`AlgoClientConfig`](types_network_client.AlgoClientConfig.md)

Kmd configuration

#### Inherited from

Partial.kmdConfig

#### Defined in

[src/types/network-client.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/network-client.ts#L20)

___

### testAccountFunding

• `Optional` **testAccountFunding**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The amount of funds to allocate to the default testing account, if not specified then it will get 10 Algos.

#### Defined in

[src/types/testing.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L61)
