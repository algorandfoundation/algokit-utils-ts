# KMD Client Examples

This directory contains examples demonstrating how to use `@algorandfoundation/algokit-utils` for interacting with the Algorand Key Management Daemon (KMD).

## Prerequisites

- Node.js >= 20.0
- AlgoKit LocalNet running (or access to a network with KMD)
- Built algokit-utils-ts package in `../../dist`

## Setup

```bash
# From the examples/kmd_client directory
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
- `shortenAddress(address)` - Shorten address for display

**Client Creation:**
- `createKmdClient()` - Create KMD client for LocalNet
- `createAlgodClient()` - Create Algod client for LocalNet
- `createAlgorandClient()` - Create AlgorandClient for LocalNet

**Account Helpers:**
- `getFundedAccount(algorand)` - Get the dispenser account

**Test Wallet Helpers:**
- `createTestWallet(kmd, password?)` - Create a test wallet with unique name
- `cleanupTestWallet(kmd, walletHandleToken)` - Release wallet handle for cleanup

## Examples Overview

Examples are organized to demonstrate various KMD client capabilities:

1. **Wallet Management** - Creating, listing, and managing wallets
2. **Key Operations** - Generating, importing, and exporting keys
3. **Transaction Signing** - Signing transactions using KMD
4. **Multisig Operations** - Working with multisig accounts

## TypeScript Configuration

The examples use ESM modules with NodeNext resolution. Run TypeScript type checking with:

```bash
npm run typecheck
```

## Learn More

- [AlgoKit Utils Documentation](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand KMD Documentation](https://dev.algorand.co/reference/rest-apis/kmd/)
- [Algorand Developer Portal](https://developer.algorand.org/)
