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

[src/types/app.ts:199](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L199)

___

### compiledBase64ToBytes

• **compiledBase64ToBytes**: `Uint8Array`

The base64 encoded code as a byte array

#### Defined in

[src/types/app.ts:203](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L203)

___

### compiledHash

• **compiledHash**: `string`

The has returned by the compiler

#### Defined in

[src/types/app.ts:201](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L201)

___

### sourceMap

• **sourceMap**: `SourceMap`

Source map from the compilation

#### Defined in

[src/types/app.ts:205](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L205)

___

### teal

• **teal**: `string`

Original TEAL code

#### Defined in

[src/types/app.ts:197](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L197)
