[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/app](../README.md) / CompiledTeal

# Interface: CompiledTeal

Defined in: [src/types/app.ts:127](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L127)

Information about a compiled teal program

## Properties

### compiled

> **compiled**: `string`

Defined in: [src/types/app.ts:131](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L131)

The compiled code

***

### compiledBase64ToBytes

> **compiledBase64ToBytes**: `Uint8Array`

Defined in: [src/types/app.ts:135](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L135)

The base64 encoded code as a byte array

***

### compiledHash

> **compiledHash**: `string`

Defined in: [src/types/app.ts:133](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L133)

The hash returned by the compiler

***

### sourceMap

> **sourceMap**: `ProgramSourceMap`

Defined in: [src/types/app.ts:137](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L137)

Source map from the compilation

***

### teal

> **teal**: `string`

Defined in: [src/types/app.ts:129](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L129)

Original TEAL code
