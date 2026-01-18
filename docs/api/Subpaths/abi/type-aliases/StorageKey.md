[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / StorageKey

# Type Alias: StorageKey

> **StorageKey** = `object`

Defined in: [packages/abi/src/arc56-contract.ts:263](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/arc56-contract.ts#L263)

Describes a single key in app storage

## Properties

### desc?

> `optional` **desc**: `string`

Defined in: [packages/abi/src/arc56-contract.ts:265](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/arc56-contract.ts#L265)

Description of what this storage key holds

***

### key

> **key**: `string`

Defined in: [packages/abi/src/arc56-contract.ts:272](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/arc56-contract.ts#L272)

The bytes of the key encoded as base64

***

### keyType

> **keyType**: `ABITypeName` \| [`AVMType`](AVMType.md) \| [`StructName`](StructName.md)

Defined in: [packages/abi/src/arc56-contract.ts:267](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/arc56-contract.ts#L267)

The type of the key

***

### valueType

> **valueType**: `ABITypeName` \| [`AVMType`](AVMType.md) \| [`StructName`](StructName.md)

Defined in: [packages/abi/src/arc56-contract.ts:270](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/packages/abi/src/arc56-contract.ts#L270)

The type of the value
