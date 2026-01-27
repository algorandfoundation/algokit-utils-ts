# AlgoKit Utils Examples

This folder is the runnable source for the **Examples** section of the docs. Each file is a small, focused recipe that shows how to use AlgoKit Utils in real workflows (ABI types, algod/indexer clients, transaction building, app deployment, etc.). These files are executed locally **and** used to generate the examples documentation, so the code is intentionally clear, well‑commented, and self‑contained.

Examples are grouped by context:

- `examples/abi/` — ABI type parsing, encoding/decoding, and ARC-56/ARC-4 helpers
- `examples/algod_client/` — algod client usage and node queries
- `examples/indexer_client/` — indexer client usage (coming soon)
- `examples/kmd_client/` — kmd client usage (coming soon)
- `examples/transact/` — transaction building, signing, and app interactions

## Quick Start

Before running any example, make sure you have:

1. **Node.js 20+** installed
2. **AlgoKit CLI** installed and LocalNet running (`algokit localnet start`)
3. **Environment variables** set if you want to use a non‑LocalNet network

## How to Run an Example

You can run any file directly with `tsx`:

```bash
npx tsx examples/abi/abi-04-string-type.ts
```

Most examples use LocalNet by default, so they should work out of the box once LocalNet is running.

## Environment Setup (Optional)

If you want to point to a different network, set these environment variables:

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

## Contributing an Example

When adding a new example:

1. Create a new `.ts` file in the appropriate `examples/<context>/` folder
2. Keep it focused on one concept or workflow
3. Add clear JSDoc comments (they show up in the docs)
4. Export `main` as a named example (no default exports)
5. Verify it runs against LocalNet
