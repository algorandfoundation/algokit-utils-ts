# AlgoKit Utils Examples

This directory contains 146 comprehensive examples demonstrating how to use [@algorandfoundation/algokit-utils](https://github.com/algorandfoundation/algokit-utils-ts).

## Quick Start

```bash
# Install dependencies (one time)
npm install

# Run any example
npm run example ./01-abi-methods-with-default-arguments.ts

# Or use tsx directly
npx tsx ./107-deploy-new-algorand-application.ts
```

## Structure

All examples are TypeScript files located in this directory:
- **`XX-example-name.ts`** - Self-contained executable examples
- **`artifacts/`** - Centralized directory containing shared smart contract artifacts
- **`package.json`** - Consolidated dependencies for all examples

## Example Categories

### Account Management
- 07-automated-account-funding-using-environment-dispenser
- 08-automatically-fund-new-accounts
- 13-configure-accounts-using-environment-variables-with-priority
- 38-create-and-retrieve-accounts-from-environment
- 64-rekey-an-account-to-another-account
- 65-rekey-an-algorand-account

### Asset (ASA) Operations
- 02-asa-transfer-error-handling
- 05-asset-opt-in---creating-and-opting-into-an-asa
- 06-asset-opt-in-single-asset
- 35-create-an-algorand-standard-asset-asa
- 71-single-asset-opt-in-and-opt-out
- 76-transfer-asa-between-accounts
- 86-asa-clawback-and-asset-revocation
- 88-asset-opt-out-bulk-operations
- 94-bulk-asset-opt-in-multiple-assets

### Application (Smart Contract) Deployment
- 30-create-application-with-abi-method
- 33-create-an-algorand-application
- 36-create-and-call-application-methods
- 46-deploy-application-with-abi-create-method
- 47-deploy-application-with-abi-create-method
- 48-deploy-application-with-version-tracking
- 49-deploy-immutable-and-permanent-application
- 61-idempotent-application-deployment
- 107-deploy-new-algorand-application
- 117-idempotent-app-deployment

### Application Updates & Deletion
- 39-create-and-update-application-with-abi-methods
- 44-delete-application-using-abi-method
- 66-replace-an-existing-application
- 77-update-application-using-abi-method
- 79-update-an-existing-application-with-new-code
- 124-replace-app-with-schema-breaking-changes
- 125-replace-application-with-custom-abi-methods
- 131-update-application-with-abi-update-method

### ABI Methods
- 01-abi-methods-with-default-arguments
- 10-call-abi-methods-with-default-arguments
- 83-abi-method-calls-with-default-arguments-from-state
- 84-abi-methods-with-default-arguments-from-various-sources
- 96-call-abi-method-with-foreign-references
- 97-call-abi-method-with-transaction-as-argument
- 120-pass-transaction-as-abi-method-argument

### Debugging & Error Handling
- 40-custom-error-transformers-for-transaction-errors
- 85-arc56-error-debugging-without-source-maps
- 103-debug-smart-contract-logic-errors
- 104-debug-teal-logic-errors-with-enhanced-error-messages
- 108-export-and-import-source-maps-for-debugging
- 137-arc56-error-handling-in-smart-contract-applications

### Box Storage
- 23-construct-application-call-transaction-with-box-references
- 24-construct-transaction-with-box-references
- 67-retrieve-box-storage-as-map-with-prefix
- 68-retrieve-value-from-box-map-by-key

### Atomic Transactions
- 91-atomic-transaction-group-with-abi-method-call
- 92-atomic-transaction-group-with-payment-and-app-call
- 118-multi-account-transaction-groups-with-different-signers
- 119-nested-method-calls---method-call-as-argument
- 134-use-custom-signers-in-atomic-transaction-groups
- 140-multiple-layers-of-nested-app-calls

### Network Configuration
- 17-connect-to-algorand-networks-using-algonode
- 18-connect-to-localnet-clients-algod-indexer-kmd
- 19-connect-to-localnet-for-development
- 20-connect-to-mainnet-indexer-using-algonode
- 21-connect-to-mainnet-using-algonode
- 22-connect-to-testnet-using-algonode-configuration

### AlgoAmount Utilities
- 27-create-algo-amounts-with-fluent-syntax
- 28-create-algoamount-using-number-prototype-extension
- 53-format-algoamount-values-as-strings
- 80-working-with-algo-and-microalgo-amounts
- 81-working-with-algoamount-formatting-and-conversion

### Advanced Topics
- 11-clone-app-client-with-custom-name
- 12-clone-app-client-with-different-configuration
- 15-configure-debug-mode-and-emit-async-events
- 75-transaction-lease-idempotency
- 102-custom-transaction-signer-for-group-signing
- 129-simulate-transaction-group-before-sending

## Dependencies

All examples share these dependencies:

```json
{
  "dependencies": {
    "@algorandfoundation/algokit-utils": "^9.1.2",
    "algosdk": "^3.5.2",
    "uuid": "^11.0.3"
  },
  "devDependencies": {
    "@types/node": "^24.10.1",
    "@types/uuid": "^10.0.0",
    "tsx": "^4.7.0"
  }
}
```

## Artifacts

Shared artifacts (smart contracts, app specs) are stored in the centralized `artifacts/` directory:

- **TestingApp.json** - Main testing application
- **TestingApp/client.ts** - Generated TypeScript client
- **ReplaceApp.json** - Replace application contract
- **StateExample.json** - State example application contract
- **StateExample-approval.teal** - State example approval program
- **arc56_app.json** - ARC-56 application for error debugging
- **clear.teal** - Shared clear state program

Examples reference these directly using relative paths like `'./artifacts/TestingApp.json'` or using `path.join(__dirname, 'artifacts/...')`.

## Environment Setup

Most examples require LocalNet to be running. Use AlgoKit to start it:

```bash
algokit localnet start
```

Some examples may need environment variables. Set them before running:

```bash
export ALGOD_TOKEN="your-token"
export ALGOD_SERVER="http://localhost"
export ALGOD_PORT="4001"
```

## Running Examples

### Individual Example

```bash
npm run example ./01-abi-methods-with-default-arguments.ts
```

### With Environment Variables

```bash
# Set environment variables as needed
export ALGOD_TOKEN="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
npm run example ./01-abi-methods-with-default-arguments.ts
```

### Multiple Examples

```bash
for example in 01-*.ts 02-*.ts 03-*.ts; do
  echo "Running $example"
  npm run example ./$example
done
```

## Contributing

When adding a new example:

1. Create the TypeScript file in the examples directory:
   ```bash
   touch examples/999-my-new-example.ts
   ```

2. Write your example code with proper imports from the centralized artifacts:
   ```typescript
   import { AlgorandClient } from '@algorandfoundation/algokit-utils'
   import appSpec from './artifacts/TestingApp.json'

   /**
    * Example: My New Example
    *
    * Description of what this example demonstrates.
    */
   async function myNewExample() {
     const algorand = AlgorandClient.testNet()
     // Your example code
   }

   myNewExample().catch(console.error)
   ```

3. For JSON artifacts, use direct imports (preferred):
   ```typescript
   import appSpec from './artifacts/TestingApp.json'
   ```

   For non-JSON files (like `.teal` files), use `path.join(__dirname, 'artifacts/...')`:
   ```typescript
   import { readFile } from 'fs/promises'
   import path from 'path'
   import { fileURLToPath } from 'url'

   const __filename = fileURLToPath(import.meta.url)
   const __dirname = path.dirname(__filename)

   const approvalTeal = await readFile(path.join(__dirname, 'artifacts/approval.teal'), 'utf-8')
   ```

4. Test your example:
   ```bash
   npm run example ./999-my-new-example.ts
   ```

## Documentation

Each example file contains inline documentation explaining:
- What the example demonstrates
- Key concepts and APIs used
- Step-by-step comments throughout the code

## Support

- [AlgoKit Utils](https://github.com/algorandfoundation/algokit-utils-ts)
- [Algorand Developer Portal](https://developer.algorand.org/)
- [AlgoKit CLI](https://github.com/algorandfoundation/algokit-cli)

## License

See the main repository's LICENSE file.
