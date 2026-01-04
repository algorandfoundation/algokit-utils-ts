[@algorandfoundation/algokit-utils](../README.md) / [index](../modules/index.md) / Address

# Class: Address

[index](../modules/index.md).Address

Represents an Algorand address

## Table of contents

### Constructors

- [constructor](index.Address.md#constructor)

### Properties

- [[ADDR\_SYMBOL]](index.Address.md#[addr_symbol])
- [publicKey](index.Address.md#publickey)

### Methods

- [checksum](index.Address.md#checksum)
- [equals](index.Address.md#equals)
- [toString](index.Address.md#tostring)
- [fromString](index.Address.md#fromstring)
- [zeroAddress](index.Address.md#zeroaddress)

## Constructors

### constructor

• **new Address**(`publicKey`): [`Address`](index.Address.md)

Create a new Address object from its binary form.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `publicKey` | `Uint8Array` | The binary form of the address. Must be 32 bytes. |

#### Returns

[`Address`](index.Address.md)

#### Defined in

[packages/common/src/address.ts:59](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L59)

## Properties

### [ADDR\_SYMBOL]

• **[ADDR\_SYMBOL]**: `boolean`

#### Defined in

[packages/common/src/address.ts:53](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L53)

___

### publicKey

• `Readonly` **publicKey**: `Uint8Array`

The binary form of the address. For standard accounts, this is the public key.

#### Defined in

[packages/common/src/address.ts:50](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L50)

## Methods

### checksum

▸ **checksum**(): `Uint8Array`

Compute the 4 byte checksum of the address.

#### Returns

`Uint8Array`

#### Defined in

[packages/common/src/address.ts:76](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L76)

___

### equals

▸ **equals**(`other`): `boolean`

Check if the address is equal to another address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`Address`](index.Address.md) |

#### Returns

`boolean`

#### Defined in

[packages/common/src/address.ts:69](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L69)

___

### toString

▸ **toString**(): `string`

Encode the address into a string form.

#### Returns

`string`

#### Defined in

[packages/common/src/address.ts:83](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L83)

___

### fromString

▸ **fromString**(`address`): [`Address`](index.Address.md)

Decode an address from a string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address to decode. Must be 58 characters long. |

#### Returns

[`Address`](index.Address.md)

An Address object corresponding to the input string.

#### Defined in

[packages/common/src/address.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L93)

___

### zeroAddress

▸ **zeroAddress**(): [`Address`](index.Address.md)

Get the zero address.

#### Returns

[`Address`](index.Address.md)

#### Defined in

[packages/common/src/address.ts:117](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L117)
