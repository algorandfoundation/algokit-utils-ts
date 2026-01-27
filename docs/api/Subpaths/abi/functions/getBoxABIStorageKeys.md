[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / getBoxABIStorageKeys

# Function: getBoxABIStorageKeys()

> **getBoxABIStorageKeys**(`contract`): `Record`\<`string`, [`ABIStorageKey`](../type-aliases/ABIStorageKey.md)\>

Defined in: [packages/abi/src/arc56-contract.ts:449](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/arc56-contract.ts#L449)

Get all box storage keys with parsed ABI types

## Parameters

### contract

[`Arc56Contract`](../type-aliases/Arc56Contract.md)

The ARC-56 contract

## Returns

`Record`\<`string`, [`ABIStorageKey`](../type-aliases/ABIStorageKey.md)\>

A record of storage key names to ABIStorageKey objects
