[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [abi](../README.md) / ABIUintType

# Class: ABIUintType

Defined in: [packages/abi/src/abi-type.ts:171](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L171)

An unsigned integer ABI type of a specific bit size.

## Hierarchy

[View Summary](../../hierarchy.md)

### Extends

- [`ABIType`](ABIType.md)

## Constructors

### Constructor

> **new ABIUintType**(`bitSize`): `ABIUintType`

Defined in: [packages/abi/src/abi-type.ts:176](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L176)

Creates a new unsigned integer type.

#### Parameters

##### bitSize

`number`

The bit size (must be a multiple of 8, between 8 and 512)

#### Returns

`ABIUintType`

#### Overrides

[`ABIType`](ABIType.md).[`constructor`](ABIType.md#constructor)

## Properties

### bitSize

> `readonly` **bitSize**: `number`

Defined in: [packages/abi/src/abi-type.ts:176](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L176)

The bit size (must be a multiple of 8, between 8 and 512)

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

Defined in: [packages/abi/src/abi-type.ts:183](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L183)

Returns the ARC-4 type name string representation.

##### Returns

`string`

The ARC-4 type string

#### Overrides

[`ABIType`](ABIType.md).[`name`](ABIType.md#name)

## Methods

### byteLen()

> **byteLen**(): `number`

Defined in: [packages/abi/src/abi-type.ts:195](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L195)

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

Defined in: [packages/abi/src/abi-type.ts:213](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L213)

Decodes bytes according to this ABI type.

#### Parameters

##### bytes

`Uint8Array`

The bytes to decode

#### Returns

[`ABIValue`](../type-aliases/ABIValue.md)

The decoded value

#### Overrides

[`ABIType`](ABIType.md).[`decode`](ABIType.md#decode)

***

### encode()

> **encode**(`value`): `Uint8Array`

Defined in: [packages/abi/src/abi-type.ts:199](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L199)

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

Defined in: [packages/abi/src/abi-type.ts:187](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L187)

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

Defined in: [packages/abi/src/abi-type.ts:191](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L191)

Checks if this ABI type is dynamic (variable-length).

#### Returns

`boolean`

True if the type is dynamic, false otherwise

#### Overrides

[`ABIType`](ABIType.md).[`isDynamic`](ABIType.md#isdynamic)

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

Defined in: [packages/abi/src/abi-type.ts:100](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-type.ts#L100)

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
