# Pass Transaction as ABI Method Argument

Demonstrates how to call an ABI method with a transaction as an argument, creating an atomic transaction group

## Example Details

```json
{
  "example_id": "120-pass-transaction-as-abi-method-argument",
  "title": "Pass Transaction as ABI Method Argument",
  "summary": "Demonstrates how to call an ABI method with a transaction as an argument, creating an atomic transaction group",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "transaction management",
  "specific_use_case": "Call an ABI method with a transaction as an argument",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "client.send.call",
    "transaction arguments",
    "atomic transactions",
    "AppManager.getABIReturn"
  ],
  "feature_tags": [
    "abi",
    "transaction-arguments",
    "atomic-transactions",
    "payment-transaction",
    "app-client",
    "typed-client"
  ],
  "folder": "120-pass-transaction-as-abi-method-argument",
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
    "Creating a payment transaction to pass as an argument...",
    "Payment transaction created for 5000 microAlgos",
    "Calling ABI method with transaction argument...",
    "Transaction group confirmed!",
    "Number of transactions in group: 2",
    "Return value: Sent 5000. test",
    "Example completed successfully!"
  ],
  "source_tests": [
    {
      "file": "src/types/app-factory-and-client.spec.ts",
      "test_name": "Construct transaction with abi encoding including transaction"
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
      "note": "Documentation explaining the example and atomic transaction groups"
    }
  ],
  "notes": "This example shows the power of atomic transaction groups. When a transaction is passed as an ABI argument, both transactions must succeed or both will fail, ensuring atomicity.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport * as algokit from '@algorandfoundation/algokit-utils'\nimport { AppManager } from '@algorandfoundation/algokit-utils/types/app-manager'\nimport { getArc56Method } from '@algorandfoundation/algokit-utils/types/app-spec'\n// Import your generated typed client\nimport { YourAppClient } from './artifacts/YourAppClient'\n\n/**\n * This example demonstrates how to pass a transaction as an argument to an ABI method.\n * When you pass a transaction as an ABI argument, the SDK automatically creates an\n * atomic transaction group, ensuring both transactions execute together or not at all.\n */\n\nasync function main() {\n  // Initialize AlgorandClient for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get account from KMD (or use your own account)\n  const sender = await algorand.account.fromEnvironment('SENDER')\n  \n  console.log('Creating a payment transaction to pass as an argument...')\n  \n  // Create a payment transaction that will be passed as an argument\n  const paymentTxn = await algorand.createTransaction.payment({\n    sender: sender.addr,\n    receiver: sender.addr,\n    amount: algokit.microAlgo(5000), // 5000 microAlgos\n  })\n  \n  console.log(`Payment transaction created for ${paymentTxn.payment?.amount} microAlgos`)\n  \n  // Initialize your app client (assumes you have a deployed app)\n  const appClient = new YourAppClient(\n    {\n      resolveBy: 'id',\n      id: YOUR_APP_ID, // Replace with your deployed app ID\n      sender,\n    },\n    algorand.client.algod\n  )\n  \n  console.log('Calling ABI method with transaction argument...')\n  \n  // Call the ABI method with the transaction as an argument\n  // The SDK will automatically create an atomic transaction group\n  const result = await appClient.send.call({\n    method: 'call_abi_txn',\n    args: [paymentTxn, 'test'],\n  })\n  \n  console.log('Transaction group confirmed!')\n  console.log(`Number of transactions in group: ${result.transactions.length}`)\n  console.log(`Return value: ${result.return}`)\n  \n  // Extract the ABI return value from the confirmation\n  if (result.confirmations && result.confirmations[1]) {\n    const returnValue = AppManager.getABIReturn(\n      result.confirmations[1],\n      getArc56Method('call_abi_txn', appClient.appSpec)\n    )\n    console.log(`ABI Return Value: ${returnValue?.returnValue}`)\n  }\n  \n  console.log('\\nExample completed successfully!')\n  console.log('The payment transaction and app call were executed atomically.')\n}\n\nmain().catch(console.error)"
}
```
