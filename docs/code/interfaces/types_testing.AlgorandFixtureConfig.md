[@algorandfoundation/algokit-utils](../README.md) / [types/testing](../modules/types_testing.md) / AlgorandFixtureConfig

# Interface: AlgorandFixtureConfig

[types/testing](../modules/types_testing.md).AlgorandFixtureConfig

Configuration for creating an Algorand testing fixture.

## Table of contents

### Properties

- [accountGetter](types_testing.AlgorandFixtureConfig.md#accountgetter)
- [algod](types_testing.AlgorandFixtureConfig.md#algod)
- [indexer](types_testing.AlgorandFixtureConfig.md#indexer)
- [kmd](types_testing.AlgorandFixtureConfig.md#kmd)
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

[src/types/testing.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L58)

___

### algod

• `Optional` **algod**: `default`

An optional algod client, if not specified then it will create one against environment variables defined network (if present) or default LocalNet.

#### Defined in

[src/types/testing.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L50)

___

### indexer

• `Optional` **indexer**: `default`

An optional indexer client, if not specified then it will create one against environment variables defined network (if present) or default LocalNet.

#### Defined in

[src/types/testing.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L52)

___

### kmd

• `Optional` **kmd**: `default`

An optional kmd client, if not specified then it will create one against environment variables defined network (if present) or default LocalNet.

#### Defined in

[src/types/testing.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L54)

___

### testAccountFunding

• `Optional` **testAccountFunding**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The amount of funds to allocate to the default testing account, if not specified then it will get 10 ALGOs.

#### Defined in

[src/types/testing.ts:56](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L56)
