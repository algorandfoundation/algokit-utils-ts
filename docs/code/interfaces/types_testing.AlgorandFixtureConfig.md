[@algorandfoundation/algokit-utils](../README.md) / [types/testing](../modules/types_testing.md) / AlgorandFixtureConfig

# Interface: AlgorandFixtureConfig

[types/testing](../modules/types_testing.md).AlgorandFixtureConfig

Configuration for creating an Algorand testing fixture.

## Table of contents

### Properties

- [algod](types_testing.AlgorandFixtureConfig.md#algod)
- [indexer](types_testing.AlgorandFixtureConfig.md#indexer)
- [kmd](types_testing.AlgorandFixtureConfig.md#kmd)
- [testAccountFunding](types_testing.AlgorandFixtureConfig.md#testaccountfunding)

## Properties

### algod

• `Optional` **algod**: `default`

An optional algod client, if not specified then it will create one against default LocalNet.

#### Defined in

types/testing.ts:43

___

### indexer

• `Optional` **indexer**: `default`

An optional indexer client, if not specified then it will create one against default LocalNet.

#### Defined in

types/testing.ts:45

___

### kmd

• `Optional` **kmd**: `default`

An optional kmd client, if not specified then it will create one against default LocalNet.

#### Defined in

types/testing.ts:47

___

### testAccountFunding

• `Optional` **testAccountFunding**: [`AlgoAmount`](../classes/types_amount.AlgoAmount.md)

The amount of funds to allocate to the default testing account, if not specified then it will get 10 ALGOs.

#### Defined in

types/testing.ts:49
