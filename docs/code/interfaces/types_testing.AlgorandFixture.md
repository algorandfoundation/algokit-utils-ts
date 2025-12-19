[@algorandfoundation/algokit-utils](../README.md) / [types/testing](../modules/types_testing.md) / AlgorandFixture

# Interface: AlgorandFixture

[types/testing](../modules/types_testing.md).AlgorandFixture

An Algorand automated testing fixture

## Table of contents

### Properties

- [beforeEach](types_testing.AlgorandFixture.md#beforeeach)
- [newScope](types_testing.AlgorandFixture.md#newscope)

### Accessors

- [algorand](types_testing.AlgorandFixture.md#algorand)
- [context](types_testing.AlgorandFixture.md#context)

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

[src/types/testing.ts:122](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L122)

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

[src/types/testing.ts:162](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L162)

## Accessors

### algorand

• `get` **algorand**(): [`AlgorandClient`](../classes/types_algorand_client.AlgorandClient.md)

Retrieve an `AlgorandClient` loaded with the current context, including testAccount and any generated accounts loaded as signers.

#### Returns

[`AlgorandClient`](../classes/types_algorand_client.AlgorandClient.md)

#### Defined in

[src/types/testing.ts:116](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L116)

___

### context

• `get` **context**(): [`AlgorandTestAutomationContext`](types_testing.AlgorandTestAutomationContext.md)

Retrieve the current context.
Useful with destructuring.

If you haven't called `newScope` then this will throw an error.

#### Returns

[`AlgorandTestAutomationContext`](types_testing.AlgorandTestAutomationContext.md)

**`Example`**

```typescript
test('My test', () => {
    const {algod, indexer, testAccount, ...} = fixture.context
})
```

#### Defined in

[src/types/testing.ts:111](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L111)
