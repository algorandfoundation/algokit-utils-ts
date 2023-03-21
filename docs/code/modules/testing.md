[@algorandfoundation/algokit-utils](../README.md) / testing

# Module: testing

## Table of contents

### Classes

- [TestLogger](../classes/testing.TestLogger.md)
- [TransactionLogger](../classes/testing.TransactionLogger.md)

### Functions

- [algoKitLogCaptureFixture](testing.md#algokitlogcapturefixture)
- [algorandFixture](testing.md#algorandfixture)
- [getTestAccount](testing.md#gettestaccount)
- [runWhenIndexerCaughtUp](testing.md#runwhenindexercaughtup)

## Functions

### algoKitLogCaptureFixture

▸ **algoKitLogCaptureFixture**(): [`AlgoKitLogCaptureFixture`](../interfaces/types_testing.AlgoKitLogCaptureFixture.md)

Creates a test fixture for capturing AlgoKit logs.

**`Example`**

```typescript
const logs = algoKitLogCaptureFixture()

beforeEach(logs.beforeEach)
afterEach(logs.afterEach)

test('My test', () => {
    const capturedLogs = logs.testLogger.capturedLogs
})
```

#### Returns

[`AlgoKitLogCaptureFixture`](../interfaces/types_testing.AlgoKitLogCaptureFixture.md)

The fixture

#### Defined in

[testing/fixtures/algokit-log-capture-fixture.ts:21](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/fixtures/algokit-log-capture-fixture.ts#L21)

___

### algorandFixture

▸ **algorandFixture**(`fixtureConfig?`): [`AlgorandFixture`](../interfaces/types_testing.AlgorandFixture.md)

Creates a test fixture for automated testing against Algorand.
By default it tests against a default LocalNet instance, but you can pass in an algod and indexer if you want to test against, say, TestNet.

**`Example`**

```typescript
const algorand = algorandFixture()

beforeEach(algorand.beforeEach)

test('My test', () => {
    const {algod, indexer, testAccount, ...} = algorand.context
})
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fixtureConfig?` | [`AlgorandFixtureConfig`](../interfaces/types_testing.AlgorandFixtureConfig.md) | The fixture configuration |

#### Returns

[`AlgorandFixture`](../interfaces/types_testing.AlgorandFixture.md)

The fixture

#### Defined in

[testing/fixtures/algorand-fixture.ts:22](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/fixtures/algorand-fixture.ts#L22)

___

### getTestAccount

▸ **getTestAccount**(`param0`, `algod`, `kmd?`): `Promise`<`Account`\>

Creates an ephemeral Algorand account for the purposes of testing.
Returns a newly created random test account that is funded from the dispenser

**`See`**

 - DO NOT USE THIS TO CREATE A MAINNET ACCOUNT!
Note: By default this will log the mnemonic of the account.
 - 

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `param0` | [`GetTestAccountParams`](../interfaces/types_testing.GetTestAccountParams.md) | The config for the test account to generate |
| `algod` | `default` | An algod client |
| `kmd?` | `default` | A KMD client, if not specified then a default KMD client will be loaded from environment variables |

#### Returns

`Promise`<`Account`\>

The account, with private key loaded

#### Defined in

[testing/account.ts:17](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/account.ts#L17)

___

### runWhenIndexerCaughtUp

▸ **runWhenIndexerCaughtUp**<`T`\>(`run`): `Promise`<`T`\>

Runs the given indexer call until a 404 error is no longer returned.
Tried every 200ms up to 20 times.
Very rudimentary implementation designed for automated testing.

**`Example`**

```typescript
const transaction = await runWhenIndexerCaughtUp(() => indexer.lookupTransactionByID(txnId).do())
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `run` | () => `Promise`<`T`\> | The code to run |

#### Returns

`Promise`<`T`\>

The result (as a promise), or throws if the indexer didn't catch up in time

#### Defined in

[testing/indexer.ts:11](https://github.com/algorandfoundation/algokit-utils-ts/blob/main/src/testing/indexer.ts#L11)
