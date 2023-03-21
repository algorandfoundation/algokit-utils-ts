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

- [CallConfigValue](types_appspec.md#callconfigvalue)
- [HintSpec](types_appspec.md#hintspec)
- [StateSchema](types_appspec.md#stateschema)
- [StructElement](types_appspec.md#structelement)

### Functions

- [getABISignature](types_appspec.md#getabisignature)

## Type Aliases

### CallConfigValue

Ƭ **CallConfigValue**: ``"NEVER"`` \| ``"CALL"`` \| ``"CREATE"`` \| ``"ALL"``

#### Defined in

[types/appspec.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L26)

___

### HintSpec

Ƭ **HintSpec**: `Record`<`string`, [`Hint`](../interfaces/types_appspec.Hint.md)\>

#### Defined in

[types/appspec.ts:19](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L19)

___

### StateSchema

Ƭ **StateSchema**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `num_byte_slices` | `number` |
| `num_uints` | `number` |

#### Defined in

[types/appspec.ts:86](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L86)

___

### StructElement

Ƭ **StructElement**: [`string`, `string`]

#### Defined in

[types/appspec.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L42)

## Functions

### getABISignature

▸ **getABISignature**(`method`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `ABIMethodParams` \| `ABIMethod` |

#### Returns

`string`

#### Defined in

[types/appspec.ts:91](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/appspec.ts#L91)
