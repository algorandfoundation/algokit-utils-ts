[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Packages/ABI](../README.md) / getGlobalABIStorageMaps

# Function: getGlobalABIStorageMaps()

> **getGlobalABIStorageMaps**(`contract`): `Record`\<`string`, [`ABIStorageMap`](../type-aliases/ABIStorageMap.md)\>

Defined in: [packages/abi/src/arc56-contract.ts:507](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/arc56-contract.ts#L507)

Get all global storage maps with parsed ABI types

## Parameters

### contract

[`Arc56Contract`](../type-aliases/Arc56Contract.md)

The ARC-56 contract

## Returns

`Record`\<`string`, [`ABIStorageMap`](../type-aliases/ABIStorageMap.md)\>

A record of storage map names to ABIStorageMap objects
