[**@algorandfoundation/algokit-utils**](../../README.md)

***

[@algorandfoundation/algokit-utils](../../README.md) / [testing](../README.md) / algorandFixture

# Function: algorandFixture()

## Call Signature

> **algorandFixture**(`fixtureConfig?`): [`AlgorandFixture`](../../types/testing/interfaces/AlgorandFixture.md)

Defined in: [src/testing/fixtures/algorand-fixture.ts:60](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/fixtures/algorand-fixture.ts#L60)

Creates a test fixture for automated testing against Algorand.
By default it tests against an environment variable specified client
 if the standard environment variables are specified, otherwise against
 a default LocalNet instance, but you can pass in an algod, indexer
 and/or kmd (or their respective config) if you want to test against
an explicitly defined network.

### Parameters

#### fixtureConfig?

[`AlgorandFixtureConfig`](../../types/testing/interfaces/AlgorandFixtureConfig.md)

The fixture configuration

### Returns

[`AlgorandFixture`](../../types/testing/interfaces/AlgorandFixture.md)

The fixture

### Examples

```typescript
const fixture = algorandFixture()

beforeEach(fixture.newScope, 10_000)

test('My test', async () => {
    const {algod, indexer, testAccount, ...} = fixture.context
    // test things...
})
```

```typescript
const fixture = algorandFixture()

beforeAll(fixture.newScope, 10_000)

test('My test', async () => {
    const {algod, indexer, testAccount, ...} = fixture.context
    // test things...
})
```

```typescript
const fixture = algorandFixture({
 algod: new Algodv2('localhost', 12345, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
 // ...
})

beforeEach(fixture.newScope, 10_000)

test('My test', async () => {
    const {algod, indexer, testAccount, ...} = fixture.context
    // test things...
})
```

## Call Signature

> **algorandFixture**(`fixtureConfig`, `config`): [`AlgorandFixture`](../../types/testing/interfaces/AlgorandFixture.md)

Defined in: [src/testing/fixtures/algorand-fixture.ts:75](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/fixtures/algorand-fixture.ts#L75)

### Parameters

#### fixtureConfig

The fixture configuration

`undefined` | [`AlgorandFixtureConfig`](../../types/testing/interfaces/AlgorandFixtureConfig.md)

#### config

[`AlgoConfig`](../../types/network-client/interfaces/AlgoConfig.md)

The fixture configuration

### Returns

[`AlgorandFixture`](../../types/testing/interfaces/AlgorandFixture.md)

The fixture

### Deprecated

Config can be passed in directly to fixture config now.

Creates a test fixture for automated testing against Algorand.
By default it tests against an environment variable specified client
 if the standard environment variables are specified, otherwise against
 a default LocalNet instance, but you can pass in an algod, indexer
 and/or kmd if you want to test against an explicitly defined network.
