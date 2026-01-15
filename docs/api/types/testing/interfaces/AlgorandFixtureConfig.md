[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/testing](../README.md) / AlgorandFixtureConfig

# Interface: AlgorandFixtureConfig

Defined in: [src/types/testing.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L55)

Configuration for creating an Algorand testing fixture.

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- `Partial`\<[`AlgoConfig`](../../network-client/interfaces/AlgoConfig.md)\>

## Properties

### accountGetter()?

> `optional` **accountGetter**: (`algorand`) => `Promise`\<[`Address`](../../../algokit-utils/classes/Address.md) & `object`\>

Defined in: [src/types/testing.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L65)

Optional override for how to get an account; this allows you to retrieve accounts from a known or cached list of accounts.

#### Parameters

##### algorand

[`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

#### Returns

`Promise`\<[`Address`](../../../algokit-utils/classes/Address.md) & `object`\>

***

### algod?

> `optional` **algod**: [`AlgodClient`](../../../Subpaths/algod-client/classes/AlgodClient.md)

Defined in: [src/types/testing.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L57)

An optional algod client, if not specified then it will create one against `algodConfig` (if present) then environment variables defined network (if present) or default LocalNet.

***

### algodConfig?

> `optional` **algodConfig**: [`AlgoClientConfig`](../../network-client/interfaces/AlgoClientConfig.md)

Defined in: [src/types/network-client.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/network-client.ts#L14)

Algod client configuration

#### Inherited from

[`AlgoConfig`](../../network-client/interfaces/AlgoConfig.md).[`algodConfig`](../../network-client/interfaces/AlgoConfig.md#algodconfig)

***

### indexer?

> `optional` **indexer**: [`IndexerClient`](../../../Subpaths/indexer-client/classes/IndexerClient.md)

Defined in: [src/types/testing.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L59)

An optional indexer client, if not specified then it will create one against `indexerConfig` (if present) then environment variables defined network (if present) or default LocalNet.

***

### indexerConfig?

> `optional` **indexerConfig**: [`AlgoClientConfig`](../../network-client/interfaces/AlgoClientConfig.md)

Defined in: [src/types/network-client.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/network-client.ts#L16)

Indexer client configuration

#### Inherited from

[`AlgoConfig`](../../network-client/interfaces/AlgoConfig.md).[`indexerConfig`](../../network-client/interfaces/AlgoConfig.md#indexerconfig)

***

### kmd?

> `optional` **kmd**: [`KmdClient`](../../../Subpaths/kmd-client/classes/KmdClient.md)

Defined in: [src/types/testing.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L61)

An optional kmd client, if not specified then it will create one against `kmdConfig` (if present) then environment variables defined network (if present) or default LocalNet.

***

### kmdConfig?

> `optional` **kmdConfig**: [`AlgoClientConfig`](../../network-client/interfaces/AlgoClientConfig.md)

Defined in: [src/types/network-client.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/network-client.ts#L18)

Kmd configuration

#### Inherited from

[`AlgoConfig`](../../network-client/interfaces/AlgoConfig.md).[`kmdConfig`](../../network-client/interfaces/AlgoConfig.md#kmdconfig)

***

### testAccountFunding?

> `optional` **testAccountFunding**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/testing.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L63)

The amount of funds to allocate to the default testing account, if not specified then it will get 10 ALGO.
