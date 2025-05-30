[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-arc56](../README.md) / getABIDecodedValue

# Function: getABIDecodedValue()

> **getABIDecodedValue**(`value`, `type`, `structs`): `ABIValue` \| [`ABIStruct`](../type-aliases/ABIStruct.md)

Defined in: [src/types/app-arc56.ts:129](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L129)

Returns the decoded ABI value (or struct for a struct type)
for the given raw Algorand value given an ARC-56 type and defined ARC-56 structs.

## Parameters

### value

The raw Algorand value (bytes or uint64)

`number` | `bigint` | `Uint8Array`\<`ArrayBufferLike`\>

### type

`string`

The ARC-56 type - either an ABI Type string or a struct name

### structs

`Record`\<`string`, [`StructField`](../interfaces/StructField.md)[]\>

The defined ARC-56 structs

## Returns

`ABIValue` \| [`ABIStruct`](../type-aliases/ABIStruct.md)

The decoded ABI value or struct
