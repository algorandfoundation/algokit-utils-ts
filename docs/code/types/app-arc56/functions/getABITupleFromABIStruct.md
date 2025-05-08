[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-arc56](../README.md) / getABITupleFromABIStruct

# Function: getABITupleFromABIStruct()

> **getABITupleFromABIStruct**(`struct`, `structFields`, `structs`): `ABIValue`[]

Defined in: [src/types/app-arc56.ts:94](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L94)

Converts an ARC-56 struct as an ABI tuple.

## Parameters

### struct

[`ABIStruct`](../type-aliases/ABIStruct.md)

The struct to convert

### structFields

[`StructField`](../interfaces/StructField.md)[]

The struct fields from an ARC-56 app spec

### structs

`Record`\<`string`, [`StructField`](../interfaces/StructField.md)[]\>

## Returns

`ABIValue`[]

The struct as a decoded ABI tuple
