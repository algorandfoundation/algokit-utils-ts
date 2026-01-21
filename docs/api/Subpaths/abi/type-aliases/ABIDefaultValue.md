[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [Subpaths/abi](../README.md) / ABIDefaultValue

# Type Alias: ABIDefaultValue

> **ABIDefaultValue** = `object`

Defined in: [packages/abi/src/abi-method.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L28)

## Properties

### data

> **data**: `string`

Defined in: [packages/abi/src/abi-method.ts:30](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L30)

Base64 encoded bytes, base64 ARC4 encoded uint64, or UTF-8 method selector

***

### source

> **source**: [`DefaultValueSource`](../enumerations/DefaultValueSource.md)

Defined in: [packages/abi/src/abi-method.ts:32](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L32)

Where the default value is coming from

***

### type?

> `optional` **type**: [`ABIType`](../classes/ABIType.md) \| [`AVMType`](AVMType.md)

Defined in: [packages/abi/src/abi-method.ts:34](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L34)

How the data is encoded. This is the encoding for the data provided here, not the arg type
