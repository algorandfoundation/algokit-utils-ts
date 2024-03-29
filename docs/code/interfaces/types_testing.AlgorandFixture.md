[@algorandfoundation/algokit-utils](../README.md) / [types/testing](../modules/types_testing.md) / AlgorandFixture

# Interface: AlgorandFixture

[types/testing](../modules/types_testing.md).AlgorandFixture

An Algorand automated testing fixture

## Table of contents

### Properties

- [beforeEach](types_testing.AlgorandFixture.md#beforeeach)

### Accessors

- [context](types_testing.AlgorandFixture.md#context)

## Properties

### beforeEach

• **beforeEach**: () => `Promise`\<`void`\>

Testing framework agnostic handler method to run before each test to prepare the `context` for that test.

#### Type declaration

▸ (): `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### Defined in

[src/types/testing.ts:78](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L78)

## Accessors

### context

• `get` **context**(): [`AlgorandTestAutomationContext`](types_testing.AlgorandTestAutomationContext.md)

Retrieve the current context.
Useful with destructuring.

#### Returns

[`AlgorandTestAutomationContext`](types_testing.AlgorandTestAutomationContext.md)

**`Example`**

```typescript
test('My test', () => {
    const {algod, indexer, testAccount, ...} = algorand.context
})
```

#### Defined in

[src/types/testing.ts:73](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/types/testing.ts#L73)
