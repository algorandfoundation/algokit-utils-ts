[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / getStructValueFromTupleValue

# Function: getStructValueFromTupleValue()

> **getStructValueFromTupleValue**(`structType`, `tupleValue`): `ABIStructValue`

Defined in: [packages/abi/src/utils.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/utils.ts#L43)

Converts a tuple value (array) to a struct value (object with named fields).

## Parameters

### structType

[`ABIStructType`](../classes/ABIStructType.md)

The struct type definition

### tupleValue

[`ABIValue`](../type-aliases/ABIValue.md)[]

The tuple value to convert

## Returns

`ABIStructValue`

The equivalent struct value
