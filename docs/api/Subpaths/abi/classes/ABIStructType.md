[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / ABIStructType

# Class: ABIStructType

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:742](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L742)
=======
Defined in: [packages/abi/src/abi-type.ts:745](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L745)
>>>>>>> docs/fix-reference-warnings

A struct ABI type with named fields.

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`ABIType`](ABIType.md)

## Constructors

### Constructor

> **new ABIStructType**(`structName`, `structFields`): `ABIStructType`

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:748](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L748)
=======
Defined in: [packages/abi/src/abi-type.ts:751](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L751)
>>>>>>> docs/fix-reference-warnings

Creates a new struct type.

#### Parameters

##### structName

`string`

The name of the struct

##### structFields

[`ABIStructField`](../type-aliases/ABIStructField.md)[]

The fields of the struct

#### Returns

`ABIStructType`

#### Overrides

[`ABIType`](ABIType.md).[`constructor`](ABIType.md#constructor)

## Properties

### structFields

> `readonly` **structFields**: [`ABIStructField`](../type-aliases/ABIStructField.md)[]

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:750](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L750)
=======
Defined in: [packages/abi/src/abi-type.ts:753](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L753)
>>>>>>> docs/fix-reference-warnings

The fields of the struct

***

### structName

> `readonly` **structName**: `string`

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:749](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L749)
=======
Defined in: [packages/abi/src/abi-type.ts:752](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L752)
>>>>>>> docs/fix-reference-warnings

The name of the struct

## Accessors

### displayName

#### Get Signature

> **get** **displayName**(): `string`

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:760](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L760)
=======
Defined in: [packages/abi/src/abi-type.ts:763](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L763)
>>>>>>> docs/fix-reference-warnings

Returns a user-friendly display name for this type.

##### Returns

`string`

The display name for this type

#### Overrides

[`ABIType`](ABIType.md).[`displayName`](ABIType.md#displayname)

***

### name

#### Get Signature

> **get** **name**(): `string`

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:755](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L755)
=======
Defined in: [packages/abi/src/abi-type.ts:758](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L758)
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
Defined in: [packages/abi/src/abi-type.ts:786](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L786)
=======
Defined in: [packages/abi/src/abi-type.ts:789](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L789)
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

> **decode**(`bytes`): `ABIStructValue`

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:862](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L862)
=======
Defined in: [packages/abi/src/abi-type.ts:859](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L859)
>>>>>>> docs/fix-reference-warnings

Decodes bytes according to this ABI type.

#### Parameters

##### bytes

`Uint8Array`

The bytes to decode

#### Returns

`ABIStructValue`

The decoded value

#### Throws

If the bytes cannot be decoded as this type

#### Overrides

[`ABIType`](ABIType.md).[`decode`](ABIType.md#decode)

***

### encode()

> **encode**(`value`): `Uint8Array`

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:848](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L848)
=======
Defined in: [packages/abi/src/abi-type.ts:845](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L845)
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
Defined in: [packages/abi/src/abi-type.ts:764](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L764)
=======
Defined in: [packages/abi/src/abi-type.ts:767](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L767)
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
Defined in: [packages/abi/src/abi-type.ts:781](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L781)
=======
Defined in: [packages/abi/src/abi-type.ts:784](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L784)
>>>>>>> docs/fix-reference-warnings

Checks if this ABI type is dynamic (variable-length).

#### Returns

`boolean`

True if the type is dynamic, false otherwise

#### Overrides

[`ABIType`](ABIType.md).[`isDynamic`](ABIType.md#isdynamic)

***

### toABITupleType()

> **toABITupleType**(): [`ABITupleType`](ABITupleType.md)

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:795](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L795)
=======
Defined in: [packages/abi/src/abi-type.ts:798](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L798)
>>>>>>> docs/fix-reference-warnings

Converts this struct type to an equivalent tuple type.

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

***

### fromStruct()

> `static` **fromStruct**(`structName`, `structs`): `ABIStructType`

<<<<<<< HEAD
Defined in: [packages/abi/src/abi-type.ts:817](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L817)
=======
Defined in: [packages/abi/src/abi-type.ts:820](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L820)
>>>>>>> docs/fix-reference-warnings

Creates an ABIStructType from struct name and struct definitions.

#### Parameters

##### structName

`string`

The name of the struct

##### structs

`Record`\<`string`, [`StructField`](../type-aliases/StructField.md)[]\>

A record of struct definitions

#### Returns

`ABIStructType`

The struct type

#### Throws

If the struct name is not found in the struct definitions
