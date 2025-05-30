[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-arc56](../README.md) / getABIEncodedValue

# Function: getABIEncodedValue()

> **getABIEncodedValue**(`value`, `type`, `structs`): `Uint8Array`

Defined in: [src/types/app-arc56.ts:153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L153)

Returns the ABI-encoded value for the given value.

## Parameters

### value

The value to encode either already in encoded binary form (`Uint8Array`), a decoded ABI value or an ARC-56 struct

`Uint8Array`\<`ArrayBufferLike`\> | `ABIValue` | [`ABIStruct`](../type-aliases/ABIStruct.md)

### type

`string`

The ARC-56 type - either an ABI Type string or a struct name

### structs

`Record`\<`string`, [`StructField`](../interfaces/StructField.md)[]\>

The defined ARC-56 structs

## Returns

`Uint8Array`

The binary ABI-encoded value
