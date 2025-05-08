[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [testing](../README.md) / algoKitLogCaptureFixture

# Variable: algoKitLogCaptureFixture()

> `const` **algoKitLogCaptureFixture**: () => [`AlgoKitLogCaptureFixture`](../../types/testing/interfaces/AlgoKitLogCaptureFixture.md)

Defined in: [src/testing/fixtures/algokit-log-capture-fixture.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/fixtures/algokit-log-capture-fixture.ts#L22)

Creates a test fixture for capturing AlgoKit logs.

## Returns

[`AlgoKitLogCaptureFixture`](../../types/testing/interfaces/AlgoKitLogCaptureFixture.md)

The fixture

## Example

```typescript
const logs = algoKitLogCaptureFixture()

beforeEach(logs.beforeEach)
afterEach(logs.afterEach)

test('My test', () => {
    const capturedLogs = logs.testLogger.capturedLogs
})
```
