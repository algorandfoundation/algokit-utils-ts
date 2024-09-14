[@algorandfoundation/algokit-utils-debug](../README.md) / [types/debugging](../modules/types_debugging.md) / PersistSourceMapsParams

# Interface: PersistSourceMapsParams

[types/debugging](../modules/types_debugging.md).PersistSourceMapsParams

Parameters to a call that persists source maps

## Table of contents

### Properties

- [client](types_debugging.PersistSourceMapsParams.md#client)
- [projectRoot](types_debugging.PersistSourceMapsParams.md#projectroot)
- [sources](types_debugging.PersistSourceMapsParams.md#sources)
- [withSources](types_debugging.PersistSourceMapsParams.md#withsources)

## Properties

### client

• **client**: `default`

An Algodv2 client to perform the compilation.

#### Defined in

[types/debugging.ts:161](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L161)

---

### projectRoot

• **projectRoot**: `string`

The root directory of the project.

#### Defined in

[types/debugging.ts:159](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L159)

---

### sources

• **sources**: \{ `appName`: `string` ; `compiledTeal`: [`CompiledTeal`](types_debugging.CompiledTeal.md) ; `fileName`: `string` }[]

An array of PersistSourceMapInput objects. Each object can either contain rawTeal, in which case the function will execute a compile to obtain byte code, or it can accept an object of type CompiledTeal provided by algokit, which is used for source codes that have already been compiled and contain the traces.

#### Defined in

[types/debugging.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L157)

---

### withSources

• `Optional` **withSources**: `boolean`

A boolean indicating whether to include the source files in the output.

#### Defined in

[types/debugging.ts:163](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L163)
