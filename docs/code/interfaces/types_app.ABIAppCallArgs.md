[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / ABIAppCallArgs

# Interface: ABIAppCallArgs

[types/app](../modules/types_app.md).ABIAppCallArgs

App call args for an ABI call

## Table of contents

### Properties

- [args](types_app.ABIAppCallArgs.md#args)
- [lease](types_app.ABIAppCallArgs.md#lease)
- [method](types_app.ABIAppCallArgs.md#method)

## Properties

### args

• **args**: `ABIArgument`[]

The ABI args to pass in

#### Defined in

types/app.ts:69

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

The optional lease for the transaction

#### Defined in

types/app.ts:71

___

### method

• **method**: `ABIMethodParams` \| `ABIMethod`

The ABI method to call, either:
 * `method_name` e.g. `hello`; or
 * `method_signature` e.g. `hello(string)string`

#### Defined in

types/app.ts:67
