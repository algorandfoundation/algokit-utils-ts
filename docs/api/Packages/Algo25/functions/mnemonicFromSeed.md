[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Packages/Algo25](../README.md) / mnemonicFromSeed

# Function: mnemonicFromSeed()

> **mnemonicFromSeed**(`seed`): `string`

Defined in: [packages/algo25/src/index.ts:51](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/algo25/src/index.ts#L51)

mnemonicFromSeed converts a 32-byte key into a 25 word mnemonic. The generated mnemonic includes a checksum.
Each word in the mnemonic represents 11 bits of data, and the last 11 bits are reserved for the checksum.

## Parameters

### seed

`Uint8Array`

32 bytes long seed

## Returns

`string`

25 words mnemonic
