[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / ABIAppCallArgs

# Interface: ABIAppCallArgs

[index](../modules/index.md).ABIAppCallArgs

App call args for an ABI call

## Table of contents

### Properties

- [args](index.ABIAppCallArgs.md#args)
- [lease](index.ABIAppCallArgs.md#lease)
- [method](index.ABIAppCallArgs.md#method)

## Properties

### args

• **args**: `ABIArgument`[]

The ABI args to pass in

#### Defined in

[app.ts:82](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L82)

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

The optional lease for the transaction

#### Defined in

[app.ts:84](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L84)

___

### method

• **method**: `ABIMethodParams` \| `ABIMethod`

The ABI method to call, either:
 * {method_name e.g. `hello`}; or
 * {method_signature e.g. `hello(string)string`}

#### Defined in

[app.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/app.ts#L80)
