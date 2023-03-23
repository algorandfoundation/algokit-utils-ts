[@algorandfoundation/algokit-utils](../README.md) / [types/logic-error](../modules/types_logic_error.md) / LogicError

# Class: LogicError

[types/logic-error](../modules/types_logic_error.md).LogicError

## Hierarchy

- `Error`

  ↳ **`LogicError`**

## Table of contents

### Constructors

- [constructor](types_logic_error.LogicError.md#constructor)

### Properties

- [led](types_logic_error.LogicError.md#led)
- [lines](types_logic_error.LogicError.md#lines)
- [message](types_logic_error.LogicError.md#message)
- [name](types_logic_error.LogicError.md#name)
- [program](types_logic_error.LogicError.md#program)
- [stack](types_logic_error.LogicError.md#stack)
- [teal\_line](types_logic_error.LogicError.md#teal_line)
- [prepareStackTrace](types_logic_error.LogicError.md#preparestacktrace)
- [stackTraceLimit](types_logic_error.LogicError.md#stacktracelimit)

### Methods

- [captureStackTrace](types_logic_error.LogicError.md#capturestacktrace)
- [parseLogicError](types_logic_error.LogicError.md#parselogicerror)

## Constructors

### constructor

• **new LogicError**(`led`, `program`, `map`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `led` | [`LogicErrorDetails`](../interfaces/types_logic_error.LogicErrorDetails.md) |
| `program` | `string`[] |
| `map` | `SourceMap` |

#### Overrides

Error.constructor

#### Defined in

[src/types/logic-error.ts:31](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L31)

## Properties

### led

• **led**: [`LogicErrorDetails`](../interfaces/types_logic_error.LogicErrorDetails.md)

#### Defined in

[src/types/logic-error.ts:25](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L25)

___

### lines

• **lines**: `number` = `5`

#### Defined in

[src/types/logic-error.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L27)

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1054

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1053

___

### program

• **program**: `string`[]

#### Defined in

[src/types/logic-error.ts:26](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L26)

___

### stack

• `Optional` **stack**: `string`

#### Overrides

Error.stack

#### Defined in

[src/types/logic-error.ts:29](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L29)

___

### teal\_line

• **teal\_line**: `number` = `0`

#### Defined in

[src/types/logic-error.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L28)

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4

___

### parseLogicError

▸ `Static` **parseLogicError**(`errMsg`): [`LogicErrorDetails`](../interfaces/types_logic_error.LogicErrorDetails.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `errMsg` | `string` |

#### Returns

[`LogicErrorDetails`](../interfaces/types_logic_error.LogicErrorDetails.md)

#### Defined in

[src/types/logic-error.ts:14](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L14)
