[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Packages/ABI](../README.md) / getLocalABIStorageKey

# Function: getLocalABIStorageKey()

> **getLocalABIStorageKey**(`contract`, `keyName`): [`ABIStorageKey`](../type-aliases/ABIStorageKey.md)

Defined in: [packages/abi/src/arc56-contract.ts:395](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/arc56-contract.ts#L395)

Get a specific local storage key with parsed ABI types

## Parameters

### contract

[`Arc56Contract`](../type-aliases/Arc56Contract.md)

The ARC-56 contract

### keyName

`string`

The name of the storage key

## Returns

[`ABIStorageKey`](../type-aliases/ABIStorageKey.md)

The ABIStorageKey with parsed types

## Throws

Error if the key is not found
