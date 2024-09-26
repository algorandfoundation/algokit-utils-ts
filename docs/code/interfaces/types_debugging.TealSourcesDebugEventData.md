[@algorandfoundation/algokit-utils](../README.md) / [types/debugging](../modules/types_debugging.md) / TealSourcesDebugEventData

# Interface: TealSourcesDebugEventData

[types/debugging](../modules/types_debugging.md).TealSourcesDebugEventData

Parameters to a call that persists source maps

## Table of contents

### Properties

- [sources](types_debugging.TealSourcesDebugEventData.md#sources)

## Properties

### sources

• **sources**: [`TealSourceDebugEventData`](types_debugging.TealSourceDebugEventData.md)[]

An array of PersistSourceMapInput objects. Each object can either contain rawTeal, in which case the function will execute a compile to obtain byte code, or it can accept an object of type CompiledTeal provided by algokit, which is used for source codes that have already been compiled and contain the traces.

#### Defined in

[src/types/debugging.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L32)
