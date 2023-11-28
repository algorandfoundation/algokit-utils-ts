[@algorandfoundation/algokit-utils](../README.md) / [types/debug-utils](../modules/types_debug_utils.md) / PersistSourceMapInput

# Class: PersistSourceMapInput

[types/debug-utils](../modules/types_debug_utils.md).PersistSourceMapInput

## Table of contents

### Constructors

- [constructor](types_debug_utils.PersistSourceMapInput.md#constructor)

### Properties

- [\_fileName](types_debug_utils.PersistSourceMapInput.md#_filename)
- [appName](types_debug_utils.PersistSourceMapInput.md#appname)
- [teal](types_debug_utils.PersistSourceMapInput.md#teal)

### Accessors

- [fileName](types_debug_utils.PersistSourceMapInput.md#filename)

### Methods

- [stripTealExtension](types_debug_utils.PersistSourceMapInput.md#striptealextension)

## Constructors

### constructor

• **new PersistSourceMapInput**(`teal`, `appName`, `fileName`): [`PersistSourceMapInput`](types_debug_utils.PersistSourceMapInput.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `teal` | `string` |
| `appName` | `string` |
| `fileName` | `string` |

#### Returns

[`PersistSourceMapInput`](types_debug_utils.PersistSourceMapInput.md)

#### Defined in

[src/types/debug-utils.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L66)

## Properties

### \_fileName

• `Private` **\_fileName**: `string`

#### Defined in

[src/types/debug-utils.ts:64](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L64)

___

### appName

• **appName**: `string`

#### Defined in

[src/types/debug-utils.ts:63](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L63)

___

### teal

• **teal**: `string`

#### Defined in

[src/types/debug-utils.ts:62](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L62)

## Accessors

### fileName

• `get` **fileName**(): `string`

#### Returns

`string`

#### Defined in

[src/types/debug-utils.ts:72](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L72)

• `set` **fileName**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`void`

#### Defined in

[src/types/debug-utils.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L76)

## Methods

### stripTealExtension

▸ **stripTealExtension**(`fileName`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileName` | `string` |

#### Returns

`string`

#### Defined in

[src/types/debug-utils.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/debug-utils.ts#L80)
