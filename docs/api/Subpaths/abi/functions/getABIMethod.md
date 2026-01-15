[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / getABIMethod

# Function: getABIMethod()

> **getABIMethod**(`methodNameOrSignature`, `appSpec`): [`ABIMethod`](../classes/ABIMethod.md)

Defined in: [packages/abi/src/abi-method.ts:184](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L184)

Returns the ABI method object for a given method name or signature and ARC-56 app spec.

## Parameters

### methodNameOrSignature

`string`

The method name or method signature to call if an ABI call is being emitted.
e.g. `my_method` or `my_method(unit64,string)bytes`

### appSpec

[`Arc56Contract`](../type-aliases/Arc56Contract.md)

The app spec for the app

## Returns

[`ABIMethod`](../classes/ABIMethod.md)

The `ABIMethod`
