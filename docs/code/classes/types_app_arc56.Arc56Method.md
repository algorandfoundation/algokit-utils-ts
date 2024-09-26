[@algorandfoundation/algokit-utils](../README.md) / [types/app-arc56](../modules/types_app_arc56.md) / Arc56Method

# Class: Arc56Method

[types/app-arc56](../modules/types_app_arc56.md).Arc56Method

Wrapper around `algosdk.ABIMethod` that represents an ARC-56 ABI method.

## Hierarchy

- `ABIMethod`

  ↳ **`Arc56Method`**

## Table of contents

### Constructors

- [constructor](types_app_arc56.Arc56Method.md#constructor)

### Properties

- [args](types_app_arc56.Arc56Method.md#args)
- [description](types_app_arc56.Arc56Method.md#description)
- [method](types_app_arc56.Arc56Method.md#method)
- [name](types_app_arc56.Arc56Method.md#name)
- [returns](types_app_arc56.Arc56Method.md#returns)

### Methods

- [getSelector](types_app_arc56.Arc56Method.md#getselector)
- [getSignature](types_app_arc56.Arc56Method.md#getsignature)
- [toJSON](types_app_arc56.Arc56Method.md#tojson)
- [txnCount](types_app_arc56.Arc56Method.md#txncount)
- [fromSignature](types_app_arc56.Arc56Method.md#fromsignature)

## Constructors

### constructor

• **new Arc56Method**(`method`): [`Arc56Method`](types_app_arc56.Arc56Method.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | [`Method`](../interfaces/types_app_arc56.Method.md) |

#### Returns

[`Arc56Method`](types_app_arc56.Arc56Method.md)

#### Overrides

algosdk.ABIMethod.constructor

#### Defined in

[src/types/app-arc56.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L22)

## Properties

### args

• `Readonly` **args**: \{ `defaultValue?`: `string` ; `desc?`: `string` ; `name?`: `string` ; `struct?`: `string` ; `type`: `ABIArgumentType`  }[]

#### Overrides

algosdk.ABIMethod.args

#### Defined in

[src/types/app-arc56.ts:9](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L9)

___

### description

• `Optional` `Readonly` **description**: `string`

#### Inherited from

algosdk.ABIMethod.description

#### Defined in

node_modules/algosdk/dist/types/abi/method.d.ts:23

___

### method

• **method**: [`Method`](../interfaces/types_app_arc56.Method.md)

#### Defined in

[src/types/app-arc56.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L22)

___

### name

• `Readonly` **name**: `string`

#### Inherited from

algosdk.ABIMethod.name

#### Defined in

node_modules/algosdk/dist/types/abi/method.d.ts:22

___

### returns

• `Readonly` **returns**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `desc?` | `string` | Optional, user-friendly description for the return value |
| `struct?` | `string` | If the type is a struct, the name of the struct |
| `type` | `ABIReturnType` | - |

#### Overrides

algosdk.ABIMethod.returns

#### Defined in

[src/types/app-arc56.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L16)

## Methods

### getSelector

▸ **getSelector**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

algosdk.ABIMethod.getSelector

#### Defined in

node_modules/algosdk/dist/types/abi/method.d.ts:35

___

### getSignature

▸ **getSignature**(): `string`

#### Returns

`string`

#### Inherited from

algosdk.ABIMethod.getSignature

#### Defined in

node_modules/algosdk/dist/types/abi/method.d.ts:34

___

### toJSON

▸ **toJSON**(): [`Method`](../interfaces/types_app_arc56.Method.md)

#### Returns

[`Method`](../interfaces/types_app_arc56.Method.md)

#### Overrides

algosdk.ABIMethod.toJSON

#### Defined in

[src/types/app-arc56.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L34)

___

### txnCount

▸ **txnCount**(): `number`

#### Returns

`number`

#### Inherited from

algosdk.ABIMethod.txnCount

#### Defined in

node_modules/algosdk/dist/types/abi/method.d.ts:36

___

### fromSignature

▸ **fromSignature**(`signature`): `ABIMethod`

#### Parameters

| Name | Type |
| :------ | :------ |
| `signature` | `string` |

#### Returns

`ABIMethod`

#### Inherited from

algosdk.ABIMethod.fromSignature

#### Defined in

node_modules/algosdk/dist/types/abi/method.d.ts:38
