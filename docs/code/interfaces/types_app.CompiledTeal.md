[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / CompiledTeal

# Interface: CompiledTeal

[types/app](../modules/types_app.md).CompiledTeal

Information about a compiled teal program

## Table of contents

### Properties

- [compiled](types_app.CompiledTeal.md#compiled)
- [compiledBase64ToBytes](types_app.CompiledTeal.md#compiledbase64tobytes)
- [compiledHash](types_app.CompiledTeal.md#compiledhash)
- [sourceMap](types_app.CompiledTeal.md#sourcemap)
- [teal](types_app.CompiledTeal.md#teal)

## Properties

### compiled

• **compiled**: `string`

The compiled code

#### Defined in

[src/types/app.ts:170](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L170)

___

### compiledBase64ToBytes

• **compiledBase64ToBytes**: `Uint8Array`

The base64 encoded code as a byte array

#### Defined in

[src/types/app.ts:174](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L174)

___

### compiledHash

• **compiledHash**: `string`

The has returned by the compiler

#### Defined in

[src/types/app.ts:172](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L172)

___

### sourceMap

• **sourceMap**: `SourceMap`

Source map from the compilation

#### Defined in

[src/types/app.ts:176](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L176)

___

### teal

• **teal**: `string`

Original TEAL code

#### Defined in

[src/types/app.ts:168](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L168)
