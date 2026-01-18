[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / ABIStructType

# Class: ABIStructType

Defined in: [packages/abi/src/abi-type.ts:742](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L742)

A struct ABI type with named fields.

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`ABIType`](ABIType.md)

## Constructors

### Constructor

> **new ABIStructType**(`structName`, `structFields`): `ABIStructType`

Defined in: [packages/abi/src/abi-type.ts:748](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L748)

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

Defined in: [packages/abi/src/abi-type.ts:750](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L750)

The fields of the struct

***

### structName

> `readonly` **structName**: `string`

Defined in: [packages/abi/src/abi-type.ts:749](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L749)

The name of the struct

## Accessors

### displayName

#### Get Signature

> **get** **displayName**(): `string`

Defined in: [packages/abi/src/abi-type.ts:760](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L760)

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

Defined in: [packages/abi/src/abi-type.ts:755](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L755)

Returns the ARC-4 type name string representation.

##### Returns

`string`

The ARC-4 type string

#### Overrides

[`ABIType`](ABIType.md).[`name`](ABIType.md#name)

## Methods

### byteLen()

> **byteLen**(): `number`

Defined in: [packages/abi/src/abi-type.ts:786](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L786)

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

Defined in: [packages/abi/src/abi-type.ts:862](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L862)

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

Defined in: [packages/abi/src/abi-type.ts:848](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L848)

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

Defined in: [packages/abi/src/abi-type.ts:764](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L764)

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

Defined in: [packages/abi/src/abi-type.ts:781](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L781)

Checks if this ABI type is dynamic (variable-length).

#### Returns

`boolean`

True if the type is dynamic, false otherwise

#### Overrides

[`ABIType`](ABIType.md).[`isDynamic`](ABIType.md#isdynamic)

***

### toABITupleType()

> **toABITupleType**(): [`ABITupleType`](ABITupleType.md)

Defined in: [packages/abi/src/abi-type.ts:795](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L795)

Converts this struct type to an equivalent tuple type.

#### Returns

[`ABITupleType`](ABITupleType.md)

The equivalent tuple type

***

### toString()

> **toString**(): `string`

Defined in: [packages/abi/src/abi-type.ts:57](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L57)

Returns the ARC-4 type name string representation.

#### Returns

`string`

The ARC-4 type string

#### Inherited from

[`ABIType`](ABIType.md).[`toString`](ABIType.md#tostring)

***

### from()

> `static` **from**(`str`): [`ABIType`](ABIType.md)

Defined in: [packages/abi/src/abi-type.ts:108](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L108)

Creates an ABI type from an ARC-4 type string.

#### Parameters

##### str

`string`

The ARC-4 type string (e.g., "uint256", "bool", "(uint8,address)")

#### Returns

[`ABIType`](ABIType.md)

The corresponding ABI type

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

Defined in: [packages/abi/src/abi-type.ts:817](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L817)

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
