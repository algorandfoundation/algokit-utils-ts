[@algorandfoundation/algokit-utils](../README.md) / [types/debugging](../modules/types_debugging.md) / PersistSourceMapInput

# Class: PersistSourceMapInput

[types/debugging](../modules/types_debugging.md).PersistSourceMapInput

**`Deprecated`**

Use latest version of `AlgoKit AVM Debugger` VSCode extension instead. It will automatically manage your sourcemaps.

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

| Name | Type |
| :------ | :------ |
| `appName` | `string` |
| `fileName` | `string` |
| `rawTeal?` | `string` |
| `compiledTeal?` | [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) |

#### Returns

[`PersistSourceMapInput`](types_debugging.PersistSourceMapInput.md)

#### Defined in

[src/types/debugging.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L17)

## Properties

### \_fileName

• `Private` **\_fileName**: `string`

#### Defined in

[src/types/debugging.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L14)

___

### \_rawTeal

• `Private` `Optional` **\_rawTeal**: `string`

#### Defined in

[src/types/debugging.ts:15](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L15)

___

### appName

• **appName**: `string`

#### Defined in

[src/types/debugging.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L12)

___

### compiledTeal

• `Optional` **compiledTeal**: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)

#### Defined in

[src/types/debugging.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L13)

## Accessors

### fileName

• `get` **fileName**(): `string`

Get the file name

#### Returns

`string`

#### Defined in

[src/types/debugging.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L58)

___

### rawTeal

• `get` **rawTeal**(): `string`

Get the underlying raw teal

#### Returns

`string`

#### Defined in

[src/types/debugging.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L47)

## Methods

### stripTealExtension

▸ **stripTealExtension**(`fileName`): `string`

Strips the '.teal' extension from a filename, if present.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fileName` | `string` | The filename to strip the extension from. |

#### Returns

`string`

The filename without the '.teal' extension.

#### Defined in

[src/types/debugging.ts:68](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L68)

___

### fromCompiledTeal

▸ **fromCompiledTeal**(`compiledTeal`, `appName`, `fileName`): [`PersistSourceMapInput`](types_debugging.PersistSourceMapInput.md)

Returns debugger source maps input from compiled TEAL code.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compiledTeal` | [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) | The compiled TEAL code |
| `appName` | `string` | The name of the app |
| `fileName` | `string` | The name of the file to persist to |

#### Returns

[`PersistSourceMapInput`](types_debugging.PersistSourceMapInput.md)

The persist source map input

#### Defined in

[src/types/debugging.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L42)

___

### fromRawTeal

▸ **fromRawTeal**(`rawTeal`, `appName`, `fileName`): [`PersistSourceMapInput`](types_debugging.PersistSourceMapInput.md)

Returns debugger source maps input from raw TEAL code.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rawTeal` | `string` | The raw TEAL code |
| `appName` | `string` | The name of the app |
| `fileName` | `string` | The name of the file to persist to |

#### Returns

[`PersistSourceMapInput`](types_debugging.PersistSourceMapInput.md)

The persist source map input

#### Defined in

[src/types/debugging.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L31)
