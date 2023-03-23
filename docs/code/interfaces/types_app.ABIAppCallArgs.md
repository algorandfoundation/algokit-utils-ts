[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / ABIAppCallArgs

# Interface: ABIAppCallArgs

[types/app](../modules/types_app.md).ABIAppCallArgs

App call args for an ABI call

## Table of contents

### Properties

- [args](types_app.ABIAppCallArgs.md#args)
- [boxes](types_app.ABIAppCallArgs.md#boxes)
- [lease](types_app.ABIAppCallArgs.md#lease)
- [method](types_app.ABIAppCallArgs.md#method)

## Properties

### args

• **args**: [`ABIAppCallArg`](../modules/types_app.md#abiappcallarg)[]

The ABI args to pass in

#### Defined in

[src/types/app.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L71)

___

### boxes

• `Optional` **boxes**: [`BoxReference`](types_app.BoxReference.md)[]

Any box references to load

#### Defined in

[src/types/app.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L75)

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

The optional lease for the transaction

#### Defined in

[src/types/app.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L73)

___

### method

• **method**: `ABIMethodParams` \| `ABIMethod`

The ABI method to call, either:
 * `method_name` e.g. `hello`; or
 * `method_signature` e.g. `hello(string)string`

#### Defined in

[src/types/app.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L69)
