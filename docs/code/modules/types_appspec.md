[@algorandfoundation/algokit-utils](../README.md) / types/appspec

# Module: types/appspec

## Table of contents

### Enumerations

- [AVMType](../enums/types_appspec.AVMType.md)

### Interfaces

- [AppSources](../interfaces/types_appspec.AppSources.md)
- [AppSpec](../interfaces/types_appspec.AppSpec.md)
- [DeclaredSchemaValueSpec](../interfaces/types_appspec.DeclaredSchemaValueSpec.md)
- [DefaultArgument](../interfaces/types_appspec.DefaultArgument.md)
- [Hint](../interfaces/types_appspec.Hint.md)
- [ReservedSchemaValueSpec](../interfaces/types_appspec.ReservedSchemaValueSpec.md)
- [Schema](../interfaces/types_appspec.Schema.md)
- [SchemaSpec](../interfaces/types_appspec.SchemaSpec.md)
- [StateSchemaSpec](../interfaces/types_appspec.StateSchemaSpec.md)
- [Struct](../interfaces/types_appspec.Struct.md)

### Type Aliases

- [ABIType](types_appspec.md#abitype)
- [CallConfigValue](types_appspec.md#callconfigvalue)
- [FieldName](types_appspec.md#fieldname)
- [HintSpec](types_appspec.md#hintspec)
- [StateSchema](types_appspec.md#stateschema)
- [StructElement](types_appspec.md#structelement)

### Functions

- [getABISignature](types_appspec.md#getabisignature)

## Type Aliases

### ABIType

Ƭ **ABIType**: `string`

The string name of an ABI type

#### Defined in

[src/types/appspec.ts:72](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L72)

___

### CallConfigValue

Ƭ **CallConfigValue**: ``"NEVER"`` \| ``"CALL"`` \| ``"CREATE"`` \| ``"ALL"``

The various call configs:
 * `NEVER`: Will not be called
 * `CALL`: Can be called during a non-create call i.e. app id != 0
 * `CREATE`: Can be called during a create call i.e. app id = 0
 * `ALL`: Can be during a create OR non-create call

#### Defined in

[src/types/appspec.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L50)

___

### FieldName

Ƭ **FieldName**: `string`

The name of a field

#### Defined in

[src/types/appspec.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L69)

___

### HintSpec

Ƭ **HintSpec**: `Record`<`string`, [`Hint`](../interfaces/types_appspec.Hint.md)\>

A lookup of encoded method call spec to hint

#### Defined in

[src/types/appspec.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L34)

___

### StateSchema

Ƭ **StateSchema**: `Object`

Schema spec summary for global or local storage

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `num_byte_slices` | `number` | Number of byte slots |
| `num_uints` | `number` | Number of uint slots |

#### Defined in

[src/types/appspec.ts:151](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L151)

___

### StructElement

Ƭ **StructElement**: [[`FieldName`](types_appspec.md#fieldname), [`ABIType`](types_appspec.md#abitype)]

The elements of the struct/tuple: `FieldName`, `ABIType`

#### Defined in

[src/types/appspec.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L75)

## Functions

### getABISignature

▸ **getABISignature**(`method`): `string`

Deprecated - here for backwards compatibility, instead use algokit.getABIMethodSignature

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `ABIMethodParams` \| `ABIMethod` |

#### Returns

`string`

#### Defined in

[src/app.ts:613](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L613)
