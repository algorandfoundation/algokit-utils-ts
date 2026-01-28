[@algorandfoundation/algokit-utils](../README.md) / [testing](../modules/testing.md) / AlgorandFixtureConfig

# Interface: AlgorandFixtureConfig

[testing](../modules/testing.md).AlgorandFixtureConfig

Configuration for creating an Algorand testing fixture.

## Hierarchy

- `Partial`\<`AlgoConfig`\>

  ↳ **`AlgorandFixtureConfig`**

## Table of contents

### Properties

- [accountGetter](testing.AlgorandFixtureConfig.md#accountgetter)
- [algod](testing.AlgorandFixtureConfig.md#algod)
- [algodConfig](testing.AlgorandFixtureConfig.md#algodconfig)
- [indexer](testing.AlgorandFixtureConfig.md#indexer)
- [indexerConfig](testing.AlgorandFixtureConfig.md#indexerconfig)
- [kmd](testing.AlgorandFixtureConfig.md#kmd)
- [kmdConfig](testing.AlgorandFixtureConfig.md#kmdconfig)
- [testAccountFunding](testing.AlgorandFixtureConfig.md#testaccountfunding)

## Properties

### accountGetter

• `Optional` **accountGetter**: (`algorand`: [`AlgorandClient`](../classes/index.AlgorandClient.md)) => `Promise`\<[`Address`](../classes/index.Address.md) & \{ `addr`: `Readonly`\<[`Address`](../classes/index.Address.md)\> ; `lsigSigner`: `DelegatedLsigSigner` ; `mxBytesSigner`: `MxBytesSigner` ; `programDataSigner`: `ProgramDataSigner` ; `signer`: `TransactionSigner`  }\>

Optional override for how to get an account; this allows you to retrieve accounts from a known or cached list of accounts.

#### Type declaration

▸ (`algorand`): `Promise`\<[`Address`](../classes/index.Address.md) & \{ `addr`: `Readonly`\<[`Address`](../classes/index.Address.md)\> ; `lsigSigner`: `DelegatedLsigSigner` ; `mxBytesSigner`: `MxBytesSigner` ; `programDataSigner`: `ProgramDataSigner` ; `signer`: `TransactionSigner`  }\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `algorand` | [`AlgorandClient`](../classes/index.AlgorandClient.md) |

##### Returns

`Promise`\<[`Address`](../classes/index.Address.md) & \{ `addr`: `Readonly`\<[`Address`](../classes/index.Address.md)\> ; `lsigSigner`: `DelegatedLsigSigner` ; `mxBytesSigner`: `MxBytesSigner` ; `programDataSigner`: `ProgramDataSigner` ; `signer`: `TransactionSigner`  }\>

#### Defined in

[src/testing/types.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L65)

___

### algod

• `Optional` **algod**: `AlgodClient`

An optional algod client, if not specified then it will create one against `algodConfig` (if present) then environment variables defined network (if present) or default LocalNet.

#### Defined in

[src/testing/types.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L57)

___

### algodConfig

• `Optional` **algodConfig**: `AlgoClientConfig`

Algod client configuration

#### Inherited from

Partial.algodConfig

#### Defined in

[src/network-client.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L14)

___

### indexer

• `Optional` **indexer**: `IndexerClient`

An optional indexer client, if not specified then it will create one against `indexerConfig` (if present) then environment variables defined network (if present) or default LocalNet.

#### Defined in

[src/testing/types.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L59)

___

### indexerConfig

• `Optional` **indexerConfig**: `AlgoClientConfig`

Indexer client configuration

#### Inherited from

Partial.indexerConfig

#### Defined in

[src/network-client.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L16)

___

### kmd

• `Optional` **kmd**: `KmdClient`

An optional kmd client, if not specified then it will create one against `kmdConfig` (if present) then environment variables defined network (if present) or default LocalNet.

#### Defined in

[src/testing/types.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L61)

___

### kmdConfig

• `Optional` **kmdConfig**: `AlgoClientConfig`

Kmd configuration

#### Inherited from

Partial.kmdConfig

#### Defined in

[src/network-client.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/network-client.ts#L18)

___

### testAccountFunding

• `Optional` **testAccountFunding**: [`AlgoAmount`](../classes/index.AlgoAmount.md)

The amount of funds to allocate to the default testing account, if not specified then it will get 10 ALGO.

#### Defined in

[src/testing/types.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L63)
