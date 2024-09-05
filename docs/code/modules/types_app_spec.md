[@algorandfoundation/algokit-utils](../README.md) / types/app-spec

# Module: types/app-spec

## Table of contents

### Interfaces

- [AppSources](../interfaces/types_app_spec.AppSources.md)
- [AppSpec](../interfaces/types_app_spec.AppSpec.md)
- [CallConfig](../interfaces/types_app_spec.CallConfig.md)
- [DeclaredSchemaValueSpec](../interfaces/types_app_spec.DeclaredSchemaValueSpec.md)
- [Hint](../interfaces/types_app_spec.Hint.md)
- [ReservedSchemaValueSpec](../interfaces/types_app_spec.ReservedSchemaValueSpec.md)
- [Schema](../interfaces/types_app_spec.Schema.md)
- [SchemaSpec](../interfaces/types_app_spec.SchemaSpec.md)
- [StateSchemaSpec](../interfaces/types_app_spec.StateSchemaSpec.md)
- [Struct](../interfaces/types_app_spec.Struct.md)

### Type Aliases

- [ABIType](types_app_spec.md#abitype)
- [AVMType](types_app_spec.md#avmtype)
- [CallConfigValue](types_app_spec.md#callconfigvalue)
- [DefaultArgument](types_app_spec.md#defaultargument)
- [FieldName](types_app_spec.md#fieldname)
- [HintSpec](types_app_spec.md#hintspec)
- [StateSchema](types_app_spec.md#stateschema)
- [StructElement](types_app_spec.md#structelement)

### Functions

- [arc32ToArc56](types_app_spec.md#arc32toarc56)

## Type Aliases

### ABIType

Ƭ **ABIType**: `string`

The string name of an ABI type

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-spec.ts:187](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L187)
=======
[src/types/app-spec.ts:183](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L183)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-spec.ts:189](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L189)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### AVMType

Ƭ **AVMType**: ``"uint64"`` \| ``"bytes"``

AVM data type

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-spec.ts:243](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L243)
=======
[src/types/app-spec.ts:239](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L239)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-spec.ts:245](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L245)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### CallConfigValue

Ƭ **CallConfigValue**: ``"NEVER"`` \| ``"CALL"`` \| ``"CREATE"`` \| ``"ALL"``

The various call configs:
 * `NEVER`: Will not be called
 * `CALL`: Can be called during a non-create call i.e. app id != 0
 * `CREATE`: Can be called during a create call i.e. app id = 0
 * `ALL`: Can be during a create OR non-create call

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-spec.ts:158](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L158)
=======
[src/types/app-spec.ts:154](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L154)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-spec.ts:160](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L160)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### DefaultArgument

Ƭ **DefaultArgument**: \{ `data`: `ABIMethodParams` ; `source`: ``"abi-method"``  } \| \{ `data`: `string` ; `source`: ``"global-state"``  } \| \{ `data`: `string` ; `source`: ``"local-state"``  } \| \{ `data`: `string` \| `number` ; `source`: ``"constant"``  }

Defines a strategy for obtaining a default value for a given ABI arg.

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-spec.ts:203](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L203)
=======
[src/types/app-spec.ts:199](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L199)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-spec.ts:205](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L205)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### FieldName

Ƭ **FieldName**: `string`

The name of a field

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-spec.ts:184](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L184)
=======
[src/types/app-spec.ts:180](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L180)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-spec.ts:186](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L186)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### HintSpec

Ƭ **HintSpec**: `Record`\<`string`, [`Hint`](../interfaces/types_app_spec.Hint.md)\>

A lookup of encoded method call spec to hint

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-spec.ts:142](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L142)
=======
[src/types/app-spec.ts:138](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L138)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-spec.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L144)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

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

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-spec.ts:292](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L292)
=======
[src/types/app-spec.ts:288](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L288)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-spec.ts:294](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L294)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

___

### StructElement

Ƭ **StructElement**: [[`FieldName`](types_app_spec.md#fieldname), [`ABIType`](types_app_spec.md#abitype)]

The elements of the struct/tuple: `FieldName`, `ABIType`

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-spec.ts:190](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L190)
=======
[src/types/app-spec.ts:186](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L186)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-spec.ts:192](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L192)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)

## Functions

### arc32ToArc56

▸ **arc32ToArc56**(`appSpec`): [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `appSpec` | [`AppSpec`](../interfaces/types_app_spec.AppSpec.md) |

#### Returns

[`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md)

#### Defined in

[src/types/app-spec.ts:7](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-spec.ts#L7)
