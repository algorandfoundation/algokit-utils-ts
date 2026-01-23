# Algod Client Examples

This directory contains examples demonstrating how to use `@algorandfoundation/algokit-utils` for interacting with the Algorand blockchain via the algod client.

## Prerequisites

- Node.js >= 20.0
- AlgoKit LocalNet running (or access to a network)
- Built algokit-utils-ts package in `../../dist`

## Setup

```bash
# From the examples/algod_client directory
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
- `ALGOD_CONFIG` - Algod client configuration (localhost:4001)
- `KMD_CONFIG` - KMD client configuration (localhost:4002)
- `INDEXER_CONFIG` - Indexer client configuration (localhost:8980)

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
- `createAlgodClient()` - Create Algod client for LocalNet
- `createKmdClient()` - Create KMD client for LocalNet
- `createAlgorandClient()` - Create AlgorandClient for LocalNet

**Account Helpers:**
- `getFundedAccount(algorand)` - Get the dispenser account
- `createRandomAccount(algorand, fundingAmount?)` - Create and fund a random account

## Examples Overview

Examples are organized to demonstrate various algod client capabilities:

1. **Basic Operations** - Node status, health checks, versioning
2. **Account Management** - Creating, funding, and querying accounts
3. **Transaction Handling** - Building, signing, and sending transactions
4. **Asset Operations** - Creating, transferring, and managing ASAs
5. **Application Interactions** - Deploying and calling smart contracts

## TypeScript Configuration

The examples use ESM modules with NodeNext resolution. Run TypeScript type checking with:

```bash
npm run typecheck
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand Developer Portal](https://developer.algorand.org/)
