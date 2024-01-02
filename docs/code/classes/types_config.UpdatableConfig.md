[@algorandfoundation/algokit-utils](../README.md) / [types/config](../modules/types_config.md) / UpdatableConfig

# Class: UpdatableConfig

[types/config](../modules/types_config.md).UpdatableConfig

Updatable AlgoKit config

## Implements

- `Readonly`\<[`Config`](../interfaces/types_config.Config.md)\>

## Table of contents

### Constructors

- [constructor](types_config.UpdatableConfig.md#constructor)

### Properties

- [config](types_config.UpdatableConfig.md#config)

### Accessors

- [debug](types_config.UpdatableConfig.md#debug)
- [logger](types_config.UpdatableConfig.md#logger)
- [maxSearchDepth](types_config.UpdatableConfig.md#maxsearchdepth)
- [projectRoot](types_config.UpdatableConfig.md#projectroot)
- [traceAll](types_config.UpdatableConfig.md#traceall)
- [traceBufferSizeMb](types_config.UpdatableConfig.md#tracebuffersizemb)

### Methods

- [configure](types_config.UpdatableConfig.md#configure)
- [configureProjectRoot](types_config.UpdatableConfig.md#configureprojectroot)
- [getLogger](types_config.UpdatableConfig.md#getlogger)
- [withDebug](types_config.UpdatableConfig.md#withdebug)

## Constructors

### constructor

• **new UpdatableConfig**(): [`UpdatableConfig`](types_config.UpdatableConfig.md)

#### Returns

[`UpdatableConfig`](types_config.UpdatableConfig.md)

#### Defined in

[src/types/config.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L75)

## Properties

### config

• `Private` **config**: [`Config`](../interfaces/types_config.Config.md)

#### Defined in

[src/types/config.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L22)

## Accessors

### debug

• `get` **debug**(): `boolean`

#### Returns

`boolean`

#### Implementation of

Readonly.debug

#### Defined in

[src/types/config.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L28)

___

### logger

• `get` **logger**(): [`Logger`](../modules/types_logging.md#logger)

#### Returns

[`Logger`](../modules/types_logging.md#logger)

#### Implementation of

Readonly.logger

#### Defined in

[src/types/config.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L24)

___

### maxSearchDepth

• `get` **maxSearchDepth**(): `number`

#### Returns

`number`

#### Implementation of

Readonly.maxSearchDepth

#### Defined in

[src/types/config.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L44)

___

### projectRoot

• `get` **projectRoot**(): ``null`` \| `string`

#### Returns

``null`` \| `string`

#### Implementation of

Readonly.projectRoot

#### Defined in

[src/types/config.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L32)

___

### traceAll

• `get` **traceAll**(): `boolean`

#### Returns

`boolean`

#### Implementation of

Readonly.traceAll

#### Defined in

[src/types/config.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L36)

___

### traceBufferSizeMb

• `get` **traceBufferSizeMb**(): `number`

#### Returns

`number`

#### Implementation of

Readonly.traceBufferSizeMb

#### Defined in

[src/types/config.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L40)

## Methods

### configure

▸ **configure**(`newConfig`): `void`

Update the AlgoKit configuration with your own configuration settings

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newConfig` | `Partial`\<[`Config`](../interfaces/types_config.Config.md)\> | Partial or complete config to replace |

#### Returns

`void`

#### Defined in

[src/types/config.ts:131](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L131)

___

### configureProjectRoot

▸ **configureProjectRoot**(): `Promise`\<`void`\>

Configures the project root by searching for a specific file within a depth limit.
This is only supported in a Node environment.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/types/config.ts:94](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L94)

___

### getLogger

▸ **getLogger**(`returnNullLogger?`): [`Logger`](../modules/types_logging.md#logger)

Returns the current logger, or the null logger if true is passed in to `returnNullLogger`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnNullLogger?` | `boolean` | Whether or not to return the null logger |

#### Returns

[`Logger`](../modules/types_logging.md#logger)

The requested logger

#### Defined in

[src/types/config.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L53)

___

### withDebug

▸ **withDebug**(`lambda`): `void`

Temporarily run with debug set to true.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `lambda` | () => `unknown` | A lambda expression with code to run with debug config set to true |

#### Returns

`void`

#### Defined in

[src/types/config.ts:65](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L65)
