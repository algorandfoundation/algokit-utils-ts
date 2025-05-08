[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/logic-error](../README.md) / LogicError

# Class: LogicError

Defined in: [src/types/logic-error.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L22)

Wraps key functionality around processing logic errors

## Extends

- `Error`

## Constructors

### Constructor

> **new LogicError**(`errorDetails`, `program`, `getLineForPc`): `LogicError`

Defined in: [src/types/logic-error.ts:56](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L56)

Create a new logic error object.

#### Parameters

##### errorDetails

[`LogicErrorDetails`](../interfaces/LogicErrorDetails.md)

The details of the logic error

##### program

`string`[]

The TEAL source code, split by line

##### getLineForPc

(`pc`) => `undefined` \| `number`

The source map of the TEAL source code

#### Returns

`LogicError`

#### Overrides

`Error.constructor`

## Properties

### cause?

> `optional` **cause**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:26

#### Inherited from

`Error.cause`

***

### led

> **led**: [`LogicErrorDetails`](../interfaces/LogicErrorDetails.md)

Defined in: [src/types/logic-error.ts:44](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L44)

***

### lines

> **lines**: `number` = `5`

Defined in: [src/types/logic-error.ts:46](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L46)

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

***

### program

> **program**: `string`[]

Defined in: [src/types/logic-error.ts:45](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L45)

***

### stack?

> `optional` **stack**: `string`

Defined in: [src/types/logic-error.ts:48](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L48)

#### Overrides

`Error.stack`

***

### teal\_line

> **teal\_line**: `number` = `0`

Defined in: [src/types/logic-error.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L47)

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/@types/node/globals.d.ts:28

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/@types/node/globals.d.ts:30

#### Inherited from

`Error.stackTraceLimit`

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/@types/node/globals.d.ts:21

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`

***

### parseLogicError()

> `static` **parseLogicError**(`error`): `undefined` \| [`LogicErrorDetails`](../interfaces/LogicErrorDetails.md)

Defined in: [src/types/logic-error.ts:28](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/logic-error.ts#L28)

Takes an error message and parses out the details of any logic errors in there.

#### Parameters

##### error

`any`

The error message to parse

#### Returns

`undefined` \| [`LogicErrorDetails`](../interfaces/LogicErrorDetails.md)

The logic error details if any, or undefined
