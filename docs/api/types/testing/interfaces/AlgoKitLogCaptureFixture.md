[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../modules.md) / [types/testing](../README.md) / AlgoKitLogCaptureFixture

# Interface: AlgoKitLogCaptureFixture

Defined in: [src/types/testing.ts:151](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/testing.ts#L151)

## Properties

### afterEach()

> **afterEach**: () => `void`

Defined in: [src/types/testing.ts:161](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/testing.ts#L161)

Testing framework agnostic handler method to run after each test to reset the logger.

#### Returns

`void`

***

### beforeEach()

> **beforeEach**: () => `void`

Defined in: [src/types/testing.ts:157](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/testing.ts#L157)

Testing framework agnostic handler method to run before each test to prepare the `testLogger` for that test.

#### Returns

`void`

## Accessors

### testLogger

#### Get Signature

> **get** **testLogger**(): [`TestLogger`](../../../Subpaths/testing/classes/TestLogger.md)

Defined in: [src/types/testing.ts:153](https://github.com/p2arthur/algokit-utils-ts-fork/blob/main/src/types/testing.ts#L153)

The test logger instance for the current test

##### Returns

[`TestLogger`](../../../Subpaths/testing/classes/TestLogger.md)
