[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / ABIType

# Abstract Class: ABIType

Defined in: [packages/abi/src/abi-type.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L38)

Represents an Algorand ABI type for encoding and decoding values as defined in [ARC-0004](https://arc.algorand.foundation/ARCs/arc-0004#types).

This is the abstract base class for all ABI types.

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extended by

- [`ABIAddressType`](ABIAddressType.md)
- [`ABIArrayDynamicType`](ABIArrayDynamicType.md)
- [`ABIArrayStaticType`](ABIArrayStaticType.md)
- [`ABIBoolType`](ABIBoolType.md)
- [`ABIByteType`](ABIByteType.md)
- [`ABIStringType`](ABIStringType.md)
- [`ABIStructType`](ABIStructType.md)
- [`ABITupleType`](ABITupleType.md)
- [`ABIUfixedType`](ABIUfixedType.md)
- [`ABIUintType`](ABIUintType.md)

## Constructors

### Constructor

> **new ABIType**(): `ABIType`

#### Returns

`ABIType`

## Accessors

### displayName

#### Get Signature

> **get** **displayName**(): `string`

Defined in: [packages/abi/src/abi-type.ts:49](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L49)

Returns a user-friendly display name for this type.

##### Returns

`string`

The display name for this type

***

### name

#### Get Signature

> **get** `abstract` **name**(): `string`

Defined in: [packages/abi/src/abi-type.ts:43](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L43)

Returns the ARC-4 type name string representation.

##### Returns

`string`

The ARC-4 type string

## Methods

### byteLen()

> `abstract` **byteLen**(): `number`

Defined in: [packages/abi/src/abi-type.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L79)

Gets the byte length of the encoded type for static types.

#### Returns

`number`

The number of bytes needed to encode this type

#### Throws

Error if the type is dynamic

***

### decode()

> `abstract` **decode**(`bytes`): [`ABIValue`](../type-aliases/ABIValue.md)

Defined in: [packages/abi/src/abi-type.ts:95](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L95)

Decodes bytes according to this ABI type.

#### Parameters

##### bytes

`Uint8Array`

The bytes to decode

#### Returns

[`ABIValue`](../type-aliases/ABIValue.md)

The decoded value

#### Throws

If the bytes cannot be decoded as this type

***

### encode()

> `abstract` **encode**(`value`): `Uint8Array`

Defined in: [packages/abi/src/abi-type.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L87)

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

***

### equals()

> `abstract` **equals**(`other`): `boolean`

Defined in: [packages/abi/src/abi-type.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L66)

Checks if this ABI type is equal to another.

#### Parameters

##### other

`ABIType`

The other ABI type to compare with

#### Returns

`boolean`

True if the types are equal, false otherwise

***

### isDynamic()

> `abstract` **isDynamic**(): `boolean`

Defined in: [packages/abi/src/abi-type.ts:72](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L72)

Checks if this ABI type is dynamic (variable-length).

#### Returns

`boolean`

True if the type is dynamic, false otherwise

***

### toString()

> **toString**(): `string`

Defined in: [packages/abi/src/abi-type.ts:57](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L57)

Returns the ARC-4 type name string representation.

#### Returns

`string`

The ARC-4 type string

***

### from()

> `static` **from**(`str`): `ABIType`

Defined in: [packages/abi/src/abi-type.ts:108](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L108)

Creates an ABI type from an ARC-4 type string.

#### Parameters

##### str

`string`

The ARC-4 type string (e.g., "uint256", "bool", "(uint8,address)")

#### Returns

`ABIType`

The corresponding ABI type

#### Throws

If the type string is malformed or unsupported

#### Remarks

Supported type formats include: `uint<N>` (8-512 bits), `ufixed<N>x<M>`, `bool`, `byte`,
`address`, `string`, `<type>[<N>]` (static arrays), `<type>[]` (dynamic arrays),
and `(<type1>,<type2>,...)` (tuples). This parser is recursive for nested types.
