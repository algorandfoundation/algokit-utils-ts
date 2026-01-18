[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / ABIUfixedType

# Class: ABIUfixedType

Defined in: [packages/abi/src/abi-type.ts:234](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L234)

A fixed-point number ABI type of a specific bit size and precision.

## Hierarchy

[View Summary](../../../hierarchy.md)

### Extends

- [`ABIType`](ABIType.md)

## Constructors

### Constructor

> **new ABIUfixedType**(`bitSize`, `precision`): `ABIUfixedType`

Defined in: [packages/abi/src/abi-type.ts:241](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L241)

Creates a new fixed-point type.

#### Parameters

##### bitSize

`number`

The bit size (must be a multiple of 8, between 8 and 512)

##### precision

`number`

The decimal precision (must be between 1 and 160)

#### Returns

`ABIUfixedType`

#### Throws

If bitSize or precision is out of valid range

#### Overrides

[`ABIType`](ABIType.md).[`constructor`](ABIType.md#constructor)

## Properties

### bitSize

> `readonly` **bitSize**: `number`

Defined in: [packages/abi/src/abi-type.ts:242](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L242)

The bit size (must be a multiple of 8, between 8 and 512)

***

### precision

> `readonly` **precision**: `number`

Defined in: [packages/abi/src/abi-type.ts:243](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L243)

The decimal precision (must be between 1 and 160)

## Accessors

### displayName

#### Get Signature

> **get** **displayName**(): `string`

Defined in: [packages/abi/src/abi-type.ts:49](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L49)

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

Defined in: [packages/abi/src/abi-type.ts:254](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L254)

Returns the ARC-4 type name string representation.

##### Returns

`string`

The ARC-4 type string

#### Overrides

[`ABIType`](ABIType.md).[`name`](ABIType.md#name)

## Methods

### byteLen()

> **byteLen**(): `number`

Defined in: [packages/abi/src/abi-type.ts:266](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L266)

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

> **decode**(`bytes`): [`ABIValue`](../type-aliases/ABIValue.md)

Defined in: [packages/abi/src/abi-type.ts:283](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L283)

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

#### Overrides

[`ABIType`](ABIType.md).[`decode`](ABIType.md#decode)

***

### encode()

> **encode**(`value`): `Uint8Array`

Defined in: [packages/abi/src/abi-type.ts:270](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L270)

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

Defined in: [packages/abi/src/abi-type.ts:258](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L258)

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

Defined in: [packages/abi/src/abi-type.ts:262](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/abi-type.ts#L262)

Checks if this ABI type is dynamic (variable-length).

#### Returns

`boolean`

True if the type is dynamic, false otherwise

#### Overrides

[`ABIType`](ABIType.md).[`isDynamic`](ABIType.md#isdynamic)

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
