[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getABIMethodSignature

# Function: ~~getABIMethodSignature()~~

> **getABIMethodSignature**(`method`): `string`

Defined in: [src/app.ts:430](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L430)

## Parameters

### method

The method to return a signature for

`ABIMethodParams` | `ABIMethod`

## Returns

`string`

The encoded ABI method spec e.g. `method_name(uint64,string)string`

## Deprecated

Use `abiMethod.getSignature()` or `new ABIMethod(abiMethodParams).getSignature()` instead.

Returns the encoded ABI spec for a given ABI Method
