[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/testing](../README.md) / AlgorandFixtureConfig

# Interface: AlgorandFixtureConfig

Defined in: [src/types/testing.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L52)

Configuration for creating an Algorand testing fixture.

## Extends

- `Partial`\<[`AlgoConfig`](../../network-client/interfaces/AlgoConfig.md)\>

## Properties

### accountGetter()?

> `optional` **accountGetter**: (`algod`, `kmd?`) => `Promise`\<`Account`\>

Defined in: [src/types/testing.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L62)

Optional override for how to get an account; this allows you to retrieve accounts from a known or cached list of accounts.

#### Parameters

##### algod

`AlgodClient`

##### kmd?

`KmdClient`

#### Returns

`Promise`\<`Account`\>

***

### algod?

> `optional` **algod**: `AlgodClient`

Defined in: [src/types/testing.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L54)

An optional algod client, if not specified then it will create one against `algodConfig` (if present) then environment variables defined network (if present) or default LocalNet.

***

### algodConfig?

> `optional` **algodConfig**: [`AlgoClientConfig`](../../network-client/interfaces/AlgoClientConfig.md)

Defined in: [src/types/network-client.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/network-client.ts#L16)

Algod client configuration

#### Inherited from

`Partial.algodConfig`

***

### indexer?

> `optional` **indexer**: `IndexerClient`

Defined in: [src/types/testing.ts:56](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L56)

An optional indexer client, if not specified then it will create one against `indexerConfig` (if present) then environment variables defined network (if present) or default LocalNet.

***

### indexerConfig?

> `optional` **indexerConfig**: [`AlgoClientConfig`](../../network-client/interfaces/AlgoClientConfig.md)

Defined in: [src/types/network-client.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/network-client.ts#L18)

Indexer client configuration

#### Inherited from

`Partial.indexerConfig`

***

### kmd?

> `optional` **kmd**: `KmdClient`

Defined in: [src/types/testing.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L58)

An optional kmd client, if not specified then it will create one against `kmdConfig` (if present) then environment variables defined network (if present) or default LocalNet.

***

### kmdConfig?

> `optional` **kmdConfig**: [`AlgoClientConfig`](../../network-client/interfaces/AlgoClientConfig.md)

Defined in: [src/types/network-client.ts:20](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/network-client.ts#L20)

Kmd configuration

#### Inherited from

`Partial.kmdConfig`

***

### testAccountFunding?

> `optional` **testAccountFunding**: [`AlgoAmount`](../../amount/classes/AlgoAmount.md)

Defined in: [src/types/testing.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L60)

The amount of funds to allocate to the default testing account, if not specified then it will get 10 ALGO.
