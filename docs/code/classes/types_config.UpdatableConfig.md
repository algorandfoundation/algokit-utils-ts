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
- [debugHandlers](types_config.UpdatableConfig.md#debughandlers)

### Accessors

- [debug](types_config.UpdatableConfig.md#debug)
- [logger](types_config.UpdatableConfig.md#logger)
- [maxSearchDepth](types_config.UpdatableConfig.md#maxsearchdepth)
- [populateAppCallResources](types_config.UpdatableConfig.md#populateappcallresources)
- [projectRoot](types_config.UpdatableConfig.md#projectroot)
- [traceAll](types_config.UpdatableConfig.md#traceall)
- [traceBufferSizeMb](types_config.UpdatableConfig.md#tracebuffersizemb)

### Methods

- [configure](types_config.UpdatableConfig.md#configure)
- [configureProjectRoot](types_config.UpdatableConfig.md#configureprojectroot)
- [getLogger](types_config.UpdatableConfig.md#getlogger)
- [invokeDebugHandlers](types_config.UpdatableConfig.md#invokedebughandlers)
- [registerDebugHandler](types_config.UpdatableConfig.md#registerdebughandler)
- [withDebug](types_config.UpdatableConfig.md#withdebug)

## Constructors

### constructor

• **new UpdatableConfig**(): [`UpdatableConfig`](types_config.UpdatableConfig.md)

#### Returns

[`UpdatableConfig`](types_config.UpdatableConfig.md)

#### Defined in

[src/types/config.ts:112](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L112)

## Properties

### config

• `Private` **config**: [`Config`](../interfaces/types_config.Config.md)

#### Defined in

[src/types/config.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L32)

___

### debugHandlers

• `Private` **debugHandlers**: [`DebugHandler`](../modules/types_debugging.md#debughandler)[] = `[]`

#### Defined in

[src/types/config.ts:33](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L33)

## Accessors

### debug

• `get` **debug**(): `boolean`

#### Returns

`boolean`

#### Implementation of

Readonly.debug

#### Defined in

[src/types/config.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L43)

___

### logger

• `get` **logger**(): [`Logger`](../modules/types_logging.md#logger)

#### Returns

[`Logger`](../modules/types_logging.md#logger)

#### Implementation of

Readonly.logger

#### Defined in

[src/types/config.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L39)

___

### maxSearchDepth

• `get` **maxSearchDepth**(): `number`

#### Returns

`number`

#### Implementation of

Readonly.maxSearchDepth

#### Defined in

[src/types/config.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L59)

___

### populateAppCallResources

• `get` **populateAppCallResources**(): `boolean`

#### Returns

`boolean`

#### Implementation of

Readonly.populateAppCallResources

#### Defined in

[src/types/config.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L35)

___

### projectRoot

• `get` **projectRoot**(): ``null`` \| `string`

#### Returns

``null`` \| `string`

#### Implementation of

Readonly.projectRoot

#### Defined in

[src/types/config.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L47)

___

### traceAll

• `get` **traceAll**(): `boolean`

#### Returns

`boolean`

#### Implementation of

Readonly.traceAll

#### Defined in

[src/types/config.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L51)

___

### traceBufferSizeMb

• `get` **traceBufferSizeMb**(): `number`

#### Returns

`number`

#### Implementation of

Readonly.traceBufferSizeMb

#### Defined in

[src/types/config.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L55)

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

[src/types/config.ts:159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L159)

___

### configureProjectRoot

▸ **configureProjectRoot**(): `Promise`\<`void`\>

Configures the project root by searching for a specific file within a depth limit.
This is only supported in a Node environment.

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/types/config.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L132)

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

[src/types/config.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L90)

___

### invokeDebugHandlers

▸ **invokeDebugHandlers**(`params`): `Promise`\<`void`\>

Invoke all registered debug handlers with the given parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`DebugParams`](../interfaces/types_debugging.DebugParams.md) | Debug parameters containing a message and optional data. |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/types/config.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L75)

___

### registerDebugHandler

▸ **registerDebugHandler**(`handler`): `void`

Register a debug handler function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `handler` | [`DebugHandler`](../modules/types_debugging.md#debughandler) | A function that handles debug events. |

#### Returns

`void`

#### Defined in

[src/types/config.ts:67](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L67)

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

[src/types/config.ts:102](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L102)
