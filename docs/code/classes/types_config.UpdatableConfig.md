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
- [disableLedgerUnsupportedErrors](types_config.UpdatableConfig.md#disableledgerunsupportederrors)
- [events](types_config.UpdatableConfig.md#events)
- [logger](types_config.UpdatableConfig.md#logger)
- [maxSearchDepth](types_config.UpdatableConfig.md#maxsearchdepth)
- [populateAppCallResources](types_config.UpdatableConfig.md#populateappcallresources)
- [projectRoot](types_config.UpdatableConfig.md#projectroot)
- [traceAll](types_config.UpdatableConfig.md#traceall)
- [traceBufferSizeMb](types_config.UpdatableConfig.md#tracebuffersizemb)

### Methods

- [configure](types_config.UpdatableConfig.md#configure)
- [getLogger](types_config.UpdatableConfig.md#getlogger)
- [withDebug](types_config.UpdatableConfig.md#withdebug)

## Constructors

### constructor

• **new UpdatableConfig**(): [`UpdatableConfig`](types_config.UpdatableConfig.md)

#### Returns

[`UpdatableConfig`](types_config.UpdatableConfig.md)

#### Defined in

[src/types/config.ts:101](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L101)

## Properties

### config

• `Private` **config**: [`Config`](../interfaces/types_config.Config.md)

#### Defined in

[src/types/config.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L36)

## Accessors

### debug

• `get` **debug**(): `boolean`

#### Returns

`boolean`

#### Implementation of

Readonly.debug

#### Defined in

[src/types/config.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L46)

___

### disableLedgerUnsupportedErrors

• `get` **disableLedgerUnsupportedErrors**(): `boolean`

#### Returns

`boolean`

#### Implementation of

Readonly.disableLedgerUnsupportedErrors

#### Defined in

[src/types/config.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L70)

___

### events

• `get` **events**(): [`AsyncEventEmitter`](types_async_event_emitter.AsyncEventEmitter.md)

#### Returns

[`AsyncEventEmitter`](types_async_event_emitter.AsyncEventEmitter.md)

#### Implementation of

Readonly.events

#### Defined in

[src/types/config.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L66)

___

### logger

• `get` **logger**(): [`Logger`](../modules/types_logging.md#logger)

#### Returns

[`Logger`](../modules/types_logging.md#logger)

#### Implementation of

Readonly.logger

#### Defined in

[src/types/config.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L42)

___

### maxSearchDepth

• `get` **maxSearchDepth**(): `number`

#### Returns

`number`

#### Implementation of

Readonly.maxSearchDepth

#### Defined in

[src/types/config.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L62)

___

### populateAppCallResources

• `get` **populateAppCallResources**(): `boolean`

#### Returns

`boolean`

#### Implementation of

Readonly.populateAppCallResources

#### Defined in

[src/types/config.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L38)

___

### projectRoot

• `get` **projectRoot**(): ``null`` \| `string`

#### Returns

``null`` \| `string`

#### Implementation of

Readonly.projectRoot

#### Defined in

[src/types/config.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L50)

___

### traceAll

• `get` **traceAll**(): `boolean`

#### Returns

`boolean`

#### Implementation of

Readonly.traceAll

#### Defined in

[src/types/config.ts:54](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L54)

___

### traceBufferSizeMb

• `get` **traceBufferSizeMb**(): `number`

#### Returns

`number`

#### Implementation of

Readonly.traceBufferSizeMb

#### Defined in

[src/types/config.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L58)

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

[src/types/config.ts:119](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L119)

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

[src/types/config.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L79)

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

[src/types/config.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L91)
