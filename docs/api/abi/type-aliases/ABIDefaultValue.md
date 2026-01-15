[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../modules.md) / [abi](../README.md) / ABIDefaultValue

# Type Alias: ABIDefaultValue

> **ABIDefaultValue** = `object`

Defined in: [packages/abi/src/abi-method.ts:36](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L36)

## Properties

### data

> **data**: `string`

Defined in: [packages/abi/src/abi-method.ts:38](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L38)

Base64 encoded bytes, base64 ARC4 encoded uint64, or UTF-8 method selector

***

### source

> **source**: [`DefaultValueSource`](../enumerations/DefaultValueSource.md)

Defined in: [packages/abi/src/abi-method.ts:40](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L40)

Where the default value is coming from

***

### type?

> `optional` **type**: [`ABIType`](../classes/ABIType.md) \| [`AVMType`](AVMType.md)

Defined in: [packages/abi/src/abi-method.ts:42](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/packages/abi/src/abi-method.ts#L42)

How the data is encoded. This is the encoding for the data provided here, not the arg type
