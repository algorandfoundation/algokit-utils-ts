[@algorandfoundation/algokit-utils](../README.md) / [types/debug-utils](../modules/types_debug_utils.md) / PersistSourceMapInput

# Class: PersistSourceMapInput

[types/debug-utils](../modules/types_debug_utils.md).PersistSourceMapInput

Class representing a debugger source maps input for persistence.

Note: rawTeal and compiledTeal are mutually exclusive. Only one of them should be provided.

## Table of contents

### Constructors

- [constructor](types_debug_utils.PersistSourceMapInput.md#constructor)

### Properties

- [\_fileName](types_debug_utils.PersistSourceMapInput.md#_filename)
- [\_rawTeal](types_debug_utils.PersistSourceMapInput.md#_rawteal)
- [appName](types_debug_utils.PersistSourceMapInput.md#appname)
- [compiledTeal](types_debug_utils.PersistSourceMapInput.md#compiledteal)

### Accessors

- [fileName](types_debug_utils.PersistSourceMapInput.md#filename)
- [rawTeal](types_debug_utils.PersistSourceMapInput.md#rawteal)

### Methods

- [stripTealExtension](types_debug_utils.PersistSourceMapInput.md#striptealextension)
- [fromCompiledTeal](types_debug_utils.PersistSourceMapInput.md#fromcompiledteal)
- [fromRawTeal](types_debug_utils.PersistSourceMapInput.md#fromrawteal)

## Constructors

### constructor

• **new PersistSourceMapInput**(`appName`, `fileName`, `rawTeal?`, `compiledTeal?`): [`PersistSourceMapInput`](types_debug_utils.PersistSourceMapInput.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `appName` | `string` |
| `fileName` | `string` |
| `rawTeal?` | `string` |
| `compiledTeal?` | [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) |

#### Returns

[`PersistSourceMapInput`](types_debug_utils.PersistSourceMapInput.md)

#### Defined in

[src/types/debug-utils.ts:55](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L55)

## Properties

### \_fileName

• `Private` **\_fileName**: `string`

#### Defined in

[src/types/debug-utils.ts:52](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L52)

___

### \_rawTeal

• `Private` `Optional` **\_rawTeal**: `string`

#### Defined in

[src/types/debug-utils.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L53)

___

### appName

• **appName**: `string`

#### Defined in

[src/types/debug-utils.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L50)

___

### compiledTeal

• `Optional` **compiledTeal**: [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md)

#### Defined in

[src/types/debug-utils.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L51)

## Accessors

### fileName

• `get` **fileName**(): `string`

#### Returns

`string`

#### Defined in

[src/types/debug-utils.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L80)

___

### rawTeal

• `get` **rawTeal**(): `string`

#### Returns

`string`

#### Defined in

[src/types/debug-utils.ts:70](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L70)

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

[src/types/debug-utils.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L90)

___

### fromCompiledTeal

▸ **fromCompiledTeal**(`compiledTeal`, `appName`, `fileName`): [`PersistSourceMapInput`](types_debug_utils.PersistSourceMapInput.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `compiledTeal` | [`CompiledTeal`](../interfaces/types_app.CompiledTeal.md) |
| `appName` | `string` |
| `fileName` | `string` |

#### Returns

[`PersistSourceMapInput`](types_debug_utils.PersistSourceMapInput.md)

#### Defined in

[src/types/debug-utils.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L66)

___

### fromRawTeal

▸ **fromRawTeal**(`rawTeal`, `appName`, `fileName`): [`PersistSourceMapInput`](types_debug_utils.PersistSourceMapInput.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawTeal` | `string` |
| `appName` | `string` |
| `fileName` | `string` |

#### Returns

[`PersistSourceMapInput`](types_debug_utils.PersistSourceMapInput.md)

#### Defined in

[src/types/debug-utils.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L62)
