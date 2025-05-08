[**@algorandfoundation/algokit-utils**](../../../README.md)

***

[@algorandfoundation/algokit-utils](../../../README.md) / [types/testing](../README.md) / AlgorandFixture

# Interface: AlgorandFixture

Defined in: [src/types/testing.ts:66](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L66)

An Algorand automated testing fixture

## Properties

### ~~beforeEach()~~

> **beforeEach**: () => `Promise`\<`void`\>

Defined in: [src/types/testing.ts:90](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L90)

#### Returns

`Promise`\<`void`\>

#### Deprecated

Use newScope instead.
Testing framework agnostic handler method to run before each test to prepare the `context` for that test with per test isolation.

***

### newScope()

> **newScope**: () => `Promise`\<`void`\>

Defined in: [src/types/testing.ts:130](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L130)

Creates a new isolated fixture scope (clean transaction logger, AlgorandClient, testAccount, etc.).

You can call this from any testing framework specific hook method to control when you want a new scope.

#### Returns

`Promise`\<`void`\>

#### Examples

```typescript
describe('MY MODULE', () => {
  const fixture = algorandFixture()
  beforeEach(fixture.newScope, 10_000) // Add a 10s timeout to cater for occasionally slow LocalNet calls

  test('MY TEST', async () => {
    const { algorand, testAccount } = fixture.context

    // Test stuff!
  })
})
```

```typescript
describe('MY MODULE', () => {
  const fixture = algorandFixture()
  beforeAll(fixture.newScope, 10_000) // Add a 10s timeout to cater for occasionally slow LocalNet calls

  test('test1', async () => {
    const { algorand, testAccount } = fixture.context

    // Test stuff!
  })
  test('test2', async () => {
    const { algorand, testAccount } = fixture.context
    // algorand and testAccount are the same as in test1
  })
})
```

## Accessors

### algorand

#### Get Signature

> **get** **algorand**(): [`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

Defined in: [src/types/testing.ts:84](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L84)

Retrieve an `AlgorandClient` loaded with the current context, including testAccount and any generated accounts loaded as signers.

##### Returns

[`AlgorandClient`](../../algorand-client/classes/AlgorandClient.md)

***

### context

#### Get Signature

> **get** **context**(): [`AlgorandTestAutomationContext`](AlgorandTestAutomationContext.md)

Defined in: [src/types/testing.ts:79](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L79)

Retrieve the current context.
Useful with destructuring.

If you haven't called `newScope` then this will throw an error.

##### Example

```typescript
test('My test', () => {
    const {algod, indexer, testAccount, ...} = fixture.context
})
```

##### Returns

[`AlgorandTestAutomationContext`](AlgorandTestAutomationContext.md)
