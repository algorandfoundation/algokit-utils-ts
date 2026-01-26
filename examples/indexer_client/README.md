# Indexer Client Examples

This directory contains examples demonstrating how to use `@algorandfoundation/algokit-utils` for interacting with the Algorand blockchain via the indexer client.

## Prerequisites

- Node.js >= 20.0
- AlgoKit LocalNet running (or access to a network)
- Built algokit-utils-ts package in `../../dist`

## Setup

```bash
# From the examples/indexer_client directory
npm install
```

## Running Examples

Each example can be run with `npx tsx`:

```bash
npx tsx <example-name>.ts
```

## Shared Utilities

The `shared/` directory contains common utilities used across examples:

### constants.ts

Configuration constants for LocalNet connections:
- `INDEXER_CONFIG` - Indexer client configuration (localhost:8980)
- `ALGOD_CONFIG` - Algod client configuration (localhost:4001)
- `KMD_CONFIG` - KMD client configuration (localhost:4002)

### utils.ts

Helper functions for examples:

**Console Output:**
- `printHeader(title)` - Print a section header
- `printStep(step, description)` - Print a numbered step
- `printInfo(message)` - Print informational message
- `printSuccess(message)` - Print success message
- `printError(message)` - Print error message

**Formatting:**
- `formatAlgo(amount)` - Format AlgoAmount to readable string
- `formatMicroAlgo(microAlgo)` - Format microAlgo to readable string
- `shortenAddress(address)` - Shorten address for display

**Client Creation:**
- `createIndexerClient()` - Create Indexer client for LocalNet
- `createAlgodClient()` - Create Algod client for LocalNet
- `createAlgorandClient()` - Create AlgorandClient for LocalNet

**Account Helpers:**
- `getFundedAccount(algorand)` - Get the dispenser account
- `createRandomAccount(algorand, fundingAmount?)` - Create and fund a random account

## Examples Overview

Examples are organized to demonstrate various indexer client capabilities:

1. **Health & Status** - Indexer health checks and synchronization status
2. **Account Queries** - Looking up account information and history
3. **Transaction Search** - Searching and filtering transactions
4. **Asset Queries** - Querying asset information and holdings
5. **Application Queries** - Looking up application state and history

## TypeScript Configuration

The examples use ESM modules with NodeNext resolution. Run TypeScript type checking with:

```bash
npm run typecheck
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand Developer Portal](https://developer.algorand.org/)
- [Algorand Indexer Documentation](https://developer.algorand.org/docs/get-details/indexer/)
