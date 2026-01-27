[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / ABIArrayDynamicType

# Class: ABIArrayDynamicType

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:680](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L680)
=======
Defined in: [packages/abi/src/abi-type.ts:683](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L683)
>>>>>>> docs/fix-reference-warnings

A dynamic-length array ABI type.

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`ABIType`](ABIType.md)

## Constructors

### Constructor

> **new ABIArrayDynamicType**(`childType`): `ABIArrayDynamicType`

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:685](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L685)
=======
Defined in: [packages/abi/src/abi-type.ts:688](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L688)
>>>>>>> docs/fix-reference-warnings

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

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:685](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L685)
=======
Defined in: [packages/abi/src/abi-type.ts:688](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L688)
>>>>>>> docs/fix-reference-warnings

The type of the array elements

## Accessors

### displayName

#### Get Signature

> **get** **displayName**(): `string`

Defined in: [packages/abi/src/abi-type.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L49)

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

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:689](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L689)
=======
Defined in: [packages/abi/src/abi-type.ts:692](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L692)
>>>>>>> docs/fix-reference-warnings

Returns the ARC-4 type name string representation.

##### Returns

`string`

The ARC-4 type string

#### Overrides

[`ABIType`](ABIType.md).[`name`](ABIType.md#name)

## Methods

### byteLen()

> **byteLen**(): `number`

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:701](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L701)
=======
Defined in: [packages/abi/src/abi-type.ts:704](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L704)
>>>>>>> docs/fix-reference-warnings

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

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:724](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L724)
=======
Defined in: [packages/abi/src/abi-type.ts:727](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L727)
>>>>>>> docs/fix-reference-warnings

Decodes bytes according to this ABI type.

#### Parameters

##### bytes

`Uint8Array`

The bytes to decode

#### Returns

`Uint8Array` \| [`ABIValue`](../type-aliases/ABIValue.md)[]

The decoded value

#### Throws

If the bytes cannot be decoded as this type

#### Overrides

[`ABIType`](ABIType.md).[`decode`](ABIType.md#decode)

***

### encode()

> **encode**(`value`): `Uint8Array`

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:714](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L714)
=======
Defined in: [packages/abi/src/abi-type.ts:717](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L717)
>>>>>>> docs/fix-reference-warnings

Encodes a value according to this ABI type.

#### Parameters

##### value

[`ABIValue`](../type-aliases/ABIValue.md)

The value to encode

#### Returns

`Uint8Array`

The encoded bytes

#### Throws

If the value cannot be encoded as this type

#### Overrides

[`ABIType`](ABIType.md).[`encode`](ABIType.md#encode)

***

### equals()

> **equals**(`other`): `boolean`

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:693](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L693)
=======
Defined in: [packages/abi/src/abi-type.ts:696](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L696)
>>>>>>> docs/fix-reference-warnings

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

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:697](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L697)
=======
Defined in: [packages/abi/src/abi-type.ts:700](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L700)
>>>>>>> docs/fix-reference-warnings

Checks if this ABI type is dynamic (variable-length).

#### Returns

`boolean`

True if the type is dynamic, false otherwise

#### Overrides

[`ABIType`](ABIType.md).[`isDynamic`](ABIType.md#isdynamic)

***

### toABITupleType()

> **toABITupleType**(`length`): [`ABITupleType`](ABITupleType.md)

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:710](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L710)
=======
Defined in: [packages/abi/src/abi-type.ts:713](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L713)
>>>>>>> docs/fix-reference-warnings

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

Defined in: [packages/abi/src/abi-type.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L57)

Returns the ARC-4 type name string representation.

#### Returns

`string`

The ARC-4 type string

#### Inherited from

[`ABIType`](ABIType.md).[`toString`](ABIType.md#tostring)

***

### from()

> `static` **from**(`str`): [`ABIType`](ABIType.md)

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L108)
=======
Defined in: [packages/abi/src/abi-type.ts:111](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L111)
>>>>>>> docs/fix-reference-warnings

Creates an ABI type from an ARC-4 type string.

#### Parameters

##### str

`string`

The ARC-4 type string (e.g., "uint256", "bool", "(uint8,address)")

#### Returns

[`ABIType`](ABIType.md)

The corresponding ABI type

<<<<<<< HEAD
=======
#### Example

```ts
// Parse ABI type strings into type objects
const uint64Type = ABIType.from('uint64')
const tupleType = ABIType.from('(uint64,string,bool)')
const arrayType = ABIType.from('uint32[]')

// Use the type name property
const typeName = uint64Type.name // 'uint64'
```

#### See

[Full working example](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.spec.ts)

>>>>>>> docs/fix-reference-warnings
#### Throws

If the type string is malformed or unsupported

#### Remarks

Supported type formats include: `uint<N>` (8-512 bits), `ufixed<N>x<M>`, `bool`, `byte`,
`address`, `string`, `<type>[<N>]` (static arrays), `<type>[]` (dynamic arrays),
and `(<type1>,<type2>,...)` (tuples). This parser is recursive for nested types.

#### Inherited from

[`ABIType`](ABIType.md).[`from`](ABIType.md#from)
