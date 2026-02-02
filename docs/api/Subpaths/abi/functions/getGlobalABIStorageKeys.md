[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / getGlobalABIStorageKeys

# Function: getGlobalABIStorageKeys()

> **getGlobalABIStorageKeys**(`contract`): `Record`\<`string`, [`ABIStorageKey`](../type-aliases/ABIStorageKey.md)\>

Defined in: [packages/abi/src/arc56-contract.ts:423](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/arc56-contract.ts#L423)

Get all global storage keys with parsed ABI types

## Parameters

### contract

[`Arc56Contract`](../type-aliases/Arc56Contract.md)

The ARC-56 contract

## Returns

`Record`\<`string`, [`ABIStorageKey`](../type-aliases/ABIStorageKey.md)\>

A record of storage key names to ABIStorageKey objects
