[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Packages/Algo25](../README.md) / seedFromMnemonic

# Function: seedFromMnemonic()

> **seedFromMnemonic**(`mnemonic`): `Uint8Array`

Defined in: [packages/algo25/src/index.ts:97](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/algo25/src/index.ts#L97)

seedFromMnemonic converts a mnemonic generated using this library into the source key used to create it.
It returns an error if the passed mnemonic has an incorrect checksum, if the number of words is unexpected, or if one
of the passed words is not found in the words list.

## Parameters

### mnemonic

`string`

25 words mnemonic

## Returns

`Uint8Array`

32 bytes long seed
