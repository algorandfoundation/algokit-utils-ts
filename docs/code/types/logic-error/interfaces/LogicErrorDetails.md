[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/logic-error](../README.md) / LogicErrorDetails

# Interface: LogicErrorDetails

Defined in: [src/types/logic-error.ts:6](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L6)

Details about a smart contract logic error

## Properties

### desc

> **desc**: `string`

Defined in: [src/types/logic-error.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L14)

The full error description

***

### msg

> **msg**: `string`

Defined in: [src/types/logic-error.ts:12](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L12)

The error message

***

### pc

> **pc**: `number`

Defined in: [src/types/logic-error.ts:10](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L10)

The program counter where the error was

***

### traces

> **traces**: `Record`\<`string`, `unknown`\>[]

Defined in: [src/types/logic-error.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L16)

Any trace information included in the error

***

### txId

> **txId**: `string`

Defined in: [src/types/logic-error.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L8)

The ID of the transaction with the logic error
