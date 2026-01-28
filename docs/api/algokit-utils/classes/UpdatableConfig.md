[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / UpdatableConfig

# Class: UpdatableConfig

Defined in: [src/updatable-config.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/updatable-config.ts#L28)

Updatable AlgoKit config

## Implements

- `Readonly`\<[`AlgoKitConfig`](../interfaces/AlgoKitConfig.md)\>

## Constructors

### Constructor

> **new UpdatableConfig**(): `UpdatableConfig`

Defined in: [src/updatable-config.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/updatable-config.ts#L90)

#### Returns

`UpdatableConfig`

## Accessors

### debug

#### Get Signature

> **get** **debug**(): `boolean`

Defined in: [src/updatable-config.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/updatable-config.ts#L39)

Whether or not debug mode is enabled

##### Returns

`boolean`

#### Implementation of

[`AlgoKitConfig`](../interfaces/AlgoKitConfig.md).[`debug`](../interfaces/AlgoKitConfig.md#debug)

***

### events

#### Get Signature

> **get** **events**(): [`AsyncEventEmitter`](AsyncEventEmitter.md)

Defined in: [src/updatable-config.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/updatable-config.ts#L59)

##### Returns

[`AsyncEventEmitter`](AsyncEventEmitter.md)

#### Implementation of

[`AlgoKitConfig`](../interfaces/AlgoKitConfig.md).[`events`](../interfaces/AlgoKitConfig.md#events)

***

### logger

#### Get Signature

> **get** **logger**(): `Logger`

Defined in: [src/updatable-config.ts:35](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/updatable-config.ts#L35)

Logger

##### Returns

`Logger`

#### Implementation of

[`AlgoKitConfig`](../interfaces/AlgoKitConfig.md).[`logger`](../interfaces/AlgoKitConfig.md#logger)

***

### maxSearchDepth

#### Get Signature

> **get** **maxSearchDepth**(): `number`

Defined in: [src/updatable-config.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/updatable-config.ts#L55)

The maximum depth to search for a specific file

##### Returns

`number`

#### Implementation of

[`AlgoKitConfig`](../interfaces/AlgoKitConfig.md).[`maxSearchDepth`](../interfaces/AlgoKitConfig.md#maxsearchdepth)

***

### populateAppCallResources

#### Get Signature

> **get** **populateAppCallResources**(): `boolean`

Defined in: [src/updatable-config.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/updatable-config.ts#L31)

Whether to enable populateAppCallResources in sendParams by default.
Default value is false.

##### Returns

`boolean`

#### Implementation of

[`AlgoKitConfig`](../interfaces/AlgoKitConfig.md).[`populateAppCallResources`](../interfaces/AlgoKitConfig.md#populateappcallresources)

***

### projectRoot

#### Get Signature

> **get** **projectRoot**(): `string` \| `null`

Defined in: [src/updatable-config.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/updatable-config.ts#L43)

The path to the project root directory

##### Returns

`string` \| `null`

#### Implementation of

[`AlgoKitConfig`](../interfaces/AlgoKitConfig.md).[`projectRoot`](../interfaces/AlgoKitConfig.md#projectroot)

***

### traceAll

#### Get Signature

> **get** **traceAll**(): `boolean`

Defined in: [src/updatable-config.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/updatable-config.ts#L47)

Indicates whether to trace all operations

##### Returns

`boolean`

#### Implementation of

[`AlgoKitConfig`](../interfaces/AlgoKitConfig.md).[`traceAll`](../interfaces/AlgoKitConfig.md#traceall)

***

### traceBufferSizeMb

#### Get Signature

> **get** **traceBufferSizeMb**(): `number`

Defined in: [src/updatable-config.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/updatable-config.ts#L51)

The size of the trace buffer in megabytes

##### Returns

`number`

#### Implementation of

[`AlgoKitConfig`](../interfaces/AlgoKitConfig.md).[`traceBufferSizeMb`](../interfaces/AlgoKitConfig.md#tracebuffersizemb)

## Methods

### configure()

> **configure**(`newConfig`): `void`

Defined in: [src/updatable-config.ts:107](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/updatable-config.ts#L107)

Update the AlgoKit configuration with your own configuration settings

#### Parameters

##### newConfig

`Partial`\<[`AlgoKitConfig`](../interfaces/AlgoKitConfig.md)\>

Partial or complete config to replace

#### Returns

`void`

***

### getLogger()

> **getLogger**(`returnNullLogger?`): `Logger`

Defined in: [src/updatable-config.ts:68](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/updatable-config.ts#L68)

Returns the current logger, or the null logger if true is passed in to `returnNullLogger`

#### Parameters

##### returnNullLogger?

`boolean`

Whether or not to return the null logger

#### Returns

`Logger`

The requested logger

***

### withDebug()

> **withDebug**(`lambda`): `void`

Defined in: [src/updatable-config.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/updatable-config.ts#L80)

Temporarily run with debug set to true.

#### Parameters

##### lambda

() => `unknown`

A lambda expression with code to run with debug config set to true

#### Returns

`void`
