[@algorandfoundation/algokit-utils](../README.md) / types/app-arc56

# Module: types/app-arc56

## Table of contents

### Interfaces

- [Arc56Contract](../interfaces/types_app_arc56.Arc56Contract.md)
- [Event](../interfaces/types_app_arc56.Event.md)
- [Method](../interfaces/types_app_arc56.Method.md)
- [SourceInfo](../interfaces/types_app_arc56.SourceInfo.md)
- [StorageKey](../interfaces/types_app_arc56.StorageKey.md)
- [StorageMap](../interfaces/types_app_arc56.StorageMap.md)
- [StructFields](../interfaces/types_app_arc56.StructFields.md)

### Type Aliases

- [ABIType](types_app_arc56.md#abitype)
- [AVMBytes](types_app_arc56.md#avmbytes)
- [StructName](types_app_arc56.md#structname)

### Functions

- [getABIDecodedValue](types_app_arc56.md#getabidecodedvalue)
- [getABIEncodedValue](types_app_arc56.md#getabiencodedvalue)
- [getTupleType](types_app_arc56.md#gettupletype)

## Type Aliases

### ABIType

Ƭ **ABIType**: `string`

An ABI-encoded type

#### Defined in

[src/types/app-arc56.ts:232](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L232)

___

### AVMBytes

Ƭ **AVMBytes**: ``"bytes"``

Raw byteslice without the length prefixed that is specified in ARC-4

#### Defined in

[src/types/app-arc56.ts:238](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L238)

___

### StructName

Ƭ **StructName**: `string`

The name of a defined struct

#### Defined in

[src/types/app-arc56.ts:235](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L235)

## Functions

### getABIDecodedValue

▸ **getABIDecodedValue**(`value`, `type`, `structs`): `algosdk.ABIValue`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` \| `bigint` \| `Uint8Array` |
| `type` | `string` |
| `structs` | `Record`\<`string`, [`StructFields`](../interfaces/types_app_arc56.StructFields.md)\> |

#### Returns

`algosdk.ABIValue`

#### Defined in

[src/types/app-arc56.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L9)

___

### getABIEncodedValue

▸ **getABIEncodedValue**(`value`, `type`, `structs`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `ABIValue` |
| `type` | `string` |
| `structs` | `Record`\<`string`, [`StructFields`](../interfaces/types_app_arc56.StructFields.md)\> |

#### Returns

`Uint8Array`

#### Defined in

[src/types/app-arc56.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L21)

___

### getTupleType

▸ **getTupleType**(`struct`, `structs`): `algosdk.ABITupleType`

#### Parameters

| Name | Type |
| :------ | :------ |
| `struct` | [`StructFields`](../interfaces/types_app_arc56.StructFields.md) |
| `structs` | `Record`\<`string`, [`StructFields`](../interfaces/types_app_arc56.StructFields.md)\> |

#### Returns

`algosdk.ABITupleType`

#### Defined in

[src/types/app-arc56.ts:3](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L3)
