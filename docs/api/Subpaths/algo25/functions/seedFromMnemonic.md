[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/algo25](../README.md) / seedFromMnemonic

# Function: seedFromMnemonic()

> **seedFromMnemonic**(`mnemonic`): `Uint8Array`

Defined in: [packages/algo25/src/index.ts:101](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/algo25/src/index.ts#L101)

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

## Throws

If a word is not in the wordlist

## Throws

If the mnemonic has an incorrect checksum

## Throws

If the mnemonic format is incorrect
