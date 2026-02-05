# AlgoKit Utils v10 Migration Guide

AlgoKit Utils v10 represents a major architectural shift. It decouples the library from `algosdk` and introduces `AlgorandClient` as a unified, fluent entry point for all interactions.

**Key Changes At A Glance**
- No `algosdk` dependency: You no longer need to import `algosdk` for standard operations.
- Fluent API: Replaces standalone functions (e.g., `transferAlgos`) with chained methods (e.g., `algorand.send.payment`).
- ARC-56 default: `AppClient` now defaults to ARC-56 for improved type safety and debugging.
- Modular structure: Imports are streamlined and grouped by domain.

## Quick Start: The New Entry Point

In v9, you manually managed algod, indexer, and kmd clients. In v10, the `AlgorandClient` manages this lifecycle for you.

**Initialization Mapping**

| v9 (Legacy) | v10 (Recommended) |
| :-- | :-- |
| `getAlgoClient(...)` | `AlgorandClient.fromNetwork(...)` |
| `getAlgoIndexerClient(...)` | Managed internally by `AlgorandClient` |
| `getAccount(...)` | `algorand.account.fromEnvironment(...)` |

**v9 Pattern**

```ts
import { getAlgoClient, getAlgoIndexerClient } from '@algorandfoundation/algokit-utils';

const algod = getAlgoClient(config);
const indexer = getAlgoIndexerClient(config);
```

**v10 Pattern**

```ts
import { AlgorandClient } from '@algorandfoundation/algokit-utils';

// Connects to LocalNet automatically if no config is provided
const algorand = AlgorandClient.defaultLocalNet();

// Or connect to a specific network
const mainnet = AlgorandClient.mainNet();
```

## Accounts And Signers

The `Account` class and wrappers like `SigningAccount` or `MultisigAccount` are replaced by a standardized Signer pattern (`AddressWithTransactionSigner`). This decouples the private key from the logic and enables better hardware wallet and rekey support.

**Loading Accounts**

v9: `getAccount`

```ts
const account = await getAccount({ name: 'DEPLOYER', algod });
// account.sk was accessible here
```

v10: `AccountManager`

```ts
const account = await algorand.account.fromEnvironment('DEPLOYER');
// Use account.addr for references
// Use account.signer for transactions
```

**Custom Signers (Manual Keypairs)**

If you are generating keys manually (e.g., for tests), use `generateAddressWithSigners`.

```ts
import { generateAddressWithSigners } from '@algorandfoundation/algokit-utils';
import nacl from 'tweetnacl';

const keys = nacl.sign.keyPair();
const account = generateAddressWithSigners({
  address: keys.publicKey, // or use 'ed25519Pubkey'
  signer: async (txnGroup, indexes) => {
    // Implement signing logic here
    return txnGroup.map(tx => nacl.sign(tx, keys.secretKey));
  },
});
```

## Transactions: The Fluent API

Standalone functional wrappers have been moved into the `AlgorandClient` fluent interface.

**Payment (Algo Transfer)**

v9

```ts
import { transferAlgos, algos } from '@algorandfoundation/algokit-utils';

await transferAlgos({
  from: sender,
  to: receiver,
  amount: algos(5),
}, algod);
```

v10

```ts
import { AlgoAmount } from '@algorandfoundation/algokit-utils';

await algorand.send.payment({
  sender: sender.addr,
  receiver: receiver.addr,
  amount: AlgoAmount.Algos(5), // or (5).algos() if using prototypes
});
```

**Asset Transfer**

v9

```ts
await transferAsset({
  from: sender,
  to: receiver,
  assetID: 12345,
  amount: 10,
}, algod);
```

v10

```ts
await algorand.send.assetTransfer({
  sender: sender.addr,
  receiver: receiver.addr,
  assetId: 12345n, // Note: BigInt is preferred
  amount: 10n,
});
```

**Naming Note**

v10 standardizes on `id` (e.g., `assetId`, `appId`, `txId`) instead of `index` or `ID`.

## Smart Contracts: ARC-56 And AppFactory

v10 embraces ARC-56 as the default standard for application specifications. The workflow shifts from a direct `AppClient` constructor to an `AppFactory` pattern, which handles deployment and spawns clients.

**Deploying An App**

v9 (ARC-4)

```ts
const appClient = algokit.getAppClient({
  app: appSpec, // ARC-4 JSON
  resolveBy: 'creatorAndName',
  sender: deployer,
  creatorAddress: deployer,
}, algod);

const app = await appClient.deploy({
  allowUpdate: true,
  deployTimeParams: { VALUE: 1 },
});
```

v10 (ARC-56)

```ts
// 1. Create the factory
const factory = algorand.client.getAppFactory({
  appSpec: arc56Spec, // ARC-56 JSON
  defaultSender: deployer.addr,
});

// 2. Deploy using the factory
const { appClient, result } = await factory.deploy({
  updatable: true,
  deployTimeParams: { VALUE: 1 },
  // Native support for constructor method arguments
  createParams: {
    method: 'create',
    args: ['arg1'],
  },
});
```

**Calling Methods**

v9

```ts
await appClient.call({
  method: 'hello',
  methodArgs: ['world'],
  boxes: [{ appIndex: 0, name: 'box1' }],
});
```

v10

```ts
await appClient.send.call({
  method: 'hello',
  args: ['world'],
  // "boxReferences" replaces "boxes"
  boxReferences: ['box1'],
});
```

## Advanced: Native Client Access

In v9, you accessed clients via `algod.do()`. In v10, the wrapper clients provide direct, typed methods without the `.do()` builder pattern.

v9

```ts
const info = await algod.accountInformation(addr).do();
```

v10

```ts
const info = await algorand.client.algod.accountInformation(addr);
```

## Interoperability (The Bridge)

If you must maintain `algosdk` types (e.g., for legacy libraries), v10 provides converters.

```ts
import * as algosdk from 'algosdk';
import { decodeTransaction, encodeTransactionRaw } from '@algorandfoundation/algokit-utils/transact';

// algosdk -> v10
const v10Txn = decodeTransaction(algosdk.encodeMsgpack(sdkTxn));

// v10 -> algosdk
const sdkTxn = algosdk.decodeUnsignedTransaction(encodeTransactionRaw(v10Txn));
```

## AI Agent Cheat Sheet

Copy the block below into your AI coding assistant (Cursor, Windsurf, Copilot) to help it migrate your code automatically.

```md
# AlgoKit v9 to v10 Migration Rules

You are migrating TypeScript code from AlgoKit Utils v9 to v10.
v10 is a breaking change that removes `algosdk` as a public dependency and introduces `AlgorandClient`.

## Core Rules

1. **Entry Point:** Replace manual `algod`/`indexer` instantiation with `const algorand = AlgorandClient.defaultLocalNet()` (or `fromNetwork`).
2. **Accounts:** Replace `getAccount` with `algorand.account.fromEnvironment()`. The `Account` class is removed; use `AddressWithTransactionSigner`.
3. **Fluency:** Replace standalone functions (`transferAlgos`, `transferAsset`, `deployApp`) with `algorand.send.*` methods.
4. **BigInt:** v10 uses `bigint` for all monetary amounts and IDs. Ensure literals have `n` suffix (e.g. `1000n`).

## Symbol Mapping

| v9 Symbol             | v10 Equivalent                  | Context            |
| :-------------------- | :------------------------------ | :----------------- |
| `transferAlgos`       | `algorand.send.payment`         | Payments           |
| `transferAsset`       | `algorand.send.assetTransfer`   | Assets             |
| `getAppClient`        | `algorand.client.getAppFactory` | App Deployment     |
| `getAlgoClient`       | `AlgorandClient` constructor    | Setup              |
| `algosdk.Transaction` | `Transaction` (internal)        | Types              |
| `txID()`              | `txId()`                        | Naming             |
| `assetIndex`          | `assetId`                       | Naming             |
| `appIndex`            | `appId`                         | Naming             |
| `applicationCall`     | `appCall`                       | Transaction Fields |

## Code Patterns

### 1. Payment

// OLD
await transferAlgos({ from: sender, to: receiver, amount: algos(1) }, algod);
// NEW
await algorand.send.payment({ sender: sender.addr, receiver: receiver.addr, amount: (1).algos() });

### 2. App Call

// OLD
appClient.call({ method: 'my_method', methodArgs: ['arg'], boxes: ['box1'] });
// NEW
appClient.send.call({ method: 'my_method', args: ['arg'], boxReferences: ['box1'] });

### 3. Deploy

// OLD
const client = getAppClient(...); await client.deploy(...);
// NEW
const factory = algorand.client.getAppFactory(...); const { appClient } = await factory.deploy(...);

## Important

- If you see `algosdk.make...Txn`, replace with `algorand.createTransaction...`.
- If you see `.do()` on an algod request, remove `.do()` and pass params as the second argument.
```
