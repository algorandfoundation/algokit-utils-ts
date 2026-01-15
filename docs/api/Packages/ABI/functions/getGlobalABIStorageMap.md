[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Packages/ABI](../README.md) / getGlobalABIStorageMap

# Function: getGlobalABIStorageMap()

> **getGlobalABIStorageMap**(`contract`, `mapName`): [`ABIStorageMap`](../type-aliases/ABIStorageMap.md)

Defined in: [packages/abi/src/arc56-contract.ts:464](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/arc56-contract.ts#L464)

Get a specific global storage map with parsed ABI types

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
