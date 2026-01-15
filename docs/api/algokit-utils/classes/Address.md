[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [algokit-utils](../README.md) / Address

# Class: Address

Defined in: [packages/common/src/address.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L46)

Represents an Algorand address

## Constructors

### Constructor

> **new Address**(`publicKey`): `Address`

Defined in: [packages/common/src/address.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L59)

Create a new Address object from its binary form.

#### Parameters

##### publicKey

`Uint8Array`

The binary form of the address. Must be 32 bytes.

#### Returns

`Address`

## Properties

### \[ADDR\_SYMBOL\]

> **\[ADDR\_SYMBOL\]**: `boolean`

Defined in: [packages/common/src/address.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L53)

**`Internal`**

***

### publicKey

> `readonly` **publicKey**: `Uint8Array`

Defined in: [packages/common/src/address.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L50)

The binary form of the address. For standard accounts, this is the public key.

## Methods

### checksum()

> **checksum**(): `Uint8Array`

Defined in: [packages/common/src/address.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L76)

Compute the 4 byte checksum of the address.

#### Returns

`Uint8Array`

***

### equals()

> **equals**(`other`): `boolean`

Defined in: [packages/common/src/address.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L69)

Check if the address is equal to another address.

#### Parameters

##### other

`Address`

#### Returns

`boolean`

***

### toString()

> **toString**(): `string`

Defined in: [packages/common/src/address.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L83)

Encode the address into a string form.

#### Returns

`string`

***

### fromString()

> `static` **fromString**(`address`): `Address`

Defined in: [packages/common/src/address.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L93)

Decode an address from a string.

#### Parameters

##### address

`string`

The address to decode. Must be 58 characters long.

#### Returns

`Address`

An Address object corresponding to the input string.

***

### zeroAddress()

> `static` **zeroAddress**(): `Address`

Defined in: [packages/common/src/address.ts:117](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L117)

Get the zero address.

#### Returns

`Address`
