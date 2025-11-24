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
- [events](types_app_arc56.Arc56Method.md#events)
- [method](types_app_arc56.Arc56Method.md#method)
- [name](types_app_arc56.Arc56Method.md#name)
- [readonly](types_app_arc56.Arc56Method.md#readonly)
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

[src/types/app-arc56.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L27)

## Properties

### args

• `Readonly` **args**: \{ `defaultValue?`: \{ `data`: `string` ; `source`: ``"method"`` \| ``"box"`` \| ``"local"`` \| ``"global"`` \| ``"literal"`` ; `type?`: `string`  } ; `desc?`: `string` ; `name?`: `string` ; `struct?`: `string` ; `type`: `ABIArgumentType`  }[]

#### Overrides

algosdk.ABIMethod.args

#### Defined in

[src/types/app-arc56.ts:24](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L24)

___

### description

• `Optional` `Readonly` **description**: `string`

#### Inherited from

algosdk.ABIMethod.description

#### Defined in

[packages/sdk/src/abi/method.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/sdk/src/abi/method.ts#L79)

___

### events

• `Optional` `Readonly` **events**: `ARC28Event`[]

#### Inherited from

algosdk.ABIMethod.events

#### Defined in

[packages/sdk/src/abi/method.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/sdk/src/abi/method.ts#L87)

___

### method

• **method**: [`Method`](../interfaces/types_app_arc56.Method.md)

#### Defined in

[src/types/app-arc56.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L27)

___

### name

• `Readonly` **name**: `string`

#### Inherited from

algosdk.ABIMethod.name

#### Defined in

[packages/sdk/src/abi/method.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/sdk/src/abi/method.ts#L78)

___

### readonly

• `Optional` `Readonly` **readonly**: `boolean`

#### Inherited from

algosdk.ABIMethod.readonly

#### Defined in

[packages/sdk/src/abi/method.ts:88](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/sdk/src/abi/method.ts#L88)

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

[src/types/app-arc56.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L25)

## Methods

### getSelector

▸ **getSelector**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

algosdk.ABIMethod.getSelector

#### Defined in

[packages/sdk/src/abi/method.ts:134](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/sdk/src/abi/method.ts#L134)

___

### getSignature

▸ **getSignature**(): `string`

#### Returns

`string`

#### Inherited from

algosdk.ABIMethod.getSignature

#### Defined in

[packages/sdk/src/abi/method.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/sdk/src/abi/method.ts#L128)

___

### toJSON

▸ **toJSON**(): [`Method`](../interfaces/types_app_arc56.Method.md)

#### Returns

[`Method`](../interfaces/types_app_arc56.Method.md)

#### Overrides

algosdk.ABIMethod.toJSON

#### Defined in

[src/types/app-arc56.ts:39](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/app-arc56.ts#L39)

___

### txnCount

▸ **txnCount**(): `number`

#### Returns

`number`

#### Inherited from

algosdk.ABIMethod.txnCount

#### Defined in

[packages/sdk/src/abi/method.ts:139](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/sdk/src/abi/method.ts#L139)

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

[packages/sdk/src/abi/method.ts:167](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/sdk/src/abi/method.ts#L167)
