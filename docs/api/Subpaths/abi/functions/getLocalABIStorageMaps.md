[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / getLocalABIStorageMaps

# Function: getLocalABIStorageMaps()

> **getLocalABIStorageMaps**(`contract`): `Record`\<`string`, [`ABIStorageMap`](../type-aliases/ABIStorageMap.md)\>

Defined in: [packages/abi/src/arc56-contract.ts:520](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/arc56-contract.ts#L520)

Get all local storage maps with parsed ABI types

## Parameters

### contract

[`Arc56Contract`](../type-aliases/Arc56Contract.md)

The ARC-56 contract

## Returns

`Record`\<`string`, [`ABIStorageMap`](../type-aliases/ABIStorageMap.md)\>

A record of storage map names to ABIStorageMap objects
