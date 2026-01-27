[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / getLocalABIStorageMap

# Function: getLocalABIStorageMap()

> **getLocalABIStorageMap**(`contract`, `mapName`): [`ABIStorageMap`](../type-aliases/ABIStorageMap.md)

Defined in: [packages/abi/src/arc56-contract.ts:479](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/arc56-contract.ts#L479)

Get a specific local storage map with parsed ABI types

## Parameters

### contract

[`Arc56Contract`](../type-aliases/Arc56Contract.md)

The ARC-56 contract

### mapName

`string`

The name of the storage map

## Returns

[`ABIStorageMap`](../type-aliases/ABIStorageMap.md)

The ABIStorageMap with parsed types

## Throws

Error if the map is not found
