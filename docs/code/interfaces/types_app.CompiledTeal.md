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

[src/types/app.ts:132](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L132)

___

### compiledBase64ToBytes

• **compiledBase64ToBytes**: `Uint8Array`

The base64 encoded code as a byte array

#### Defined in

[src/types/app.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L136)

___

### compiledHash

• **compiledHash**: `string`

The hash returned by the compiler

#### Defined in

[src/types/app.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L134)

___

### sourceMap

• **sourceMap**: `ProgramSourceMap`

Source map from the compilation

#### Defined in

[src/types/app.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L138)

___

### teal

• **teal**: `string`

Original TEAL code

#### Defined in

[src/types/app.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L130)
