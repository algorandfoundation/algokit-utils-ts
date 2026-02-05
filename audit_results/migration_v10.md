# Migrating AlgoKit Utils v9 To v10

This guide outlines the steps required to migrate your code from AlgoKit Utils v9 to v10. Version 10 represents a major architectural shift, decoupling the library from `algosdk` and introducing a unified, fluent API via `AlgorandClient`.

This guide is divided into two sections:

- Migration Checklist: A systematic approach to the upgrade.
- Breaking Changes: Specific code transformations with "Before" and "After" examples.

## Migration Checklist

Use this checklist to work through the required changes when migrating from v9 to v10:

- Initialization: Replace manual algod and indexer client creation with `AlgorandClient`.
- Signers: Replace `Account` objects (with private keys) with `AddressWithTransactionSigner`.
- Transactions: Refactor standalone transaction functions (e.g., `transferAlgos`) to `algorand.send.[type]`.
- Naming: Update property names to use `id` instead of `index` (e.g., `assetId`, `appId`) and `txId`.
- BigInt: Ensure all monetary amounts and IDs use `bigint` (e.g., `1000n`) or `AlgoAmount`.
- App deployment: Replace direct `AppClient` instantiation with `AppFactory` for ARC-56 deployments.
- Method calls: Rename `methodArgs` to `args` and `boxes` to `boxReferences` in smart contract calls.
- Client calls: Remove `.do()` from all raw algod and indexer client calls.

## Migration Table

| Concept        | v9 Implementation       | v10 Implementation                | Notes                                  |
| :------------- | :---------------------- | :-------------------------------- | :------------------------------------- |
| Entry point    | `getAlgoClient()`       | `AlgorandClient.fromNetwork()`    | The "God Object" that manages clients. |
| Payments       | `transferAlgos()`       | `algorand.send.payment()`         | Fluent API syntax.                     |
| Asset transfer | `transferAsset()`       | `algorand.send.assetTransfer()`   | Renamed for consistency.               |
| App deployment | `appClient.deploy()`    | `appFactory.deploy()`             | Separation of factory vs instance.     |
| Identity       | `Account` (with `.sk`)  | `AddressWithTransactionSigner`    | Secret keys are no longer exposed.     |
| Funding        | `ensureFunded()`        | `algorand.account.ensureFunded()` | Moved to account manager.              |
| Wait           | `waitForConfirmation()` | Automatic / `result.confirmation` | v10 awaits confirmation by default.    |
| Raw client     | `algod.status().do()`   | `algorand.client.algod.status()`  | No more builder pattern for clients.   |

## Breaking Changes And Refactoring

### 1. The New Entry Point: AlgorandClient

In v9, you manually managed connections to algod, indexer, and kmd. In v10, `AlgorandClient` acts as a unified facade for all network interactions.

**Before - v9**

```ts
import { getAlgoClient, getAlgoIndexerClient } from '@algorandfoundation/algokit-utils'

const algod = getAlgoClient(getAlgoNodeConfig('testnet', 'algod'))
const indexer = getAlgoIndexerClient(getAlgoNodeConfig('testnet', 'indexer'))
```

**After - v10**

```ts
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

// Automatically connects to LocalNet or environment configuration
const algorand = AlgorandClient.defaultLocalNet()

// Or connect to specific networks
const testnet = AlgorandClient.testNet()
```

### 2. Accounts And Signers

The `Account` class, which held private keys (`sk`), has been removed to improve security and flexibility. v10 uses a Signer pattern: you pass the address, and `AlgorandClient` resolves the signing capability internally (e.g., via KMD, mnemonic, or environment).

**Before - v9**

```ts
import { getAccount } from '@algorandfoundation/algokit-utils'

// Account object containing private key
const sender = await getAccount({ name: 'SENDER', algod })
console.log(sender.sk)
```

**After - v10**

```ts
// Returns an AddressWithTransactionSigner
const sender = await algorand.account.fromEnvironment('SENDER')

// Use .addr to get the public key string
console.log(sender.addr)
```

**Manual Signers (Keypairs)**

If you generate random keys for testing, wrap them in a signer.

**Before - v9**

```ts
import { account } from 'algosdk'

const acct = algosdk.generateAccount()
```

**After - v10**

```ts
import { generateAddressWithSigners } from '@algorandfoundation/algokit-utils'
import nacl from 'tweetnacl'

const keys = nacl.sign.keyPair()
const acct = generateAddressWithSigners({
  ed25519Pubkey: keys.publicKey,
  rawEd25519Signer: async (bytes) => nacl.sign.detached(bytes, keys.secretKey),
})
```

### 3. Transactions: The Fluent API

Standalone functional wrappers (like `transferAlgos`) have been replaced by the `algorand.send` namespace.

**Payment (Algo Transfer)**

**Before - v9**

```ts
import { transferAlgos, algos } from '@algorandfoundation/algokit-utils'

await transferAlgos(
  {
    from: sender,
    to: receiver,
    amount: algos(5),
  },
  algod,
)
```

**After - v10**

```ts
import { AlgoAmount } from '@algorandfoundation/algokit-utils'

await algorand.send.payment({
  sender: sender.addr,
  receiver: receiver.addr,
  amount: AlgoAmount.Algos(5), // or (5).algos()
})
```

**Asset Transfer**

**Before - v9**

```ts
await transferAsset(
  {
    from: sender,
    to: receiver,
    assetID: 123,
    amount: 10,
  },
  algod,
)
```

**After - v10**

```ts
await algorand.send.assetTransfer({
  sender: sender.addr,
  receiver: receiver.addr,
  assetId: 123n, // assetID -> assetId, number -> bigint
  amount: 10n,
})
```

### 4. Smart Contracts: ARC-56 And AppFactory

v10 defaults to ARC-56 (an evolution of ARC-4). The `AppClient` responsibility has been split:

- `AppFactory`: Handles creating and deploying applications.
- `AppClient`: Handles interacting with deployed applications.

**Deployment**

**Before - v9**

```ts
const appClient = algokit.getAppClient(
  {
    resolveBy: 'creatorAndName',
    app: appSpec, // ARC-4 JSON
    sender: deployer,
    creatorAddress: deployer,
  },
  algod,
)

const app = await appClient.deploy({
  allowUpdate: true,
  deployTimeParams: { VALUE: 1 },
})
```

**After - v10**

```ts
// 1. Create the factory
const factory = algorand.client.getAppFactory({
  appSpec: arc56Spec, // ARC-56 JSON
  defaultSender: deployer.addr,
})

// 2. Deploy
const { appClient, result } = await factory.deploy({
  updatable: true,
  deployTimeParams: { VALUE: 1 },
  createParams: {
    method: 'create', // Constructor args are now strongly typed
    args: ['arg1'],
  },
})
```

**Method Calls**

Property names have been normalized for clarity.

**Before - v9**

```ts
await appClient.call({
  method: 'hello',
  methodArgs: ['world'],
  boxes: [{ appIndex: 0, name: 'box1' }],
})
```

**After - v10**

```ts
await appClient.send.call({
  method: 'hello',
  args: ['world'], // methodArgs -> args
  boxReferences: ['box1'], // boxes -> boxReferences (supports simple strings)
})
```

### 5. Naming And Type Standardizations

To align with the ecosystem, specific property names and types have been standardized.

| Feature           | v9 Name                  | v10 Name  | Type Change      |
| :---------------- | :----------------------- | :-------- | :--------------- |
| Transaction ID    | `txID`                   | `txId`    | string           |
| Asset index       | `assetIndex` / `assetID` | `assetId` | number -> bigint |
| Application index | `appIndex` / `appID`     | `appId`   | number -> bigint |
| Application call  | `applicationCall`        | `appCall` | -                |
| Payment           | `payment`                | `payment` | -                |

### 6. Atomic Groups And Simulation

In v9, constructing atomic groups often involved `assignGroupID` or manually managing the `AtomicTransactionComposer`. In v10, `AlgorandClient` provides a fluent composer API via `newGroup()`.

**Composing A Group**

You can chain multiple transactions together. The client handles assigning group IDs and signing automatically.

**Before - v9**

```ts
const composer = new algosdk.AtomicTransactionComposer();

// Add payment
composer.addTransaction({
  txn: algosdk.makePaymentTxnWithSuggestedParamsFromObject({ ... }),
  signer: sender.signer,
});

// Add app call
composer.addMethodCall({
  appID: 123,
  method: myMethod,
  methodArgs: ['arg1'],
  sender: sender.addr,
  signer: sender.signer,
  suggestedParams,
});

await composer.execute(algod, 4);
```

**After - v10**

```ts
const result = await algorand
  .newGroup()
  .addPayment({
    sender: sender.addr,
    receiver: receiver.addr,
    amount: (1).algos(),
  })
  .addAppCallMethodCall({
    appId: 123n,
    method: 'my_method',
    args: ['arg1'],
    sender: sender.addr,
  })
  .send() // Automatically groups, signs, sends, and waits
```

**Simulation**

Debugging in v9 was often separate from execution. In v10, you can switch any group from `.send()` to `.simulate()`.

```ts
const result = await algorand
  .newGroup()
  .addPayment({ ... })
  .addAppCallMethodCall({ ... })
  .simulate({ allowUnnamedResources: true });

console.log(result.simulateResponse);
```

**Summary Of Additions**

- `algorand.newGroup()`: Essential for atomic swaps.
- `.simulate()`: A DX improvement that should not be missed.

### 7. Testing Changes

If you use `algorandFixture` in your tests (e.g., with Vitest or Jest), the properties exposed by the context have changed to favor `AlgorandClient`.

**Before - v9**

```ts
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';

const localnet = algorandFixture();

beforeEach(localnet.beforeEach);

test('my test', async () => {
  const { algod, indexer, testAccount } = localnet.context;
  // logic using algod directly...
});
```

**After - v10**

```ts
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';

const localnet = algorandFixture();

beforeEach(localnet.beforeEach);

test('my test', async () => {
  const { algorand, testAccount } = localnet.context;

  // Use the fluent client in tests
  await algorand.send.payment({
    sender: testAccount.addr,
    receiver: testAccount.addr,
    amount: (1).algos(),
  });
});
```

Note: If you still need the raw algod in tests, you can access it via `algorand.client.algod`.

### 8. Removing `.do()` From Clients

The wrapped algod and indexer clients in v10 no longer use the builder pattern with `.do()`. Methods are now async and accept parameters directly.

**Before - v9**

```ts
const info = await algod.accountInformation(addr).do()
const params = await algod.getTransactionParams().do()
```

**After - v10**

```ts
const info = await algorand.client.algod.accountInformation(addr)
const params = await algorand.client.algod.transactionParams()
```
