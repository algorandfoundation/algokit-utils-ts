[@algorandfoundation/algokit-utils](../README.md) / [types/debugging](../modules/types_debugging.md) / PersistSourceMapsParams

# Interface: PersistSourceMapsParams

[types/debugging](../modules/types_debugging.md).PersistSourceMapsParams

Parameters to a call that persists source maps

## Table of contents

### Properties

- [appManager](types_debugging.PersistSourceMapsParams.md#appmanager)
- [projectRoot](types_debugging.PersistSourceMapsParams.md#projectroot)
- [sources](types_debugging.PersistSourceMapsParams.md#sources)
- [withSources](types_debugging.PersistSourceMapsParams.md#withsources)

## Properties

### appManager

• **appManager**: [`AppManager`](../classes/types_app_manager.AppManager.md)

An `AppManager` to perform the compilation.

#### Defined in

[src/types/debugging.ts:149](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L149)

___

### projectRoot

• **projectRoot**: `string`

The root directory of the project.

#### Defined in

[src/types/debugging.ts:147](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L147)

___

### sources

• **sources**: [`PersistSourceMapInput`](../classes/types_debugging.PersistSourceMapInput.md)[]

An array of PersistSourceMapInput objects. Each object can either contain rawTeal, in which case the function will execute a compile to obtain byte code, or it can accept an object of type CompiledTeal provided by algokit, which is used for source codes that have already been compiled and contain the traces.

#### Defined in

[src/types/debugging.ts:145](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L145)

___

### withSources

• `Optional` **withSources**: `boolean`

A boolean indicating whether to include the source files in the output.

#### Defined in

[src/types/debugging.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L151)
