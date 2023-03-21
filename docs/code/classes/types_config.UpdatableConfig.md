[@algorandfoundation/algokit-utils](../README.md) / [types/config](../modules/types_config.md) / UpdatableConfig

# Class: UpdatableConfig

[types/config](../modules/types_config.md).UpdatableConfig

Updatable AlgoKit config

## Implements

- `Readonly`<[`Config`](../interfaces/types_config.Config.md)\>

## Table of contents

### Constructors

- [constructor](types_config.UpdatableConfig.md#constructor)

### Properties

- [config](types_config.UpdatableConfig.md#config)

### Accessors

- [logger](types_config.UpdatableConfig.md#logger)

### Methods

- [configure](types_config.UpdatableConfig.md#configure)
- [getLogger](types_config.UpdatableConfig.md#getlogger)

## Constructors

### constructor

• **new UpdatableConfig**()

#### Defined in

types/config.ts:24

## Properties

### config

• `Private` **config**: [`Config`](../interfaces/types_config.Config.md)

#### Defined in

types/config.ts:10

## Accessors

### logger

• `get` **logger**(): [`Logger`](../modules/types_logging.md#logger)

#### Returns

[`Logger`](../modules/types_logging.md#logger)

#### Implementation of

Readonly.logger

#### Defined in

types/config.ts:12

## Methods

### configure

▸ **configure**(`newConfig`): `void`

Update the AlgoKit configuration with your own configuration settings

#### Parameters

| Name | Type |
| :------ | :------ |
| `newConfig` | [`Config`](../interfaces/types_config.Config.md) |

#### Returns

`void`

#### Defined in

types/config.ts:31

___

### getLogger

▸ **getLogger**(`returnNullLogger?`): [`Logger`](../modules/types_logging.md#logger)

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnNullLogger?` | `boolean` |

#### Returns

[`Logger`](../modules/types_logging.md#logger)

#### Defined in

types/config.ts:16
