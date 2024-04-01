[@algorandfoundation/algokit-utils](../README.md) / [types/testing](../modules/types_testing.md) / AlgoKitLogCaptureFixture

# Interface: AlgoKitLogCaptureFixture

[types/testing](../modules/types_testing.md).AlgoKitLogCaptureFixture

## Table of contents

### Properties

- [afterEach](types_testing.AlgoKitLogCaptureFixture.md#aftereach)
- [beforeEach](types_testing.AlgoKitLogCaptureFixture.md#beforeeach)

### Accessors

- [testLogger](types_testing.AlgoKitLogCaptureFixture.md#testlogger)

## Properties

### afterEach

• **afterEach**: () => `void`

Testing framework agnostic handler method to run after each test to reset the logger.

#### Type declaration

▸ (): `void`

Testing framework agnostic handler method to run after each test to reset the logger.

##### Returns

`void`

#### Defined in

[src/types/testing.ts:107](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L107)

___

### beforeEach

• **beforeEach**: () => `void`

Testing framework agnostic handler method to run before each test to prepare the `testLogger` for that test.

#### Type declaration

▸ (): `void`

Testing framework agnostic handler method to run before each test to prepare the `testLogger` for that test.

##### Returns

`void`

#### Defined in

[src/types/testing.ts:103](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L103)

## Accessors

### testLogger

• `get` **testLogger**(): [`TestLogger`](../classes/testing.TestLogger.md)

The test logger instance for the current test

#### Returns

[`TestLogger`](../classes/testing.TestLogger.md)

#### Defined in

[src/types/testing.ts:99](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L99)
