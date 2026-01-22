[@algorandfoundation/algokit-utils](../README.md) / [testing](../modules/testing.md) / AlgoKitLogCaptureFixture

# Interface: AlgoKitLogCaptureFixture

[testing](../modules/testing.md).AlgoKitLogCaptureFixture

## Table of contents

### Properties

- [afterEach](testing.AlgoKitLogCaptureFixture.md#aftereach)
- [beforeEach](testing.AlgoKitLogCaptureFixture.md#beforeeach)

### Accessors

- [testLogger](testing.AlgoKitLogCaptureFixture.md#testlogger)

## Properties

### afterEach

• **afterEach**: () => `void`

Testing framework agnostic handler method to run after each test to reset the logger.

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[src/testing/types.ts:161](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L161)

___

### beforeEach

• **beforeEach**: () => `void`

Testing framework agnostic handler method to run before each test to prepare the `testLogger` for that test.

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

[src/testing/types.ts:157](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L157)

## Accessors

### testLogger

• `get` **testLogger**(): [`TestLogger`](../classes/testing.TestLogger.md)

The test logger instance for the current test

#### Returns

[`TestLogger`](../classes/testing.TestLogger.md)

#### Defined in

[src/testing/types.ts:153](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L153)
