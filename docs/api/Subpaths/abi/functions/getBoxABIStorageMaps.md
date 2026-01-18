[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / getBoxABIStorageMaps

# Function: getBoxABIStorageMaps()

> **getBoxABIStorageMaps**(`contract`): `Record`\<`string`, [`ABIStorageMap`](../type-aliases/ABIStorageMap.md)\>

Defined in: [packages/abi/src/arc56-contract.ts:533](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/arc56-contract.ts#L533)

Get all box storage maps with parsed ABI types

## Parameters

### contract

[`Arc56Contract`](../type-aliases/Arc56Contract.md)

The ARC-56 contract

## Returns

`Record`\<`string`, [`ABIStorageMap`](../type-aliases/ABIStorageMap.md)\>

A record of storage map names to ABIStorageMap objects
