[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / getTupleValueFromStructValue

# Function: getTupleValueFromStructValue()

> **getTupleValueFromStructValue**(`structType`, `structValue`): [`ABIValue`](../type-aliases/ABIValue.md)[]

Defined in: [packages/abi/src/utils.ts:17](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/utils.ts#L17)

Converts a struct value (object with named fields) to a tuple value (array).

## Parameters

### structType

[`ABIStructType`](../classes/ABIStructType.md)

The struct type definition

### structValue

`ABIStructValue`

The struct value to convert

## Returns

[`ABIValue`](../type-aliases/ABIValue.md)[]

The equivalent tuple value
