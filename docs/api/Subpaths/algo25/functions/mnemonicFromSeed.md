[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/algo25](../README.md) / mnemonicFromSeed

# Function: mnemonicFromSeed()

> **mnemonicFromSeed**(`seed`): `string`

Defined in: [packages/algo25/src/index.ts:52](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algo25/src/index.ts#L52)

mnemonicFromSeed converts a 32-byte key into a 25 word mnemonic. The generated mnemonic includes a checksum.
Each word in the mnemonic represents 11 bits of data, and the last 11 bits are reserved for the checksum.

## Parameters

### seed

`Uint8Array`

32 bytes long seed

## Returns

`string`

25 words mnemonic

## Throws

If seed length is not 32 bytes
