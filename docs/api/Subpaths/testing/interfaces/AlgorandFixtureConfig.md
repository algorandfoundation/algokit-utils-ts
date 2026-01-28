[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/testing](../README.md) / AlgorandFixtureConfig

# Interface: AlgorandFixtureConfig

Defined in: [src/testing/types.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L55)

Configuration for creating an Algorand testing fixture.

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- `Partial`\<[`AlgoConfig`](../../../algokit-utils/interfaces/AlgoConfig.md)\>

## Properties

### accountGetter()?

> `optional` **accountGetter**: (`algorand`) => `Promise`\<[`Address`](../../../algokit-utils/classes/Address.md) & `object`\>

Defined in: [src/testing/types.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L65)

Optional override for how to get an account; this allows you to retrieve accounts from a known or cached list of accounts.

#### Parameters

##### algorand

[`AlgorandClient`](../../../algokit-utils/classes/AlgorandClient.md)

#### Returns

`Promise`\<[`Address`](../../../algokit-utils/classes/Address.md) & `object`\>

***

### algod?

> `optional` **algod**: [`AlgodClient`](../../algod-client/classes/AlgodClient.md)

Defined in: [src/testing/types.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L57)

An optional algod client, if not specified then it will create one against `algodConfig` (if present) then environment variables defined network (if present) or default LocalNet.

***

### algodConfig?

> `optional` **algodConfig**: [`AlgoClientConfig`](../../../algokit-utils/interfaces/AlgoClientConfig.md)

Defined in: [src/network-client.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L14)

Algod client configuration

#### Inherited from

[`AlgoConfig`](../../../algokit-utils/interfaces/AlgoConfig.md).[`algodConfig`](../../../algokit-utils/interfaces/AlgoConfig.md#algodconfig)

***

### indexer?

> `optional` **indexer**: [`IndexerClient`](../../indexer-client/classes/IndexerClient.md)

Defined in: [src/testing/types.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L59)

An optional indexer client, if not specified then it will create one against `indexerConfig` (if present) then environment variables defined network (if present) or default LocalNet.

***

### indexerConfig?

> `optional` **indexerConfig**: [`AlgoClientConfig`](../../../algokit-utils/interfaces/AlgoClientConfig.md)

Defined in: [src/network-client.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L16)

Indexer client configuration

#### Inherited from

[`AlgoConfig`](../../../algokit-utils/interfaces/AlgoConfig.md).[`indexerConfig`](../../../algokit-utils/interfaces/AlgoConfig.md#indexerconfig)

***

### kmd?

> `optional` **kmd**: [`KmdClient`](../../kmd-client/classes/KmdClient.md)

Defined in: [src/testing/types.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L61)

An optional kmd client, if not specified then it will create one against `kmdConfig` (if present) then environment variables defined network (if present) or default LocalNet.

***

### kmdConfig?

> `optional` **kmdConfig**: [`AlgoClientConfig`](../../../algokit-utils/interfaces/AlgoClientConfig.md)

Defined in: [src/network-client.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L18)

Kmd configuration

#### Inherited from

[`AlgoConfig`](../../../algokit-utils/interfaces/AlgoConfig.md).[`kmdConfig`](../../../algokit-utils/interfaces/AlgoConfig.md#kmdconfig)

***

### testAccountFunding?

> `optional` **testAccountFunding**: [`AlgoAmount`](../../../algokit-utils/classes/AlgoAmount.md)

Defined in: [src/testing/types.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L63)

The amount of funds to allocate to the default testing account, if not specified then it will get 10 ALGO.
