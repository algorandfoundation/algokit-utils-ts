[@algorandfoundation/algokit-utils](../README.md) / [types/config](../modules/types_config.md) / Config

# Interface: Config

[types/config](../modules/types_config.md).Config

The AlgoKit configuration type

## Table of contents

### Properties

- [debug](types_config.Config.md#debug)
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

[src/types/config.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L10)

___

### logger

• **logger**: [`Logger`](../modules/types_logging.md#logger)

Logger

#### Defined in

[src/types/config.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L8)

___

### maxSearchDepth

• **maxSearchDepth**: `number`

The maximum depth to search for a specific file

#### Defined in

[src/types/config.ts:18](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L18)

___

### populateAppCallResources

• **populateAppCallResources**: `boolean`

**WARNING**: This is not production-ready due incompatability with rekeyed
accounts and simulate. This will eventually be enabled by default once
[this issue](https://github.com/algorand/go-algorand/issues/5914) is closed.

Whether to enable populateAppCallResources in sendParams by default.
Default value is false.

#### Defined in

[src/types/config.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L27)

___

### projectRoot

• **projectRoot**: ``null`` \| `string`

The path to the project root directory

#### Defined in

[src/types/config.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L12)

___

### traceAll

• **traceAll**: `boolean`

Indicates whether to trace all operations

#### Defined in

[src/types/config.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L14)

___

### traceBufferSizeMb

• **traceBufferSizeMb**: `number`

The size of the trace buffer in megabytes

#### Defined in

[src/types/config.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/config.ts#L16)
