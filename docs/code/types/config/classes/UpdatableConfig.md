[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/config](../README.md) / UpdatableConfig

# Class: UpdatableConfig

Defined in: [src/types/config.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L28)

Updatable AlgoKit config

## Implements

- `Readonly`\<[`Config`](../interfaces/Config.md)\>

## Constructors

### Constructor

> **new UpdatableConfig**(): `UpdatableConfig`

Defined in: [src/types/config.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L90)

#### Returns

`UpdatableConfig`

## Accessors

### debug

#### Get Signature

> **get** **debug**(): `boolean`

Defined in: [src/types/config.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L39)

Whether or not debug mode is enabled

##### Returns

`boolean`

#### Implementation of

`Readonly.debug`

***

### events

#### Get Signature

> **get** **events**(): [`AsyncEventEmitter`](../../async-event-emitter/classes/AsyncEventEmitter.md)

Defined in: [src/types/config.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L59)

##### Returns

[`AsyncEventEmitter`](../../async-event-emitter/classes/AsyncEventEmitter.md)

#### Implementation of

`Readonly.events`

***

### logger

#### Get Signature

> **get** **logger**(): [`Logger`](../../logging/type-aliases/Logger.md)

Defined in: [src/types/config.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L35)

Logger

##### Returns

[`Logger`](../../logging/type-aliases/Logger.md)

#### Implementation of

`Readonly.logger`

***

### maxSearchDepth

#### Get Signature

> **get** **maxSearchDepth**(): `number`

Defined in: [src/types/config.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L55)

The maximum depth to search for a specific file

##### Returns

`number`

#### Implementation of

`Readonly.maxSearchDepth`

***

### populateAppCallResources

#### Get Signature

> **get** **populateAppCallResources**(): `boolean`

Defined in: [src/types/config.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L31)

Whether to enable populateAppCallResources in sendParams by default.
Default value is false.

##### Returns

`boolean`

#### Implementation of

`Readonly.populateAppCallResources`

***

### projectRoot

#### Get Signature

> **get** **projectRoot**(): `null` \| `string`

Defined in: [src/types/config.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L43)

The path to the project root directory

##### Returns

`null` \| `string`

#### Implementation of

`Readonly.projectRoot`

***

### traceAll

#### Get Signature

> **get** **traceAll**(): `boolean`

Defined in: [src/types/config.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L47)

Indicates whether to trace all operations

##### Returns

`boolean`

#### Implementation of

`Readonly.traceAll`

***

### traceBufferSizeMb

#### Get Signature

> **get** **traceBufferSizeMb**(): `number`

Defined in: [src/types/config.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L51)

The size of the trace buffer in megabytes

##### Returns

`number`

#### Implementation of

`Readonly.traceBufferSizeMb`

## Methods

### configure()

> **configure**(`newConfig`): `void`

Defined in: [src/types/config.ts:107](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L107)

Update the AlgoKit configuration with your own configuration settings

#### Parameters

##### newConfig

`Partial`\<[`Config`](../interfaces/Config.md)\>

Partial or complete config to replace

#### Returns

`void`

***

### getLogger()

> **getLogger**(`returnNullLogger?`): [`Logger`](../../logging/type-aliases/Logger.md)

Defined in: [src/types/config.ts:68](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L68)

Returns the current logger, or the null logger if true is passed in to `returnNullLogger`

#### Parameters

##### returnNullLogger?

`boolean`

Whether or not to return the null logger

#### Returns

[`Logger`](../../logging/type-aliases/Logger.md)

The requested logger

***

### withDebug()

> **withDebug**(`lambda`): `void`

Defined in: [src/types/config.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L80)

Temporarily run with debug set to true.

#### Parameters

##### lambda

() => `unknown`

A lambda expression with code to run with debug config set to true

#### Returns

`void`
