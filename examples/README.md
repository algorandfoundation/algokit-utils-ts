# AlgoKit Utils TypeScript Examples

Runnable code examples demonstrating every major feature of the `@algorandfoundation/algokit-utils` TypeScript library.

## Overview

This folder contains 120 self-contained examples organized into 10 categories. Each example is a standalone TypeScript file that demonstrates specific functionality, progressing from basic to advanced usage within each category.

## Prerequisites

- Node.js >= 20.0
- [AlgoKit LocalNet](https://github.com/algorandfoundation/algokit-cli) running (for network examples)

Some examples (marked "No LocalNet required") work with pure utility functions and don't need a running network.

## Quick Start

```bash
# Install dependencies and build the package
npm ci
npm run build

# Install examples dependencies
cd examples
npm ci

# Run a single example
npm run example transact/01-payment-transaction.ts

# Run all examples in a category
./transact/verify-all.sh

# Run all examples
./verify-all.sh
```

## Examples by Package

### ABI (`abi/`)

ABI type parsing, encoding, and decoding following the ARC-4 specification.

| File                            | Description                                                    |
| ------------------------------- | -------------------------------------------------------------- |
| `01-type-parsing.ts`            | Parse ABI type strings into type objects with `ABIType.from()` |
| `02-primitive-types.ts`         | Encode/decode uint, bool, and byte types                       |
| `03-address-type.ts`            | Encode/decode Algorand addresses (32-byte public keys)         |
| `04-string-type.ts`             | Encode/decode dynamic strings with length prefix               |
| `05-static-array.ts`            | Fixed-length arrays like `byte[32]` and `uint64[3]`            |
| `06-dynamic-array.ts`           | Variable-length arrays with head/tail encoding                 |
| `07-tuple-type.ts`              | Encode/decode tuples with mixed types                          |
| `08-struct-type.ts`             | Named structs with field metadata                              |
| `09-struct-tuple-conversion.ts` | Convert between struct objects and tuple arrays                |
| `10-bool-packing.ts`            | Efficient bool array packing (8 bools per byte)                |
| `11-abi-method.ts`              | Parse method signatures and compute 4-byte selectors           |
| `12-avm-types.ts`               | AVM-specific types (AVMBytes, AVMString, AVMUint64)            |
| `13-type-guards.ts`             | Type guard functions for argument/type categorization          |
| `14-complex-nested.ts`          | Deeply nested types combining arrays, tuples, structs          |
| `15-arc56-storage.ts`           | ARC-56 storage helpers for contract state inspection           |

### Algo25 (`algo25/`)

Mnemonic and seed conversion utilities following the Algorand 25-word mnemonic standard. No LocalNet required.

| File                           | Description                                         |
| ------------------------------ | --------------------------------------------------- |
| `01-mnemonic-from-seed.ts`     | Convert 32-byte seed to 25-word mnemonic            |
| `02-seed-from-mnemonic.ts`     | Convert 25-word mnemonic back to 32-byte seed       |
| `03-secret-key-to-mnemonic.ts` | Convert 64-byte secret key to mnemonic              |
| `04-master-derivation-key.ts`  | MDK alias functions for wallet derivation workflows |
| `05-error-handling.ts`         | Handle invalid words, checksums, and seed lengths   |

### Algod Client (`algod_client/`)

Algorand node operations and queries using the AlgodClient.

| File                         | Description                                                   |
| ---------------------------- | ------------------------------------------------------------- |
| `01-node-health-status.ts`   | Check node health with `healthCheck()`, `ready()`, `status()` |
| `02-version-genesis.ts`      | Get node version and genesis configuration                    |
| `03-ledger-supply.ts`        | Query total, online, and circulating supply                   |
| `04-account-info.ts`         | Get account balances, assets, and application state           |
| `05-transaction-params.ts`   | Get suggested params for transaction construction             |
| `06-send-transaction.ts`     | Submit transactions and wait for confirmation                 |
| `07-pending-transactions.ts` | Query pending transactions in the mempool                     |
| `08-block-data.ts`           | Retrieve block info, hash, and transaction IDs                |
| `09-asset-info.ts`           | Get asset parameters by ID                                    |
| `10-application-info.ts`     | Get application state and parameters by ID                    |
| `11-application-boxes.ts`    | Query application box storage                                 |
| `12-teal-compile.ts`         | Compile TEAL source and disassemble bytecode                  |
| `13-simulation.ts`           | Simulate transactions before submitting                       |
| `14-state-deltas.ts`         | Get ledger state changes for rounds/transactions              |
| `15-transaction-proof.ts`    | Get Merkle proofs for transaction inclusion                   |
| `16-lightblock-proof.ts`     | Get light block header proofs for state verification          |
| `17-state-proof.ts`          | Get cryptographic state proofs for cross-chain verification   |
| `18-devmode-timestamp.ts`    | Control block timestamps in DevMode                           |
| `19-sync-round.ts`           | Manage node sync round for storage optimization               |

### Algorand Client (`algorand_client/`)

High-level AlgorandClient API for simplified blockchain interactions.

| File                         | Description                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| `01-client-instantiation.ts` | Create AlgorandClient via defaultLocalNet, testNet, mainNet, fromEnvironment, fromConfig |
| `02-algo-amount.ts`          | AlgoAmount utility for safe ALGO/microALGO arithmetic and formatting                     |
| `03-signer-config.ts`        | Configure signers: setDefaultSigner, setSignerFromAccount, setSigner, getSigner, getAccount |
| `04-params-config.ts`        | Configure suggested params: validity window, caching, cache timeout                      |
| `05-account-manager.ts`      | Account management: create, import, rekey, fund, and query accounts                         |
| `06-send-payment.ts`         | Send ALGO payments with amount, note, and closeRemainderTo                               |
| `07-send-asset-ops.ts`       | ASA operations: create, config, opt-in, transfer, freeze, clawback, destroy              |
| `08-send-app-ops.ts`         | Application operations: create, update, call, opt-in, close-out, delete                  |
| `09-create-transaction.ts`   | Create unsigned transactions for inspection and custom signing workflows                 |
| `10-transaction-composer.ts` | Build atomic transaction groups with newGroup(), simulate(), send()                      |
| `11-asset-manager.ts`        | Query assets and perform bulk opt-in/opt-out operations                                  |
| `12-app-manager.ts`          | Query app info, global/local state, box storage, compile TEAL                            |
| `13-app-deployer.ts`         | Idempotent app deployment with update/replace strategies                                 |
| `14-client-manager.ts`       | Access raw algod/indexer/kmd clients and typed app clients                               |
| `15-error-transformers.ts`   | Register custom error transformers for enhanced debugging                                |
| `16-leases.ts`               | Prevent duplicate transactions using string and Uint8Array leases                           |

### Common (`common/`)

Utility functions and helpers. No LocalNet required.

| File                     | Description                                                 |
| ------------------------ | ----------------------------------------------------------- |
| `01-address-basics.ts`   | Parse, validate, and compare addresses with `Address` class |
| `02-address-encoding.ts` | Encode/decode addresses, compute application addresses      |
| `03-array-utilities.ts`  | Compare and concatenate byte arrays                         |
| `04-constants.ts`        | Protocol constants (limits, sizes, separators)              |
| `05-crypto-hash.ts`      | SHA-512/256 hashing for transaction IDs and checksums       |
| `06-logger.ts`           | Logger interface for consistent SDK logging                 |
| `07-json-bigint.ts`      | Parse/stringify JSON with BigInt support                    |
| `08-msgpack.ts`          | MessagePack encoding for transaction serialization          |
| `09-primitive-codecs.ts` | Codecs for numbers, strings, bytes, addresses               |
| `10-composite-codecs.ts` | Array, Map, and Record codecs                               |
| `11-model-codecs.ts`     | Object model codecs with field metadata                     |
| `12-sourcemap.ts`        | Map TEAL program counters to source locations               |

### Indexer Client (`indexer_client/`)

Blockchain data queries using the IndexerClient.

| File                         | Description                                     |
| ---------------------------- | ----------------------------------------------- |
| `01-health-check.ts`         | Check indexer health status                     |
| `02-account-lookup.ts`       | Lookup and search accounts                      |
| `03-account-assets.ts`       | Query account asset holdings and created assets |
| `04-account-applications.ts` | Query account app relationships and local state |
| `05-account-transactions.ts` | Get account transaction history                 |
| `06-transaction-lookup.ts`   | Lookup single transaction by ID                 |
| `07-transaction-search.ts`   | Search transactions with filters                |
| `08-asset-lookup.ts`         | Lookup and search assets                        |
| `09-asset-balances.ts`       | Get all holders of an asset                     |
| `10-asset-transactions.ts`   | Get transactions for a specific asset           |
| `11-application-lookup.ts`   | Lookup and search applications                  |
| `12-application-logs.ts`     | Query application log emissions                 |
| `13-application-boxes.ts`    | Search application box storage                  |
| `14-block-lookup.ts`         | Lookup block information                        |
| `15-block-headers.ts`        | Search block headers                            |
| `16-pagination.ts`           | Handle pagination with limit/next parameters    |

### KMD Client (`kmd_client/`)

Key Management Daemon operations for wallet and key management.

| File                             | Description                                        |
| -------------------------------- | -------------------------------------------------- |
| `01-version.ts`                  | Get KMD server version information                 |
| `02-wallet-management.ts`        | Create, list, rename, and get wallet info          |
| `03-wallet-sessions.ts`          | Manage wallet handle tokens (init, renew, release) |
| `04-key-generation.ts`           | Generate deterministic keys in a wallet            |
| `05-key-import-export.ts`        | Import external keys and export private keys       |
| `06-key-listing-deletion.ts`     | List and delete keys from a wallet                 |
| `07-master-key-export.ts`        | Export master derivation key for backup            |
| `08-multisig-setup.ts`           | Create multisig accounts with M-of-N threshold     |
| `09-multisig-management.ts`      | List, export, and delete multisig accounts         |
| `10-transaction-signing.ts`      | Sign transactions using wallet keys                |
| `11-multisig-signing.ts`         | Sign multisig transactions (partial + complete)    |
| `12-program-signing.ts`          | Create delegated logic signatures                  |
| `13-multisig-program-signing.ts` | Create delegated multisig logic signatures         |

### Signing (`signing/`)

External signing providers and keyring integration for transaction signing.

| File                         | Description                                            |
| ---------------------------- | ------------------------------------------------------ |
| `01-ed25519-from-keyring.ts` | Retrieve secrets from OS keyring and sign transactions |
| `02-hd-from-keyring.ts`     | HD wallet signing using keyring-stored secrets         |
| `03-aws-kms.ts`             | Ed25519 signing using AWS KMS                          |

### Testing (`testing/`)

Testing utilities for mock server setup and Vitest integration. No LocalNet required.

| File                            | Description                                                   |
| ------------------------------- | ------------------------------------------------------------- |
| `01-configuration-constants.ts` | Configuration constants for mock server setup                 |
| `02-test-data-constants.ts`     | Test data constants matching HAR file responses               |
| `03-health-check.ts`            | Check mock server availability with `checkServerHealth()`     |
| `04-mock-server-connection.ts`  | Connect to mock servers with `getMockServer()`                |
| `05-global-setup-factory.ts`    | Create custom Vitest global setups with `createGlobalSetup()` |
| `06-prebuilt-global-setups.ts`  | Pre-built global setups for algod, indexer, kmd               |
| `07-integration-example.ts`     | Complete integration example with all components              |

### Transact (`transact/`)

Low-level transaction construction and signing.

| File                        | Description                                      |
| --------------------------- | ------------------------------------------------ |
| `01-payment-transaction.ts` | Send ALGO between accounts                       |
| `02-payment-close.ts`       | Close account by transferring all remaining ALGO |
| `03-asset-create.ts`        | Create Algorand Standard Assets (ASA)            |
| `04-asset-transfer.ts`      | Opt-in and transfer assets between accounts      |
| `05-asset-freeze.ts`        | Freeze and unfreeze asset holdings               |
| `06-asset-clawback.ts`      | Clawback assets using clawback address           |
| `07-atomic-group.ts`        | Group transactions atomically (all-or-nothing)   |
| `08-atomic-swap.ts`         | Swap ALGO for ASA between two parties            |
| `09-single-sig.ts`          | Create ed25519 keypairs and sign transactions    |
| `10-multisig.ts`            | Create and use 2-of-3 multisig accounts          |
| `11-logic-sig.ts`           | Use logic signatures to authorize transactions   |
| `12-fee-calculation.ts`     | Estimate size and calculate transaction fees     |
| `13-encoding-decoding.ts`   | Serialize/deserialize transactions to msgpack    |
| `14-app-call.ts`            | Deploy and interact with smart contracts         |

## Shared Utilities

The `shared/` directory contains common utilities:

- **`utils.ts`** - Helper functions for output, client creation, and common operations
- **`constants.ts`** - LocalNet configuration (ports, tokens)
- **`artifacts/`** - TEAL smart contract files for testing

## Development

### Adding New Examples

1. Create a file following naming: `NN-descriptive-name.ts`
2. Add JSDoc header describing the example
3. Add to the category's `verify-all.sh` script

### Example Header Format

```typescript
/**
 * Example: [Title]
 *
 * This example demonstrates [description].
 * - Key operation 1
 * - Key operation 2
 *
 * Prerequisites:
 * - LocalNet running (or "No LocalNet required")
 */
```

### Running Tests

```bash
npm run typecheck    # Type check all examples
npm run verify-all   # Run all verification scripts
```

## License

MIT - see [LICENSE](../LICENSE) for details.
