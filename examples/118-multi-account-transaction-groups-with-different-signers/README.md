# Multi-Account Transaction Groups with Different Signers

Demonstrates how to compose transaction groups where different transactions are signed by different accounts, useful for multi-party operations and complex transaction workflows.

## Example Details

```json
{
  "example_id": "118-multi-account-transaction-groups-with-different-signers",
  "title": "Multi-Account Transaction Groups with Different Signers",
  "summary": "Demonstrates how to compose transaction groups where different transactions are signed by different accounts, useful for multi-party operations and complex transaction workflows.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "transaction composition",
  "specific_use_case": "Call an ABI method with a transaction argument signed by a different account",
  "target_users": [
    "SDK developers",
    "Smart contract developers",
    "DApp developers"
  ],
  "features_tested": [
    "client.call",
    "transaction with signer",
    "multi-account transaction groups",
    "transaction arguments with explicit signers"
  ],
  "feature_tags": [
    "transaction-groups",
    "multi-account",
    "abi-calls",
    "transaction-composition",
    "signers"
  ],
  "folder": "118-multi-account-transaction-groups-with-different-signers",
  "prerequisites": {
    "tools": [
      "algokit",
      "docker"
    ],
    "libraries": [
      "@algorandfoundation/algokit-utils",
      "algosdk"
    ],
    "environment": [
      {
        "name": "ALGOD_SERVER",
        "required": false,
        "example": "http://localhost"
      },
      {
        "name": "ALGOD_PORT",
        "required": false,
        "example": "4001"
      },
      {
        "name": "ALGOD_TOKEN",
        "required": false,
        "example": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start AlgoKit LocalNet: algokit localnet start"
    ],
    "install": [
      "npm install"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "App account and second signer account addresses",
    "Second signer account funded successfully",
    "Transaction group successfully sent with multiple signers",
    "Details showing which account signed which transaction"
  ],
  "source_tests": [
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "Sign transaction in group with different signer if provided"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.py",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Sample contract with call_abi_txn method that accepts a transaction and string argument"
    }
  ],
  "notes": "This is a high-value example for DApp developers who need to coordinate transactions from multiple users or accounts. Common use cases include escrow services, atomic swaps, and multi-signature workflows.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport * as algokit from '@algorandfoundation/algokit-utils'\n\n/**\n * This example demonstrates how to compose transaction groups where different\n * transactions are signed by different accounts. This is essential for:\n * - Multi-party operations (escrow, atomic swaps, etc.)\n * - Complex DApp workflows involving multiple users\n * - Smart contracts that require transactions from specific accounts\n */\n\nasync function multiAccountTransactionGroupExample() {\n  // Initialize AlgoKit and get clients\n  const algorand = AlgorandClient.defaultLocalNet()\n  const algod = algorand.client.algod\n  const indexer = algorand.client.indexer\n\n  // Get the main application account (deployer)\n  const appAccount = await algorand.account.localNetDispenser()\n  console.log(`App account address: ${appAccount.addr}`)\n\n  // Create and fund a second account that will sign a transaction in the group\n  console.log('\\nCreating and funding second signer account...')\n  const secondSigner = algorand.account.random()\n  \n  // Fund the second account\n  await algorand.send.payment({\n    sender: appAccount.addr,\n    receiver: secondSigner.addr,\n    amount: algokit.algo(1),\n  })\n  console.log(`Second signer address: ${secondSigner.addr}`)\n  console.log('Second signer account funded with 1 ALGO')\n\n  // Deploy or get an existing application\n  console.log('\\nDeploying application...')\n  const { client } = await deployYourApp(appAccount, algod, indexer)\n\n  // Create a payment transaction from the second signer\n  // This transaction will be included in the group but signed by the second account\n  console.log('\\nCreating payment transaction from second signer...')\n  const paymentTxn = await algorand.createTransaction.payment({\n    sender: secondSigner.addr,\n    receiver: secondSigner.addr,\n    amount: algokit.microAlgo(5000),\n  })\n\n  console.log('Calling ABI method with multi-account transaction group...')\n  console.log('  - App call will be signed by app account')\n  console.log('  - Payment transaction will be signed by second signer')\n\n  // Call the ABI method, passing the transaction with its signer\n  // The framework will automatically handle signing each transaction with the appropriate signer\n  const result = await client.call({\n    method: 'call_abi_txn',\n    methodArgs: [\n      // Pass both the transaction and its signer as an object\n      { transaction: paymentTxn, signer: secondSigner },\n      'test'\n    ],\n    sender: appAccount.addr, // The app call itself is signed by appAccount\n  })\n\n  console.log('\\n✅ Transaction group successfully sent!')\n  console.log(`Total transactions in group: ${result.transactions.length}`)\n  console.log('\\nTransaction details:')\n  result.transactions.forEach((txn, idx) => {\n    console.log(`  [${idx}] Type: ${txn.type}, ID: ${txn.txID()}`)\n  })\n\n  console.log('\\nKey takeaway: Different transactions in the group were signed by different accounts')\n  console.log('  - Transaction 0 (app call): Signed by app account')\n  console.log('  - Transaction 1 (payment): Signed by second signer')\n}\n\n// Helper function placeholder - replace with your actual app deployment\nasync function deployYourApp(account: any, algod: any, indexer: any) {\n  // This is a placeholder - implement your actual app deployment logic\n  // The app should have a method like:\n  // call_abi_txn(txn: Transaction, note: string) -> void\n  throw new Error('Implement your app deployment logic here')\n}\n\n// Run the example\nmultiAccountTransactionGroupExample().catch(console.error)"
}
```
