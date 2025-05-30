[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [index](../README.md) / getABIReturnValue

# Function: getABIReturnValue()

> **getABIReturnValue**(`result`, `type`): [`ABIReturn`](../../types/app/type-aliases/ABIReturn.md)

Defined in: [src/transaction/transaction.ts:940](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/transaction/transaction.ts#L940)

Takes an algosdk `ABIResult` and converts it to an `ABIReturn`.
Converts `bigint`'s for Uint's < 64 to `number` for easier use.

## Parameters

### result

`ABIResult`

The `ABIReturn`

### type

`ABIReturnType`

## Returns

[`ABIReturn`](../../types/app/type-aliases/ABIReturn.md)
