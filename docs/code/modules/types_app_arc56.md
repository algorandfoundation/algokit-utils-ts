[@algorandfoundation/algokit-utils](../README.md) / types/app-arc56

# Module: types/app-arc56

## Table of contents

### Classes

- [Arc56Method](../classes/types_app_arc56.Arc56Method.md)

### Interfaces

- [Arc56Contract](../interfaces/types_app_arc56.Arc56Contract.md)
- [Event](../interfaces/types_app_arc56.Event.md)
- [Method](../interfaces/types_app_arc56.Method.md)
- [SourceInfo](../interfaces/types_app_arc56.SourceInfo.md)
- [StorageKey](../interfaces/types_app_arc56.StorageKey.md)
- [StorageMap](../interfaces/types_app_arc56.StorageMap.md)
- [StructFields](../interfaces/types_app_arc56.StructFields.md)

### Type Aliases

- [ABIStruct](types_app_arc56.md#abistruct)
- [ABIType](types_app_arc56.md#abitype)
- [AVMBytes](types_app_arc56.md#avmbytes)
- [Arc56MethodArg](types_app_arc56.md#arc56methodarg)
- [Arc56MethodReturnType](types_app_arc56.md#arc56methodreturntype)
- [StructName](types_app_arc56.md#structname)

### Functions

- [getABIDecodedValue](types_app_arc56.md#getabidecodedvalue)
- [getABIEncodedValue](types_app_arc56.md#getabiencodedvalue)
- [getABIStructFromABITuple](types_app_arc56.md#getabistructfromabituple)
- [getABITupleFromABIStruct](types_app_arc56.md#getabituplefromabistruct)
- [getABITupleTypeFromABIStructDefinition](types_app_arc56.md#getabitupletypefromabistructdefinition)
- [getArc56Method](types_app_arc56.md#getarc56method)
- [getArc56ReturnValue](types_app_arc56.md#getarc56returnvalue)

## Type Aliases

### ABIStruct

Ƭ **ABIStruct**: `Object`

Decoded ARC-56 struct as a struct rather than a tuple.

#### Index signature

▪ [key: `string`]: [`ABIStruct`](types_app_arc56.md#abistruct) \| `algosdk.ABIValue`

#### Defined in

[src/types/app-arc56.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L87)

___

### ABIType

Ƭ **ABIType**: `string`

An ABI-encoded type

#### Defined in

[src/types/app-arc56.ts:399](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L399)

___

### AVMBytes

Ƭ **AVMBytes**: ``"bytes"``

Raw byteslice without the length prefixed that is specified in ARC-4

#### Defined in

[src/types/app-arc56.ts:405](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L405)

___

### Arc56MethodArg

Ƭ **Arc56MethodArg**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`Method`](../interfaces/types_app_arc56.Method.md)[``"args"``][`number`], ``"type"``\> & \{ `type`: `algosdk.ABIArgumentType`  }\>

Type to describe an argument within an `Arc56Method`.

#### Defined in

[src/types/app-arc56.ts:6](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L6)

___

### Arc56MethodReturnType

Ƭ **Arc56MethodReturnType**: [`Expand`](types_expand.md#expand)\<`Omit`\<[`Method`](../interfaces/types_app_arc56.Method.md)[``"returns"``], ``"type"``\> & \{ `type`: `algosdk.ABIReturnType`  }\>

Type to describe a return type within an `Arc56Method`.

#### Defined in

[src/types/app-arc56.ts:13](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L13)

___

### StructName

Ƭ **StructName**: `string`

The name of a defined struct

#### Defined in

[src/types/app-arc56.ts:402](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L402)

## Functions

### getABIDecodedValue

▸ **getABIDecodedValue**(`value`, `type`, `structs`): `algosdk.ABIValue` \| [`ABIStruct`](types_app_arc56.md#abistruct)

Returns the decoded ABI value (or struct for a struct type)
for the given raw Algorand value given an ARC-56 type and defined ARC-56 structs.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `number` \| `bigint` \| `Uint8Array` | The raw Algorand value (bytes or uint64) |
| `type` | `string` | The ARC-56 type - either an ABI Type string or a struct name |
| `structs` | `Record`\<`string`, [`StructFields`](../interfaces/types_app_arc56.StructFields.md)\> | The defined ARC-56 structs |

#### Returns

`algosdk.ABIValue` \| [`ABIStruct`](types_app_arc56.md#abistruct)

The decoded ABI value or struct

#### Defined in

[src/types/app-arc56.ts:99](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L99)

___

### getABIEncodedValue

▸ **getABIEncodedValue**(`value`, `type`, `structs`): `Uint8Array`

Returns the ABI-encoded value for the given value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `ABIValue` \| [`ABIStruct`](types_app_arc56.md#abistruct) | The value to encode either already in encoded binary form (`Uint8Array`), a decoded ABI value or an ARC-56 struct |
| `type` | `string` | The ARC-56 type - either an ABI Type string or a struct name |
| `structs` | `Record`\<`string`, [`StructFields`](../interfaces/types_app_arc56.StructFields.md)\> | The defined ARC-56 structs |

#### Returns

`Uint8Array`

The binary ABI-encoded value

#### Defined in

[src/types/app-arc56.ts:119](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L119)

___

### getABIStructFromABITuple

▸ **getABIStructFromABITuple**\<`TReturn`\>(`decodedABITuple`, `structFields`): `TReturn`

Converts a decoded ABI tuple as a struct.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TReturn` | extends [`ABIStruct`](types_app_arc56.md#abistruct) = `Record`\<`string`, `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `decodedABITuple` | `ABIValue`[] | The decoded ABI tuple value |
| `structFields` | [`StructFields`](../interfaces/types_app_arc56.StructFields.md) | The struct fields from an ARC-56 app spec |

#### Returns

`TReturn`

The struct as a Record<string, any>

#### Defined in

[src/types/app-arc56.ts:61](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L61)

___

### getABITupleFromABIStruct

▸ **getABITupleFromABIStruct**(`struct`, `structFields`): `algosdk.ABIValue`[]

Converts an ARC-56 struct as an ABI tuple.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `struct` | [`ABIStruct`](types_app_arc56.md#abistruct) | The struct to convert |
| `structFields` | [`StructFields`](../interfaces/types_app_arc56.StructFields.md) | The struct fields from an ARC-56 app spec |

#### Returns

`algosdk.ABIValue`[]

The struct as a decoded ABI tuple

#### Defined in

[src/types/app-arc56.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L79)

___

### getABITupleTypeFromABIStructDefinition

▸ **getABITupleTypeFromABIStructDefinition**(`struct`): `algosdk.ABITupleType`

Returns the `ABITupleType` for the given ARC-56 struct definition

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `struct` | [`StructFields`](../interfaces/types_app_arc56.StructFields.md) | The ARC-56 struct definition |

#### Returns

`algosdk.ABITupleType`

The `ABITupleType`

#### Defined in

[src/types/app-arc56.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L48)

___

### getArc56Method

▸ **getArc56Method**(`methodNameOrSignature`, `appSpec`): [`Arc56Method`](../classes/types_app_arc56.Arc56Method.md)

Returns the ARC-56 ABI method object for a given method name or signature and ARC-56 app spec.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `methodNameOrSignature` | `string` | The method name or method signature to call if an ABI call is being emitted. e.g. `my_method` or `my_method(unit64,string)bytes` |
| `appSpec` | [`Arc56Contract`](../interfaces/types_app_arc56.Arc56Contract.md) | The app spec for the app |

#### Returns

[`Arc56Method`](../classes/types_app_arc56.Arc56Method.md)

The `Arc56Method`

#### Defined in

[src/types/app-arc56.ts:148](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L148)

___

### getArc56ReturnValue

▸ **getArc56ReturnValue**\<`TReturn`\>(`returnValue`, `method`, `structs`): `TReturn`

Checks for decode errors on the AppCallTransactionResult and maps the return value to the specified generic type

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TReturn` | extends `undefined` \| `ABIValue` \| [`ABIStruct`](types_app_arc56.md#abistruct) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `returnValue` | `undefined` \| [`ABIReturn`](types_app.md#abireturn) | The smart contract response |
| `method` | [`Method`](../interfaces/types_app_arc56.Method.md) \| [`Arc56Method`](../classes/types_app_arc56.Arc56Method.md) | The method that was called |
| `structs` | [`StructFields`](../interfaces/types_app_arc56.StructFields.md) | The struct fields from the app spec |

#### Returns

`TReturn`

The smart contract response with an updated return value

#### Defined in

[src/types/app-arc56.ts:179](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L179)
