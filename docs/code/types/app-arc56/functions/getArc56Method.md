[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/app-arc56](../README.md) / getArc56Method

# Function: getArc56Method()

> **getArc56Method**(`methodNameOrSignature`, `appSpec`): [`Arc56Method`](../classes/Arc56Method.md)

Defined in: [src/types/app-arc56.ts:172](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L172)

Returns the ARC-56 ABI method object for a given method name or signature and ARC-56 app spec.

## Parameters

### methodNameOrSignature

`string`

The method name or method signature to call if an ABI call is being emitted.
e.g. `my_method` or `my_method(unit64,string)bytes`

### appSpec

[`Arc56Contract`](../interfaces/Arc56Contract.md)

The app spec for the app

## Returns

[`Arc56Method`](../classes/Arc56Method.md)

The `Arc56Method`
