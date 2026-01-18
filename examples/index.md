# AlgoKit Utils Examples

This section contains practical, runnable examples demonstrating how to use AlgoKit Utils for common Algorand development tasks.

## Getting Started

Before running these examples, make sure you have:

1. **Node.js 18+** installed
2. **AlgoKit CLI** installed and LocalNet running (`algokit localnet start`)
3. **Environment variables** configured (or use LocalNet defaults)

## Available Examples

### Basic Examples

- [`example.ts`](./example.ts) – Minimal placeholder demonstrating the example structure.

### Transactions

- [`transfer-algo.ts`](./transfer-algo.ts) – Transfer Algo between accounts, including:
  - Creating an AlgorandClient
  - Generating and funding test accounts
  - Sending payment transactions
  - Checking account balances

### Smart Contracts

- [`deploy-app.ts`](./deploy-app.ts) – Deploy and interact with smart contracts, including:
  - Loading ARC-56/ARC-32 app specs
  - Using AppFactory for idempotent deployments
  - Calling ABI methods on contracts
  - Connecting to existing apps by ID

## Running Examples

Each example exports async functions that can be imported and executed:

```typescript
import { transferAlgoExample } from './transfer-algo'

// Make sure LocalNet is running
await transferAlgoExample()
```

## Environment Setup

For LocalNet (default), no configuration is needed. For other networks, set these environment variables:

```bash
# Algod configuration
export ALGOD_SERVER="https://mainnet-api.algonode.cloud"
export ALGOD_PORT=""
export ALGOD_TOKEN=""

# Optional: Indexer configuration
export INDEXER_SERVER="https://mainnet-idx.algonode.cloud"
export INDEXER_PORT=""
export INDEXER_TOKEN=""
```

## Contributing Examples

Want to add an example? Follow these guidelines:

1. Create a new `.ts` file in the `examples/` folder
2. Add comprehensive JSDoc comments explaining the example
3. Export named functions (not default exports)
4. Update this README to include your example
5. Test with LocalNet before submitting
