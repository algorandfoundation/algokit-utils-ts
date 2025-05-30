[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-arc56](../README.md) / getABIStructFromABITuple

# Function: getABIStructFromABITuple()

> **getABIStructFromABITuple**\<`TReturn`\>(`decodedABITuple`, `structFields`, `structs`): `TReturn`

Defined in: [src/types/app-arc56.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L71)

Converts a decoded ABI tuple as a struct.

## Type Parameters

### TReturn

`TReturn` *extends* [`ABIStruct`](../type-aliases/ABIStruct.md) = `Record`\<`string`, `any`\>

## Parameters

### decodedABITuple

`ABIValue`[]

The decoded ABI tuple value

### structFields

[`StructField`](../interfaces/StructField.md)[]

The struct fields from an ARC-56 app spec

### structs

`Record`\<`string`, [`StructField`](../interfaces/StructField.md)[]\>

## Returns

`TReturn`

The struct as a Record<string, any>
