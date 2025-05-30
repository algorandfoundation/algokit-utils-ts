[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [testing](../README.md) / TestLogger

# Class: TestLogger

Defined in: [src/testing/test-logger.ts:8](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/test-logger.ts#L8)

Exposes an AlgoKit logger which captures log messages, while wrapping an original logger.
This is useful for automated testing.

## Implements

- [`Logger`](../../types/logging/type-aliases/Logger.md)

## Constructors

### Constructor

> **new TestLogger**(`originalLogger?`): `TestLogger`

Defined in: [src/testing/test-logger.ts:16](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/test-logger.ts#L16)

Create a new test logger that wraps the given logger if provided.

#### Parameters

##### originalLogger?

[`Logger`](../../types/logging/type-aliases/Logger.md)

The optional original logger to wrap.

#### Returns

`TestLogger`

## Accessors

### capturedLogs

#### Get Signature

> **get** **capturedLogs**(): `string`[]

Defined in: [src/testing/test-logger.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/test-logger.ts#L22)

Returns all logs captured thus far.

##### Returns

`string`[]

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/testing/test-logger.ts:27](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/test-logger.ts#L27)

Clears all logs captured so far.

#### Returns

`void`

***

### debug()

> **debug**(`message`, ...`optionalParams`): `void`

Defined in: [src/testing/test-logger.ts:89](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/test-logger.ts#L89)

#### Parameters

##### message

`string`

##### optionalParams

...`unknown`[]

#### Returns

`void`

#### Implementation of

`Logger.debug`

***

### error()

> **error**(`message`, ...`optionalParams`): `void`

Defined in: [src/testing/test-logger.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/test-logger.ts#L73)

#### Parameters

##### message

`string`

##### optionalParams

...`unknown`[]

#### Returns

`void`

#### Implementation of

`Logger.error`

***

### getLogSnapshot()

> **getLogSnapshot**(`config?`): `string`

Defined in: [src/testing/test-logger.ts:47](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/test-logger.ts#L47)

Returns a captured log snapshot.
This helps ensure that the provided configuration items won't appear
 with random values in the log snapshot, but rather will get substituted with predictable ids.

https://jestjs.io/docs/snapshot-testing#2-tests-should-be-deterministic

#### Parameters

##### config?

[`LogSnapshotConfig`](../../types/testing/interfaces/LogSnapshotConfig.md)

The snapshot configuration

#### Returns

`string`

The snapshotted logs.

#### Example

```typescript
const logger = new TestLogger()
...
expect(logger.getLogSnapshot()).toMatchSnapshot()
```

***

### info()

> **info**(`message`, ...`optionalParams`): `void`

Defined in: [src/testing/test-logger.ts:81](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/test-logger.ts#L81)

#### Parameters

##### message

`string`

##### optionalParams

...`unknown`[]

#### Returns

`void`

#### Implementation of

`Logger.info`

***

### verbose()

> **verbose**(`message`, ...`optionalParams`): `void`

Defined in: [src/testing/test-logger.ts:85](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/test-logger.ts#L85)

#### Parameters

##### message

`string`

##### optionalParams

...`unknown`[]

#### Returns

`void`

#### Implementation of

`Logger.verbose`

***

### warn()

> **warn**(`message`, ...`optionalParams`): `void`

Defined in: [src/testing/test-logger.ts:77](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/test-logger.ts#L77)

#### Parameters

##### message

`string`

##### optionalParams

...`unknown`[]

#### Returns

`void`

#### Implementation of

`Logger.warn`
