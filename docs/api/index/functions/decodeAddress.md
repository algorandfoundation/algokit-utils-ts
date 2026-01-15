[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [index](../README.md) / decodeAddress

# Function: decodeAddress()

> **decodeAddress**(`address`): [`Address`](../classes/Address.md)

Defined in: [packages/common/src/address.ts:193](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/common/src/address.ts#L193)

decodeAddress takes an Algorand address in string form and decodes it into a Uint8Array.

## Parameters

### address

`string`

an Algorand address with checksum.

## Returns

[`Address`](../classes/Address.md)

the decoded form of the address's public key and checksum
