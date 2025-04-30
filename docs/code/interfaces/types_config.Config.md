[@algorandfoundation/algokit-utils](../README.md) / [types/config](../modules/types_config.md) / Config

# Interface: Config

[types/config](../modules/types_config.md).Config

The AlgoKit configuration type

## Table of contents

### Properties

- [debug](types_config.Config.md#debug)
- [events](types_config.Config.md#events)
- [logger](types_config.Config.md#logger)
- [maxSearchDepth](types_config.Config.md#maxsearchdepth)
- [populateAppCallResources](types_config.Config.md#populateappcallresources)
- [projectRoot](types_config.Config.md#projectroot)
- [traceAll](types_config.Config.md#traceall)
- [traceBufferSizeMb](types_config.Config.md#tracebuffersizemb)

## Properties

### debug

• **debug**: `boolean`

Whether or not debug mode is enabled

#### Defined in

[src/types/config.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L9)

___

### events

• **events**: [`AsyncEventEmitter`](../classes/types_async_event_emitter.AsyncEventEmitter.md)

#### Defined in

[src/types/config.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L24)

___

### logger

• **logger**: [`Logger`](../modules/types_logging.md#logger)

Logger

#### Defined in

[src/types/config.ts:7](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L7)

___

### maxSearchDepth

• **maxSearchDepth**: `number`

The maximum depth to search for a specific file

#### Defined in

[src/types/config.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L17)

___

### populateAppCallResources

• **populateAppCallResources**: `boolean`

Whether to enable populateAppCallResources in sendParams by default.
Default value is false.

#### Defined in

[src/types/config.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L22)

___

### projectRoot

• **projectRoot**: ``null`` \| `string`

The path to the project root directory

#### Defined in

[src/types/config.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L11)

___

### traceAll

• **traceAll**: `boolean`

Indicates whether to trace all operations

#### Defined in

[src/types/config.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L13)

___

### traceBufferSizeMb

• **traceBufferSizeMb**: `number`

The size of the trace buffer in megabytes

#### Defined in

[src/types/config.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L15)
