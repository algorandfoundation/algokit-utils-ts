[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / ABIMethod

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

Defined in: [packages/abi/src/abi-method.ts:123](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L123)

Returns the method selector of this ABI method.

#### Returns

`Uint8Array`

The 4-byte method selector

#### Example

```ts
// Get the 4-byte method selector for ABI method calls
const method = ABIMethod.fromSignature('add(uint64,uint64)uint64')
const selector = method.getSelector()

// Selector is the first 4 bytes of SHA-512/256 hash of the signature
```

#### See

[Full working example](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.spec.ts)

***

### getSignature()

> **getSignature**(): `string`

Defined in: [packages/abi/src/abi-method.ts:105](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L105)

Returns the signature of this ABI method.

#### Returns

`string`

The signature, e.g. `my_method(unit64,string)bytes`

#### Example

```ts
// Get the full method signature string
const method = ABIMethod.fromSignature('transfer(address,uint64)bool')
const signature = method.getSignature()
```

#### See

[Full working example](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.spec.ts)

***

### fromSignature()

> `static` **fromSignature**(`signature`): `ABIMethod`

Defined in: [packages/abi/src/abi-method.ts:137](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L137)

Returns the ABI method object for a given method signature.

#### Parameters

##### signature

`string`

The method signature
e.g. `my_method(unit64,string)bytes`

#### Returns

`ABIMethod`

The `ABIMethod`

#### Example

```ts
// Parse a method signature string into an ABIMethod object
const method = ABIMethod.fromSignature('add(uint64,uint64)uint64')

// Access method properties
const name = method.name // 'add'
const argCount = method.args.length // 2
```

#### See

[Full working example](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.spec.ts)
