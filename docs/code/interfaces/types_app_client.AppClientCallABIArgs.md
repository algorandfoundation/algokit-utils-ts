[@algorandfoundation/algokit-utils](../README.md) / [types/app-client](../modules/types_app_client.md) / AppClientCallABIArgs

# Interface: AppClientCallABIArgs

[types/app-client](../modules/types_app_client.md).AppClientCallABIArgs

## Hierarchy

- `Omit`<[`ABIAppCallArgs`](../modules/types_app.md#abiappcallargs), ``"method"``\>

  ↳ **`AppClientCallABIArgs`**

## Table of contents

### Properties

- [boxes](types_app_client.AppClientCallABIArgs.md#boxes)
- [lease](types_app_client.AppClientCallABIArgs.md#lease)
- [method](types_app_client.AppClientCallABIArgs.md#method)
- [methodArgs](types_app_client.AppClientCallABIArgs.md#methodargs)

## Properties

### boxes

• `Optional` **boxes**: ([`BoxReference`](types_app.BoxReference.md) \| [`BoxIdentifier`](../modules/types_app.md#boxidentifier) \| `BoxReference`)[]

Any box references to load

#### Inherited from

Omit.boxes

#### Defined in

[src/types/app.ts:71](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L71)

___

### lease

• `Optional` **lease**: `string` \| `Uint8Array`

The optional lease for the transaction

#### Inherited from

Omit.lease

#### Defined in

[src/types/app.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L69)

___

### method

• **method**: `string`

If calling an ABI method then either the name of the method, or the ABI signature

#### Defined in

[src/types/app-client.ts:136](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-client.ts#L136)

___

### methodArgs

• **methodArgs**: [`ABIAppCallArg`](../modules/types_app.md#abiappcallarg)[]

The ABI method args to pass in

#### Inherited from

Omit.methodArgs

#### Defined in

[src/types/app.ts:100](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app.ts#L100)
