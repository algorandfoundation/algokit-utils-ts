[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / ABIArrayDynamicType

# Class: ABIArrayDynamicType

Defined in: [packages/abi/src/abi-type.ts:668](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/abi-type.ts#L668)

A dynamic-length array ABI type.

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`ABIType`](ABIType.md)

## Constructors

### Constructor

> **new ABIArrayDynamicType**(`childType`): `ABIArrayDynamicType`

Defined in: [packages/abi/src/abi-type.ts:673](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/abi-type.ts#L673)

Creates a new dynamic array type.

#### Parameters

##### childType

[`ABIType`](ABIType.md)

The type of the array elements

#### Returns

`ABIArrayDynamicType`

#### Overrides

[`ABIType`](ABIType.md).[`constructor`](ABIType.md#constructor)

## Properties

### childType

> `readonly` **childType**: [`ABIType`](ABIType.md)

Defined in: [packages/abi/src/abi-type.ts:673](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/abi-type.ts#L673)

The type of the array elements

## Accessors

### displayName

#### Get Signature

> **get** **displayName**(): `string`

Defined in: [packages/abi/src/abi-type.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/abi-type.ts#L49)

Returns a user-friendly display name for this type.

##### Returns

`string`

The display name for this type

#### Inherited from

[`ABIType`](ABIType.md).[`displayName`](ABIType.md#displayname)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [packages/abi/src/abi-type.ts:677](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/abi-type.ts#L677)

Returns the ARC-4 type name string representation.

##### Returns

`string`

The ARC-4 type string

#### Overrides

[`ABIType`](ABIType.md).[`name`](ABIType.md#name)

## Methods

### byteLen()

> **byteLen**(): `number`

Defined in: [packages/abi/src/abi-type.ts:689](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/abi-type.ts#L689)

Gets the byte length of the encoded type for static types.

#### Returns

`number`

The number of bytes needed to encode this type

#### Throws

Error if the type is dynamic

#### Overrides

[`ABIType`](ABIType.md).[`byteLen`](ABIType.md#bytelen)

***

### decode()

> **decode**(`bytes`): `Uint8Array` \| [`ABIValue`](../type-aliases/ABIValue.md)[]

Defined in: [packages/abi/src/abi-type.ts:712](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/abi-type.ts#L712)

Decodes bytes according to this ABI type.

#### Parameters

##### bytes

`Uint8Array`

The bytes to decode

#### Returns

`Uint8Array` \| [`ABIValue`](../type-aliases/ABIValue.md)[]

The decoded value

#### Overrides

[`ABIType`](ABIType.md).[`decode`](ABIType.md#decode)

***

### encode()

> **encode**(`value`): `Uint8Array`

Defined in: [packages/abi/src/abi-type.ts:702](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/abi-type.ts#L702)

Encodes a value according to this ABI type.

#### Parameters

##### value

[`ABIValue`](../type-aliases/ABIValue.md)

The value to encode

#### Returns

`Uint8Array`

The encoded bytes

#### Overrides

[`ABIType`](ABIType.md).[`encode`](ABIType.md#encode)

***

### equals()

> **equals**(`other`): `boolean`

Defined in: [packages/abi/src/abi-type.ts:681](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/abi-type.ts#L681)

Checks if this ABI type is equal to another.

#### Parameters

##### other

[`ABIType`](ABIType.md)

The other ABI type to compare with

#### Returns

`boolean`

True if the types are equal, false otherwise

#### Overrides

[`ABIType`](ABIType.md).[`equals`](ABIType.md#equals)

***

### isDynamic()

> **isDynamic**(): `boolean`

Defined in: [packages/abi/src/abi-type.ts:685](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/abi-type.ts#L685)

Checks if this ABI type is dynamic (variable-length).

#### Returns

`boolean`

True if the type is dynamic, false otherwise

#### Overrides

[`ABIType`](ABIType.md).[`isDynamic`](ABIType.md#isdynamic)

***

### toABITupleType()

> **toABITupleType**(`length`): [`ABITupleType`](ABITupleType.md)

Defined in: [packages/abi/src/abi-type.ts:698](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/abi-type.ts#L698)

Converts this dynamic array type to an equivalent tuple type of a given length.

#### Parameters

##### length

`number`

The number of elements

#### Returns

[`ABITupleType`](ABITupleType.md)

The equivalent tuple type

***

### toString()

> **toString**(): `string`

Defined in: [packages/abi/src/abi-type.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/abi-type.ts#L57)

Returns the ARC-4 type name string representation.

#### Returns

`string`

The ARC-4 type string

#### Inherited from

[`ABIType`](ABIType.md).[`toString`](ABIType.md#tostring)

***

### from()

> `static` **from**(`str`): [`ABIType`](ABIType.md)

Defined in: [packages/abi/src/abi-type.ts:100](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/abi-type.ts#L100)

Creates an ABI type from an ARC-4 type string.

#### Parameters

##### str

`string`

The ARC-4 type string (e.g., "uint256", "bool", "(uint8,address)")

#### Returns

[`ABIType`](ABIType.md)

The corresponding ABI type

#### Inherited from

[`ABIType`](ABIType.md).[`from`](ABIType.md#from)
