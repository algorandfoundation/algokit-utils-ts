[@algorandfoundation/algokit-utils-debug](../README.md) / [types/debugging](../modules/types_debugging.md) / PersistSourceMapInput

# Class: PersistSourceMapInput

[types/debugging](../modules/types_debugging.md).PersistSourceMapInput

Class representing a debugger source maps input for persistence.

Note: rawTeal and compiledTeal are mutually exclusive. Only one of them should be provided.

## Table of contents

### Constructors

- [constructor](types_debugging.PersistSourceMapInput.md#constructor)

### Properties

- [\_fileName](types_debugging.PersistSourceMapInput.md#_filename)
- [\_rawTeal](types_debugging.PersistSourceMapInput.md#_rawteal)
- [appName](types_debugging.PersistSourceMapInput.md#appname)
- [compiledTeal](types_debugging.PersistSourceMapInput.md#compiledteal)

### Accessors

- [fileName](types_debugging.PersistSourceMapInput.md#filename)
- [rawTeal](types_debugging.PersistSourceMapInput.md#rawteal)

### Methods

- [stripTealExtension](types_debugging.PersistSourceMapInput.md#striptealextension)
- [fromCompiledTeal](types_debugging.PersistSourceMapInput.md#fromcompiledteal)
- [fromRawTeal](types_debugging.PersistSourceMapInput.md#fromrawteal)

## Constructors

### constructor

• **new PersistSourceMapInput**(`appName`, `fileName`, `rawTeal?`, `compiledTeal?`): [`PersistSourceMapInput`](types_debugging.PersistSourceMapInput.md)

#### Parameters

| Name            | Type                                                            |
| :-------------- | :-------------------------------------------------------------- |
| `appName`       | `string`                                                        |
| `fileName`      | `string`                                                        |
| `rawTeal?`      | `string`                                                        |
| `compiledTeal?` | [`CompiledTeal`](../interfaces/types_debugging.CompiledTeal.md) |

#### Returns

[`PersistSourceMapInput`](types_debugging.PersistSourceMapInput.md)

#### Defined in

[types/debugging.ts:95](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L95)

## Properties

### \_fileName

• `Private` **\_fileName**: `string`

#### Defined in

[types/debugging.ts:92](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L92)

---

### \_rawTeal

• `Private` `Optional` **\_rawTeal**: `string`

#### Defined in

[types/debugging.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L93)

---

### appName

• **appName**: `string`

#### Defined in

[types/debugging.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L90)

---

### compiledTeal

• `Optional` **compiledTeal**: [`CompiledTeal`](../interfaces/types_debugging.CompiledTeal.md)

#### Defined in

[types/debugging.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L91)

## Accessors

### fileName

• `get` **fileName**(): `string`

Get the file name

#### Returns

`string`

#### Defined in

[types/debugging.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L136)

---

### rawTeal

• `get` **rawTeal**(): `string`

Get the underlying raw teal

#### Returns

`string`

#### Defined in

[types/debugging.ts:125](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L125)

## Methods

### stripTealExtension

▸ **stripTealExtension**(`fileName`): `string`

Strips the '.teal' extension from a filename, if present.

#### Parameters

| Name       | Type     | Description                               |
| :--------- | :------- | :---------------------------------------- |
| `fileName` | `string` | The filename to strip the extension from. |

#### Returns

`string`

The filename without the '.teal' extension.

#### Defined in

[types/debugging.ts:146](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L146)

---

### fromCompiledTeal

▸ **fromCompiledTeal**(`compiledTeal`, `appName`, `fileName`): [`PersistSourceMapInput`](types_debugging.PersistSourceMapInput.md)

Returns debugger source maps input from compiled TEAL code.

#### Parameters

| Name           | Type                                                            | Description                        |
| :------------- | :-------------------------------------------------------------- | :--------------------------------- |
| `compiledTeal` | [`CompiledTeal`](../interfaces/types_debugging.CompiledTeal.md) | The compiled TEAL code             |
| `appName`      | `string`                                                        | The name of the app                |
| `fileName`     | `string`                                                        | The name of the file to persist to |

#### Returns

[`PersistSourceMapInput`](types_debugging.PersistSourceMapInput.md)

The persist source map input

#### Defined in

[types/debugging.ts:120](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L120)

---

### fromRawTeal

▸ **fromRawTeal**(`rawTeal`, `appName`, `fileName`): [`PersistSourceMapInput`](types_debugging.PersistSourceMapInput.md)

Returns debugger source maps input from raw TEAL code.

#### Parameters

| Name       | Type     | Description                        |
| :--------- | :------- | :--------------------------------- |
| `rawTeal`  | `string` | The raw TEAL code                  |
| `appName`  | `string` | The name of the app                |
| `fileName` | `string` | The name of the file to persist to |

#### Returns

[`PersistSourceMapInput`](types_debugging.PersistSourceMapInput.md)

The persist source map input

#### Defined in

[types/debugging.ts:109](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/debug-utils/src/types/debugging.ts#L109)
