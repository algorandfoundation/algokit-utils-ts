[@algorandfoundation/algokit-utils](../README.md) / [testing](../modules/testing.md) / AlgorandFixture

# Interface: AlgorandFixture

[testing](../modules/testing.md).AlgorandFixture

An Algorand automated testing fixture

## Table of contents

### Properties

- [beforeEach](testing.AlgorandFixture.md#beforeeach)
- [newScope](testing.AlgorandFixture.md#newscope)

### Accessors

- [algorand](testing.AlgorandFixture.md#algorand)
- [context](testing.AlgorandFixture.md#context)

## Properties

### beforeEach

• **beforeEach**: () => `Promise`\<`void`\>

**`Deprecated`**

Use newScope instead.
Testing framework agnostic handler method to run before each test to prepare the `context` for that test with per test isolation.

#### Type declaration

▸ (): `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### Defined in

[src/testing/types.ts:93](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L93)

___

### newScope

• **newScope**: () => `Promise`\<`void`\>

Creates a new isolated fixture scope (clean transaction logger, AlgorandClient, testAccount, etc.).

You can call this from any testing framework specific hook method to control when you want a new scope.

**`Example`**

```typescript
describe('MY MODULE', () => {
  const fixture = algorandFixture()
  beforeEach(fixture.newScope)

  test('MY TEST', async () => {
    const { algorand, testAccount } = fixture.context

    // Test stuff!
  })
})
```

**`Example`**

```typescript
describe('MY MODULE', () => {
  const fixture = algorandFixture()
  beforeAll(fixture.newScope)

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

#### Type declaration

▸ (): `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### Defined in

[src/testing/types.ts:133](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L133)

## Accessors

### algorand

• `get` **algorand**(): [`AlgorandClient`](../classes/index.AlgorandClient.md)

Retrieve an `AlgorandClient` loaded with the current context, including testAccount and any generated accounts loaded as signers.

#### Returns

[`AlgorandClient`](../classes/index.AlgorandClient.md)

#### Defined in

[src/testing/types.ts:87](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L87)

___

### context

• `get` **context**(): [`AlgorandTestAutomationContext`](testing.AlgorandTestAutomationContext.md)

Retrieve the current context.
Useful with destructuring.

If you haven't called `newScope` then this will throw an error.

#### Returns

[`AlgorandTestAutomationContext`](testing.AlgorandTestAutomationContext.md)

**`Example`**

```typescript
test('My test', () => {
    const {algod, indexer, testAccount, ...} = fixture.context
})
```

#### Defined in

[src/testing/types.ts:82](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/types.ts#L82)
