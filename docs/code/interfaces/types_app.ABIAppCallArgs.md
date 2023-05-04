[@algorandfoundation/algokit-utils](../README.md) / [types/app](../modules/types_app.md) / ABIAppCallArgs

# Interface: ABIAppCallArgs

[types/app](../modules/types_app.md).ABIAppCallArgs

App call args for an ABI call

## Hierarchy

- [`CoreAppCallArgs`](types_app.CoreAppCallArgs.md)

  ↳ **`ABIAppCallArgs`**

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

[src/types/app.ts:98](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L98)

___

### boxes

• `Optional` **boxes**: ([`BoxReference`](types_app.BoxReference.md) \| [`BoxIdentifier`](../modules/types_app.md#boxidentifier) \| `BoxReference`)[]

Any box references to load

#### Inherited from

[CoreAppCallArgs](types_app.CoreAppCallArgs.md).[boxes](types_app.CoreAppCallArgs.md#boxes)

#### Defined in

[src/types/app.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L71)

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

The optional lease for the transaction

#### Inherited from

[CoreAppCallArgs](types_app.CoreAppCallArgs.md).[lease](types_app.CoreAppCallArgs.md#lease)

#### Defined in

[src/types/app.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L69)

___

### method

• **method**: `ABIMethodParams` \| `ABIMethod`

The ABI method to call

#### Defined in

[src/types/app.ts:96](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L96)
