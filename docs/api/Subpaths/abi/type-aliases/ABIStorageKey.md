[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / ABIStorageKey

# Type Alias: ABIStorageKey

> **ABIStorageKey** = `object`

Defined in: [packages/abi/src/arc56-contract.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/arc56-contract.ts#L8)

Describes a single key in app storage with parsed ABI types

## Properties

### desc?

> `optional` **desc**: `string`

Defined in: [packages/abi/src/arc56-contract.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/arc56-contract.ts#L16)

Description of what this storage key holds

***

### key

> **key**: `string`

Defined in: [packages/abi/src/arc56-contract.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/arc56-contract.ts#L10)

The bytes of the key encoded as base64

***

### keyType

> **keyType**: [`ABIType`](../classes/ABIType.md) \| [`AVMType`](AVMType.md)

Defined in: [packages/abi/src/arc56-contract.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/arc56-contract.ts#L12)

The parsed type of the key (ABI type or AVM type)

***

### valueType

> **valueType**: [`ABIType`](../classes/ABIType.md) \| [`AVMType`](AVMType.md)

Defined in: [packages/abi/src/arc56-contract.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/decoupling/packages/abi/src/arc56-contract.ts#L14)

The parsed type of the value (ABI type or AVM type)
