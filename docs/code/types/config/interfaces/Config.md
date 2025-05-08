[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/config](../README.md) / Config

# Interface: Config

Defined in: [src/types/config.ts:5](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L5)

The AlgoKit configuration type

## Properties

### debug

> **debug**: `boolean`

Defined in: [src/types/config.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L9)

Whether or not debug mode is enabled

***

### events

> **events**: [`AsyncEventEmitter`](../../async-event-emitter/classes/AsyncEventEmitter.md)

Defined in: [src/types/config.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L24)

***

### logger

> **logger**: [`Logger`](../../logging/type-aliases/Logger.md)

Defined in: [src/types/config.ts:7](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L7)

Logger

***

### maxSearchDepth

> **maxSearchDepth**: `number`

Defined in: [src/types/config.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L17)

The maximum depth to search for a specific file

***

### populateAppCallResources

> **populateAppCallResources**: `boolean`

Defined in: [src/types/config.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L22)

Whether to enable populateAppCallResources in sendParams by default.
Default value is false.

***

### projectRoot

> **projectRoot**: `null` \| `string`

Defined in: [src/types/config.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L11)

The path to the project root directory

***

### traceAll

> **traceAll**: `boolean`

Defined in: [src/types/config.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L13)

Indicates whether to trace all operations

***

### traceBufferSizeMb

> **traceBufferSizeMb**: `number`

Defined in: [src/types/config.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L15)

The size of the trace buffer in megabytes
