[@algorandfoundation/algokit-utils](../README.md) / [types/debugging](../modules/types_debugging.md) / PersistSourceMapInput

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

| Name | Type |
| :------ | :------ |
| `appName` | `string` |
| `fileName` | `string` |
| `rawTeal?` | `string` |
| `compiledTeal?` | [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) |

#### Returns

[`PersistSourceMapInput`](types_debugging.PersistSourceMapInput.md)

#### Defined in

[src/types/debugging.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L83)

## Properties

### \_fileName

• `Private` **\_fileName**: `string`

#### Defined in

[src/types/debugging.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L80)

___

### \_rawTeal

• `Private` `Optional` **\_rawTeal**: `string`

#### Defined in

[src/types/debugging.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L81)

___

### appName

• **appName**: `string`

#### Defined in

[src/types/debugging.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L78)

___

### compiledTeal

• `Optional` **compiledTeal**: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)

#### Defined in

[src/types/debugging.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L79)

## Accessors

### fileName

• `get` **fileName**(): `string`

Get the file name

#### Returns

`string`

#### Defined in

[src/types/debugging.ts:124](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L124)

___

### rawTeal

• `get` **rawTeal**(): `string`

Get the underlying raw teal

#### Returns

`string`

#### Defined in

[src/types/debugging.ts:113](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L113)

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

[src/types/debugging.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L134)

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

[src/types/debugging.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L108)

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

[src/types/debugging.ts:97](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debugging.ts#L97)
