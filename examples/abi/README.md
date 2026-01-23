# AlgoKit ABI Examples

This directory contains examples demonstrating ABI (Application Binary Interface) encoding and decoding using `@algorandfoundation/algokit-utils`.

## Prerequisites

- Node.js >= 20.0
- The main algokit-utils-ts package built (`npm run build` in the root directory)

## Setup

```bash
# From the examples/abi directory
npm install
```

## Running Examples

Each example can be run directly with `npx tsx`:

```bash
npx tsx <example-file>.ts
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
| `printHeader(title)` | Prints a formatted header |
| `printStep(step, description)` | Prints a numbered step |
| `printInfo(message)` | Prints an info message |
| `printSuccess(message)` | Prints a success message |
| `printError(message)` | Prints an error message |
| `formatBytes(bytes, maxPreviewBytes?)` | Formats a byte array as a readable string |
| `formatHex(bytes)` | Formats a byte array as a hex string |

## Example Structure

Each example follows a consistent pattern:

1. Import shared utilities and algokit-utils
2. Demonstrate specific ABI encoding/decoding operations
3. Print results and explanations

## Examples

- **Primitive Types** - Encoding/decoding uint, bool, byte, address
- **String and Bytes** - Variable-length string and byte arrays
- **Arrays** - Static and dynamic arrays
- **Tuples** - Composite types with multiple elements
- **Method Selectors** - Generating and using ABI method selectors
- **Transaction Arguments** - Encoding arguments for application calls

## Development

To verify TypeScript compiles without errors:

```bash
npx tsc --noEmit
```
