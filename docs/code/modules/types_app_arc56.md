[@algorandfoundation/algokit-utils](../README.md) / types/app-arc56

# Module: types/app-arc56

## Table of contents

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
### Classes

- [Arc56Method](../classes/types_app_arc56.Arc56Method.md)

<<<<<<< HEAD
=======
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
### Interfaces

- [Arc56Contract](../interfaces/types_app_arc56.Arc56Contract.md)
- [Event](../interfaces/types_app_arc56.Event.md)
- [Method](../interfaces/types_app_arc56.Method.md)
- [SourceInfo](../interfaces/types_app_arc56.SourceInfo.md)
- [StorageKey](../interfaces/types_app_arc56.StorageKey.md)
- [StorageMap](../interfaces/types_app_arc56.StorageMap.md)
- [StructFields](../interfaces/types_app_arc56.StructFields.md)

### Type Aliases

<<<<<<< HEAD
<<<<<<< HEAD
- [ABIStruct](types_app_arc56.md#abistruct)
=======
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
- [ABIStruct](types_app_arc56.md#abistruct)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
- [ABIType](types_app_arc56.md#abitype)
- [AVMBytes](types_app_arc56.md#avmbytes)
- [StructName](types_app_arc56.md#structname)

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
### Functions

- [getABIDecodedValue](types_app_arc56.md#getabidecodedvalue)
- [getABIEncodedValue](types_app_arc56.md#getabiencodedvalue)
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
- [getABIStructFromABITuple](types_app_arc56.md#getabistructfromabituple)
- [getABITupleFromABIStruct](types_app_arc56.md#getabituplefromabistruct)
- [getABITupleTypeFromABIStructDefinition](types_app_arc56.md#getabitupletypefromabistructdefinition)
- [getArc56Method](types_app_arc56.md#getarc56method)
- [getArc56ReturnValue](types_app_arc56.md#getarc56returnvalue)
<<<<<<< HEAD
=======
- [getTupleType](types_app_arc56.md#gettupletype)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

## Type Aliases

### ABIStruct

Ƭ **ABIStruct**: `Object`

Decoded ARC-56 struct as a struct rather than a tuple.

#### Index signature

▪ [key: `string`]: [`ABIStruct`](types_app_arc56.md#abistruct) \| `algosdk.ABIValue`

#### Defined in

<<<<<<< HEAD
[src/types/app-arc56.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L83)

___

=======
## Type Aliases

>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-arc56.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L85)

___

>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
### ABIType

Ƭ **ABIType**: `string`

An ABI-encoded type

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-arc56.ts:395](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L395)
=======
[src/types/app-arc56.ts:196](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L196)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-arc56.ts:232](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L232)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-arc56.ts:395](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L395)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### AVMBytes

Ƭ **AVMBytes**: ``"bytes"``

Raw byteslice without the length prefixed that is specified in ARC-4

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-arc56.ts:401](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L401)
=======
[src/types/app-arc56.ts:202](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L202)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
[src/types/app-arc56.ts:238](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L238)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-arc56.ts:401](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L401)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### StructName

Ƭ **StructName**: `string`

The name of a defined struct

#### Defined in

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
[src/types/app-arc56.ts:398](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L398)
=======
[src/types/app-arc56.ts:235](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L235)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-arc56.ts:398](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L398)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

## Functions

### getABIDecodedValue

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
▸ **getABIDecodedValue**(`value`, `type`, `structs`): `algosdk.ABIValue` \| [`ABIStruct`](types_app_arc56.md#abistruct)

Returns the decoded ABI value (or struct for a struct type)
for the given raw Algorand value given an ARC-56 type and defined ARC-56 structs.
<<<<<<< HEAD

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

[src/types/app-arc56.ts:95](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L95)
=======
▸ **getABIDecodedValue**(`value`, `type`, `structs`): `algosdk.ABIValue`
=======
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

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

<<<<<<< HEAD
[src/types/app-arc56.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L9)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
[src/types/app-arc56.ts:97](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L97)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

___

### getABIEncodedValue

▸ **getABIEncodedValue**(`value`, `type`, `structs`): `Uint8Array`

<<<<<<< HEAD
<<<<<<< HEAD
Returns the ABI-encoded value for the given value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `ABIValue` \| [`ABIStruct`](types_app_arc56.md#abistruct) | The value to encode either already in encoded binary form (`Uint8Array`), a decoded ABI value or an ARC-56 struct |
| `type` | `string` | The ARC-56 type - either an ABI Type string or a struct name |
| `structs` | `Record`\<`string`, [`StructFields`](../interfaces/types_app_arc56.StructFields.md)\> | The defined ARC-56 structs |
=======
#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `ABIValue` |
| `type` | `string` |
| `structs` | `Record`\<`string`, [`StructFields`](../interfaces/types_app_arc56.StructFields.md)\> |
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
Returns the ABI-encoded value for the given value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `ABIValue` \| [`ABIStruct`](types_app_arc56.md#abistruct) | The value to encode either already in encoded binary form (`Uint8Array`), an decoded ABI value or an ARC-56 struct |
| `type` | `string` | The ARC-56 type - either an ABI Type string or a struct name |
| `structs` | `Record`\<`string`, [`StructFields`](../interfaces/types_app_arc56.StructFields.md)\> | The defined ARC-56 structs |
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

#### Returns

`Uint8Array`

<<<<<<< HEAD
<<<<<<< HEAD
The binary ABI-encoded value

#### Defined in

[src/types/app-arc56.ts:115](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L115)

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

[src/types/app-arc56.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L57)

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

[src/types/app-arc56.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L75)

___

### getABITupleTypeFromABIStructDefinition

▸ **getABITupleTypeFromABIStructDefinition**(`struct`): `algosdk.ABITupleType`

Returns the `ABITupleType` for the given ARC-56 struct definition

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `struct` | [`StructFields`](../interfaces/types_app_arc56.StructFields.md) | The ARC-56 struct definition |
=======
=======
The binary ABI-encoded value

>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
#### Defined in

[src/types/app-arc56.ts:117](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L117)

___

### getABIStructFromABITuple

▸ **getABIStructFromABITuple**\<`TReturn`\>(`decodedABITuple`, `structFields`): `TReturn`

Converts a decoded ABI tuple as a struct.

#### Type parameters

| Name | Type |
| :------ | :------ |
<<<<<<< HEAD
| `struct` | [`StructFields`](../interfaces/types_app_arc56.StructFields.md) |
| `structs` | `Record`\<`string`, [`StructFields`](../interfaces/types_app_arc56.StructFields.md)\> |
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
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

[src/types/app-arc56.ts:58](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L58)

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

[src/types/app-arc56.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L76)

___

### getABITupleTypeFromABIStructDefinition

▸ **getABITupleTypeFromABIStructDefinition**(`struct`): `algosdk.ABITupleType`

Returns the `ABITupleType` for the given ARC-56 struct definition

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `struct` | [`StructFields`](../interfaces/types_app_arc56.StructFields.md) | The ARC-56 struct definition |
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)

#### Returns

`algosdk.ABITupleType`

<<<<<<< HEAD
<<<<<<< HEAD
The `ABITupleType`

#### Defined in

[src/types/app-arc56.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L44)

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

[src/types/app-arc56.ts:144](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L144)

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
| `method` | [`Arc56Method`](../classes/types_app_arc56.Arc56Method.md) \| [`Method`](../interfaces/types_app_arc56.Method.md) | The method that was called |
| `structs` | [`StructFields`](../interfaces/types_app_arc56.StructFields.md) | The struct fields from the app spec |

#### Returns

`TReturn`

The smart contract response with an updated return value

#### Defined in

[src/types/app-arc56.ts:175](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L175)
=======
[src/types/app-arc56.ts:199](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L199)
>>>>>>> e7c345f (feat: Added `AppClient` as an ARC-56 compatible non-typed application client)
=======
#### Defined in

[src/types/app-arc56.ts:3](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L3)
>>>>>>> 35253a5 (feat: Added `AppFactory` as an ARC-32/ARC-56 compatible mechanism to create and deploy apps and create app clients)
=======
The `ABITupleType`

#### Defined in

[src/types/app-arc56.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L44)

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

[src/types/app-arc56.ts:146](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L146)

___

### getArc56ReturnValue

▸ **getArc56ReturnValue**\<`TReturn`\>(`returnValue`, `method`, `structs`): `TReturn`

Checks for decode errors on the AppCallTransactionResult and maps the return value to the specified generic type

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TReturn` | extends `undefined` \| `ABIValue` \| [`ABIStruct`](types_app_arc56.md#abistruct) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `returnValue` | `undefined` \| [`ABIReturn`](types_app.md#abireturn) |
| `method` | [`Arc56Method`](../classes/types_app_arc56.Arc56Method.md) \| [`Method`](../interfaces/types_app_arc56.Method.md) |
| `structs` | [`StructFields`](../interfaces/types_app_arc56.StructFields.md) |

#### Returns

`TReturn`

The smart contract response with an updated return value

#### Defined in

[src/types/app-arc56.ts:175](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L175)
>>>>>>> 5dd8a6c (feat: Proper ARC-56 struct support)
