# Nested Method Calls with Transaction Arguments

Demonstrates how to compose method calls where a method takes another method call as an argument, and that nested method call itself takes a transaction as an argument. This shows advanced composition patterns for complex dApp workflows.

## Example Details

```json
{
  "example_id": "141-nested-method-calls-with-transaction-arguments",
  "title": "Nested Method Calls with Transaction Arguments",
  "summary": "Demonstrates how to compose method calls where a method takes another method call as an argument, and that nested method call itself takes a transaction as an argument. This shows advanced composition patterns for complex dApp workflows.",
  "language": "typescript",
  "complexity": "complex",
  "example_potential": "medium",
  "use_case_category": "transaction management",
  "specific_use_case": "Call a method that takes another method call as an argument, where that nested method call itself takes a transaction as an argument",
  "target_users": [
    "Smart contract developers",
    "Advanced dApp developers"
  ],
  "features_tested": [
    "algorand.newGroup()",
    "addAppCallMethodCall",
    "nested method calls",
    "transaction arguments",
    "method composition",
    "AppCallMethodCall type"
  ],
  "feature_tags": [
    "nested-method-calls",
    "transaction-composition",
    "app-call",
    "method-arguments",
    "advanced-composition",
    "transaction-group"
  ],
  "folder": "141-nested-method-calls-with-transaction-arguments",
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
      "Start LocalNet: algokit localnet start",
      "Ensure you have a deployed smart contract with methods that accept transaction and method call arguments"
    ],
    "install": [
      "npm install"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Nested method call transaction group sent successfully",
    "First return value: <sender-address>",
    "Second return value: <app-id>",
    "Transaction IDs and confirmation details"
  ],
  "source_tests": [
    {
      "file": "src/types/algorand-client.spec.ts",
      "test_name": "method with method call arg that has a txn arg"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.algo.ts",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Sample smart contract with txnArg and nestedTxnArg methods for testing nested calls"
    },
    {
      "target_file": "package.json",
      "type": "config",
      "action": "generate",
      "source_path": null,
      "note": "Package configuration with required dependencies"
    },
    {
      "target_file": "tsconfig.json",
      "type": "config",
      "action": "generate",
      "source_path": null,
      "note": "TypeScript configuration"
    }
  ],
  "notes": "This example requires a smart contract that has methods like 'txnArg' and 'nestedTxnArg' that accept transaction and method call arguments. The contract should be deployed before running this example.",
  "generated_code": "import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils'\nimport { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'\nimport { AppCallMethodCall } from '@algorandfoundation/algokit-utils/types/composer'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates nested method calls with transaction arguments.\n * \n * Scenario: Call a method that takes another method call as an argument,\n * where that nested method call itself takes a transaction as an argument.\n * \n * This is useful for complex dApp workflows where you need to compose\n * multiple contract interactions in a single atomic group.\n */\n\nasync function nestedMethodCallsExample() {\n  // Initialize AlgorandClient for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get or create an account to use as sender\n  const alice = algorand.account.fromEnvironment('ALICE', algosdk.generateAccount())\n  \n  console.log('Setting up nested method call example...')\n  console.log('Sender address:', alice.addr)\n  \n  // Ensure alice has funds\n  await algorand.send.payment({\n    sender: algorand.account.localNetDispenser(),\n    receiver: alice.addr,\n    amount: AlgoAmount.Algos(10),\n  })\n  \n  // NOTE: You need to deploy your smart contract and get the appId\n  // For this example, we assume you have a contract with these methods:\n  // - txnArg(txn: transaction): returns sender address\n  // - nestedTxnArg(arg1: any, arg2: method_call): returns app ID\n  \n  // Replace this with your actual deployed app ID\n  const appId = 123456 // TODO: Replace with actual app ID\n  \n  // Get the ABI method definitions from your contract client\n  // In a real scenario, you would import your generated app client\n  // For example: import { YourAppClient } from './artifacts/YourApp.client'\n  // const appClient = new YourAppClient({ sender: alice, resolveBy: 'id', id: appId }, algorand.client.algod)\n  \n  // For demonstration, we'll show the structure:\n  // const txnArgMethod = appClient.appClient.getABIMethod('txnArg')!\n  // const nestedTxnArgMethod = appClient.appClient.getABIMethod('nestedTxnArg')!\n  \n  console.log('\\nStep 1: Create the inner method call with a payment transaction argument')\n  \n  // Define the inner method call that takes a transaction as an argument\n  const txnArgCall: AppCallMethodCall = {\n    sender: alice,\n    appId: appId,\n    method: txnArgMethod, // Replace with actual method from your contract\n    // The payment transaction is passed as an argument to the method\n    args: [\n      algorand.createTransaction.payment({\n        sender: alice,\n        receiver: alice,\n        amount: AlgoAmount.MicroAlgo(0),\n      })\n    ],\n  }\n  \n  console.log('Inner method call configured: txnArg with payment transaction')\n  \n  console.log('\\nStep 2: Create the outer method call that takes the inner method call as an argument')\n  \n  // Build and send the transaction group with nested method calls\n  const nestedTxnArgRes = await algorand\n    .newGroup()\n    .addAppCallMethodCall({\n      sender: alice,\n      appId: appId,\n      method: nestedTxnArgMethod, // Replace with actual method from your contract\n      // The first arg is undefined (placeholder), the second is the nested method call\n      args: [undefined, txnArgCall],\n    })\n    .send()\n  \n  console.log('\\nTransaction group sent successfully!')\n  console.log('Transaction ID:', nestedTxnArgRes.txIds[0])\n  \n  // Extract and display the return values\n  if (nestedTxnArgRes.returns) {\n    const firstReturn = nestedTxnArgRes.returns[0]?.returnValue?.valueOf()\n    const secondReturn = nestedTxnArgRes.returns[1]?.returnValue?.valueOf()\n    \n    console.log('\\nReturn values:')\n    console.log('- First return (sender from txnArg):', firstReturn)\n    console.log('- Second return (app ID from nestedTxnArg):', secondReturn)\n  }\n  \n  console.log('\\nNested method call example completed successfully!')\n}\n\n// Run the example\nnestedMethodCallsExample().catch(console.error)"
}
```
