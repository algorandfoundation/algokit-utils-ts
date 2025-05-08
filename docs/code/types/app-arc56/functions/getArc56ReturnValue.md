[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-arc56](../README.md) / getArc56ReturnValue

# Function: getArc56ReturnValue()

> **getArc56ReturnValue**\<`TReturn`\>(`returnValue`, `method`, `structs`): `TReturn`

Defined in: [src/types/app-arc56.ts:203](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L203)

Checks for decode errors on the AppCallTransactionResult and maps the return value to the specified generic type

## Type Parameters

### TReturn

`TReturn` *extends* `undefined` \| `Uint8Array`\<`ArrayBufferLike`\> \| `ABIValue` \| [`ABIStruct`](../type-aliases/ABIStruct.md)

## Parameters

### returnValue

The smart contract response

`undefined` | [`ABIReturn`](../../app/type-aliases/ABIReturn.md)

### method

The method that was called

[`Method`](../interfaces/Method.md) | [`Arc56Method`](../classes/Arc56Method.md)

### structs

`Record`\<`string`, [`StructField`](../interfaces/StructField.md)[]\>

The struct fields from the app spec

## Returns

`TReturn`

The smart contract response with an updated return value
