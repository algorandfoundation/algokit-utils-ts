# Use Custom Signers in Atomic Transaction Groups

Demonstrates how to use custom transaction signers to control signing behavior in atomic transaction groups, including using different signers for different transactions

## Example Details

```json
{
  "example_id": "134-use-custom-signers-in-atomic-transaction-groups",
  "title": "Use Custom Signers in Atomic Transaction Groups",
  "summary": "Demonstrates how to use custom transaction signers to control signing behavior in atomic transaction groups, including using different signers for different transactions",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "transaction management",
  "specific_use_case": "Control transaction signing in atomic groups with custom signers",
  "target_users": [
    "SDK developers",
    "Wallet developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "custom TransactionSigner",
    "transaction signing",
    "atomic transactions",
    "multi-account transactions",
    "transaction with custom signer"
  ],
  "feature_tags": [
    "transaction-signing",
    "custom-signer",
    "atomic-transactions",
    "transaction-groups",
    "multi-account",
    "abi",
    "app-client"
  ],
  "folder": "134-use-custom-signers-in-atomic-transaction-groups",
  "prerequisites": {
    "tools": [
      "algokit",
      "node",
      "npm"
    ],
    "libraries": [
      "@algorandfoundation/algokit-utils",
      "algosdk"
    ],
    "environment": [
      {
        "name": "SENDER_MNEMONIC",
        "required": true,
        "example": "your 25-word mnemonic here"
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start LocalNet: algokit localnet start",
      "Deploy your smart contract with the 'call_abi_txn' method",
      "Update YOUR_APP_ID in the code with your deployed app ID"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "=== Example 1: Custom Signer for All Transactions ===",
    "Custom signer called to sign transactions at indexes: [0, 1]",
    "Signed transactions at indexes: 0,1",
    "Both transactions in the atomic group were signed by the custom signer",
    "=== Example 2: Different Signers for Different Transactions ===",
    "Creating and funding a second account...",
    "Second account created: [address]",
    "Calling ABI method with different signer for payment transaction...",
    "Success! Transactions were signed by different accounts",
    "All examples completed successfully!"
  ],
  "source_tests": [
    {
      "file": "src/types/app-factory-and-client.spec.ts",
      "test_name": "Sign all transactions in group with abi call with transaction arg"
    },
    {
      "file": "src/types/app-factory-and-client.spec.ts",
      "test_name": "Sign transaction in group with different signer if provided"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.py",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Smart contract with call_abi_txn method that accepts a payment transaction and string"
    },
    {
      "target_file": "README.md",
      "type": "config",
      "action": "generate",
      "source_path": null,
      "note": "Documentation explaining custom signers and multi-account atomic transactions"
    }
  ],
  "notes": "These patterns are crucial for wallet developers and applications that need fine-grained control over transaction signing. Example 1 shows how to intercept all signing operations, useful for logging or custom approval flows. Example 2 demonstrates multi-party atomic transactions where different participants sign different transactions.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport * as algokit from '@algorandfoundation/algokit-utils'\nimport type { TransactionSigner } from 'algosdk'\n// Import your generated typed client\nimport { YourAppClient } from './artifacts/YourAppClient'\n\n/**\n * This example demonstrates two patterns for custom transaction signing:\n * 1. Using a custom signer to intercept and sign all transactions in a group\n * 2. Specifying different signers for individual transactions in an atomic group\n */\n\nasync function example1_customSignerForAllTransactions() {\n  console.log('\\n=== Example 1: Custom Signer for All Transactions ===')\n  \n  const algorand = AlgorandClient.defaultLocalNet()\n  const sender = await algorand.account.fromEnvironment('SENDER')\n  \n  // Create a payment transaction\n  const paymentTxn = await algorand.createTransaction.payment({\n    sender: sender.addr,\n    receiver: sender.addr,\n    amount: algokit.microAlgo(3000),\n  })\n  \n  // Initialize app client\n  const appClient = new YourAppClient(\n    {\n      resolveBy: 'id',\n      id: YOUR_APP_ID, // Replace with your deployed app ID\n      sender,\n    },\n    algorand.client.algod\n  )\n  \n  // Track which transaction indexes are signed\n  let signedIndexes: number[] = []\n  \n  // Create a custom signer that logs which transactions it signs\n  const customSigner: TransactionSigner = (transactionGroup, indexesToSign) => {\n    console.log(`Custom signer called to sign transactions at indexes: ${indexesToSign}`)\n    signedIndexes = indexesToSign\n    \n    // Delegate to the default signer after logging\n    return algorand.account.getSigner(sender.addr)(transactionGroup, indexesToSign)\n  }\n  \n  console.log('Calling ABI method with custom signer...')\n  \n  // Call the method with the custom signer\n  await appClient.send.call({\n    method: 'call_abi_txn',\n    args: [paymentTxn, 'test'],\n    sender: sender.addr,\n    signer: customSigner,\n  })\n  \n  console.log(`Signed transactions at indexes: ${signedIndexes}`)\n  console.log('Both transactions in the atomic group were signed by the custom signer')\n}\n\nasync function example2_differentSignersPerTransaction() {\n  console.log('\\n=== Example 2: Different Signers for Different Transactions ===')\n  \n  const algorand = AlgorandClient.defaultLocalNet()\n  const mainAccount = await algorand.account.fromEnvironment('SENDER')\n  \n  // Create a second account that will sign the payment transaction\n  console.log('Creating and funding a second account...')\n  const secondAccount = await algorand.account.random()\n  \n  // Fund the second account\n  await algorand.send.payment({\n    sender: mainAccount.addr,\n    receiver: secondAccount.addr,\n    amount: algokit.algo(1),\n  })\n  \n  console.log(`Second account created: ${secondAccount.addr}`)\n  \n  // Create a payment transaction from the second account\n  const paymentTxn = await algorand.createTransaction.payment({\n    sender: secondAccount.addr,\n    receiver: secondAccount.addr,\n    amount: algokit.microAlgo(2000),\n  })\n  \n  // Initialize app client with main account as sender\n  const appClient = new YourAppClient(\n    {\n      resolveBy: 'id',\n      id: YOUR_APP_ID, // Replace with your deployed app ID\n      sender: mainAccount,\n    },\n    algorand.client.algod\n  )\n  \n  console.log('Calling ABI method with different signer for payment transaction...')\n  \n  // Call the method, specifying a different signer for the payment transaction\n  // The main account will sign the app call, the second account will sign the payment\n  await appClient.send.call({\n    method: 'call_abi_txn',\n    args: [\n      {\n        txn: paymentTxn,\n        signer: secondAccount.signer, // Specify custom signer for this transaction\n      },\n      'test',\n    ],\n  })\n  \n  console.log('Success! Transactions were signed by different accounts:')\n  console.log(`  - Payment transaction signed by: ${secondAccount.addr}`)\n  console.log(`  - App call transaction signed by: ${mainAccount.addr}`)\n}\n\nasync function main() {\n  console.log('Custom Signers in Atomic Transaction Groups')\n  console.log('============================================')\n  \n  // Run both examples\n  await example1_customSignerForAllTransactions()\n  await example2_differentSignersPerTransaction()\n  \n  console.log('\\nAll examples completed successfully!')\n}\n\nmain().catch(console.error)"
}
```
