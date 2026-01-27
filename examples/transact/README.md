# AlgoKit Transaction Examples

This directory contains examples demonstrating various transaction types and patterns using `@algorandfoundation/algokit-utils`.

## Prerequisites

- Node.js >= 20.0
- AlgoKit LocalNet running (`algokit localnet start`)
- The main algokit-utils-ts package built (`npm run build` in the root directory)

## Setup

```bash
# From the examples/transact directory
npm install
```

## Running Examples

Example entrypoints are now in the parent `examples` folder with `transact-` prefixes (e.g., `../transact-01-payment-transaction.ts`). Run them with `npx tsx`:

```bash
npx tsx ../transact-01-payment-transaction.ts
npx tsx ../transact-14-app-call.ts
```

## Shared Utilities

The `shared/` directory contains common utilities used across all examples:

### constants.ts

LocalNet configuration constants:

- `ALGOD_SERVER`, `ALGOD_PORT`, `ALGOD_TOKEN` - Algod client configuration
- `KMD_SERVER`, `KMD_PORT`, `KMD_TOKEN` - KMD client configuration
- `INDEXER_SERVER`, `INDEXER_PORT`, `INDEXER_TOKEN` - Indexer client configuration
- `ALGOD_CONFIG`, `KMD_CONFIG`, `INDEXER_CONFIG` - Pre-configured client config objects

### utils.ts

Utility functions:

| Function | Description |
|----------|-------------|
| `createAlgodClient()` | Creates an AlgodClient configured for LocalNet |
| `createKmdClient()` | Creates a KmdClient configured for LocalNet |
| `getFundedAccount(algorand)` | Gets the LocalNet dispenser account |
| `createRandomAccount(algorand, fundWithAlgo?)` | Creates a new random account, optionally funded |
| `waitForConfirmation(algod, txId, maxRounds?)` | Waits for a transaction to be confirmed |
| `getAccountBalance(algorand, address)` | Gets an account's balance |
| `formatAlgo(microAlgos, decimals?)` | Formats microAlgos to a readable string |
| `printHeader(title)` | Prints a formatted header |
| `printStep(step, description)` | Prints a numbered step |
| `printInfo(message)` | Prints an info message |
| `printSuccess(message)` | Prints a success message |
| `shortenAddress(address, chars?)` | Shortens an address for display |

## Example Structure

Each example follows a consistent pattern:

1. Import shared utilities and algokit-utils
2. Create an AlgorandClient connected to LocalNet
3. Get or create funded accounts
4. Demonstrate the specific transaction type
5. Print results and confirmations

## Examples (Planned)

- **Payment Transactions** - Simple Algo transfers
- **Asset Transactions** - Create, opt-in, transfer, and close ASAs
- **Application Transactions** - Deploy and interact with smart contracts
- **Atomic Transfers** - Grouped transactions
- **Multisig Transactions** - Multi-signature accounts

## Development

To verify TypeScript compiles without errors:

```bash
npx tsc --noEmit
```
