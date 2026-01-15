[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Packages/ABI](../README.md) / ABIMethod

# Class: ABIMethod

Defined in: [packages/abi/src/abi-method.ts:74](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L74)

## Constructors

### Constructor

> **new ABIMethod**(`params`): `ABIMethod`

Defined in: [packages/abi/src/abi-method.ts:82](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L82)

#### Parameters

##### params

###### args

[`ABIMethodArg`](../type-aliases/ABIMethodArg.md)[]

###### description?

`string`

###### events?

[`ARC28Event`](../type-aliases/ARC28Event.md)[]

###### name

`string`

###### readonly?

`boolean`

###### returns

[`ABIMethodReturn`](../type-aliases/ABIMethodReturn.md)

#### Returns

`ABIMethod`

## Properties

### args

> `readonly` **args**: [`ABIMethodArg`](../type-aliases/ABIMethodArg.md)[]

Defined in: [packages/abi/src/abi-method.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L77)

***

### description?

> `readonly` `optional` **description**: `string`

Defined in: [packages/abi/src/abi-method.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L76)

***

### events?

> `readonly` `optional` **events**: [`ARC28Event`](../type-aliases/ARC28Event.md)[]

Defined in: [packages/abi/src/abi-method.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L79)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/abi/src/abi-method.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L75)

***

### readonly?

> `readonly` `optional` **readonly**: `boolean`

Defined in: [packages/abi/src/abi-method.ts:80](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L80)

***

### returns

> `readonly` **returns**: [`ABIMethodReturn`](../type-aliases/ABIMethodReturn.md)

Defined in: [packages/abi/src/abi-method.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L78)

## Methods

### getSelector()

> **getSelector**(): `Uint8Array`

Defined in: [packages/abi/src/abi-method.ts:117](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L117)

Returns the method selector of this ABI method.

#### Returns

`Uint8Array`

The 4-byte method selector

***

### getSignature()

> **getSignature**(): `string`

Defined in: [packages/abi/src/abi-method.ts:102](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L102)

Returns the signature of this ABI method.

#### Returns

`string`

The signature, e.g. `my_method(unit64,string)bytes`

***

### fromSignature()

> `static` **fromSignature**(`signature`): `ABIMethod`

Defined in: [packages/abi/src/abi-method.ts:128](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L128)

Returns the ABI method object for a given method signature.

#### Parameters

##### signature

`string`

The method signature
e.g. `my_method(unit64,string)bytes`

#### Returns

`ABIMethod`

The `ABIMethod`
