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

src/types/debug-utils.ts:69

## Properties

### \_fileName

• `Private` **\_fileName**: `string`

#### Defined in

src/types/debug-utils.ts:67

___

### appName

• **appName**: `string`

#### Defined in

src/types/debug-utils.ts:66

___

### teal

• **teal**: `string`

#### Defined in

src/types/debug-utils.ts:65

## Accessors

### fileName

• `get` **fileName**(): `string`

#### Returns

`string`

#### Defined in

src/types/debug-utils.ts:75

• `set` **fileName**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`void`

#### Defined in

src/types/debug-utils.ts:79

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

src/types/debug-utils.ts:83
