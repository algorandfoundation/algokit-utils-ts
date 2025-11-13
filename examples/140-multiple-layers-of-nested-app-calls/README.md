# Multiple Layers of Nested App Calls

Demonstrates the most advanced composition pattern with multiple layers of nested method calls. Shows how to call a method that takes a method call argument, which itself takes another method call argument that has a transaction argument - showcasing the full flexibility of the SDK's method composition.

## Example Details

```json
{
  "example_id": "140-multiple-layers-of-nested-app-calls",
  "title": "Multiple Layers of Nested App Calls",
  "summary": "Demonstrates the most advanced composition pattern with multiple layers of nested method calls. Shows how to call a method that takes a method call argument, which itself takes another method call argument that has a transaction argument - showcasing the full flexibility of the SDK's method composition.",
  "language": "typescript",
  "complexity": "complex",
  "example_potential": "medium",
  "use_case_category": "transaction management",
  "specific_use_case": "Call a method that takes a method call argument, which itself takes another method call argument that has a transaction argument",
  "target_users": [
    "Advanced smart contract developers",
    "Complex dApp developers"
  ],
  "features_tested": [
    "algorand.newGroup()",
    "addAppCallMethodCall",
    "deeply nested method calls",
    "multi-layer method composition",
    "transaction arguments",
    "AppCallMethodCall type"
  ],
  "feature_tags": [
    "nested-method-calls",
    "multi-layer-composition",
    "app-call",
    "method-arguments",
    "advanced-composition",
    "transaction-group",
    "complex-workflows"
  ],
  "folder": "140-multiple-layers-of-nested-app-calls",
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
      "Deploy a smart contract with methods that accept method call arguments"
    ],
    "install": [
      "npm install"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Multi-layer nested transaction group sent successfully",
    "Three return values from the nested method calls",
    "First return: <sender-address>",
    "Second return: <app-id>",
    "Third return: <app-id>",
    "Transaction IDs and confirmation details"
  ],
  "source_tests": [
    {
      "file": "src/types/algorand-client.spec.ts",
      "test_name": "multiple layers of nested app calls"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.algo.ts",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Sample smart contract with txnArg and methodArg methods for multi-layer nesting"
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
  "notes": "This example demonstrates the deepest level of method call nesting supported by the SDK. Requires a smart contract with methods that accept method call arguments at multiple levels.",
  "generated_code": "import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils'\nimport { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'\nimport { AppCallMethodCall } from '@algorandfoundation/algokit-utils/types/composer'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates multiple layers of nested method calls.\n * \n * Scenario: Call a method that takes a method call argument,\n * which itself takes another method call argument that has a transaction argument.\n * \n * This shows the deepest level of method composition supported,\n * useful for extremely complex multi-step dApp operations.\n * \n * Structure:\n * Level 1 (outer): methodArg(methodCall)\n *   └─ Level 2 (middle): methodArg(methodCall)\n *        └─ Level 3 (inner): txnArg(payment)\n */\n\nasync function multiLayerNestedCallsExample() {\n  // Initialize AlgorandClient for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get or create an account to use as sender\n  const alice = algorand.account.fromEnvironment('ALICE', algosdk.generateAccount())\n  \n  console.log('Setting up multi-layer nested method call example...')\n  console.log('Sender address:', alice.addr)\n  \n  // Ensure alice has funds\n  await algorand.send.payment({\n    sender: algorand.account.localNetDispenser(),\n    receiver: alice.addr,\n    amount: AlgoAmount.Algos(10),\n  })\n  \n  // NOTE: You need to deploy your smart contract and get the appId\n  // For this example, we assume you have a contract with these methods:\n  // - txnArg(txn: transaction): returns sender address\n  // - methodArg(method_call): returns app ID\n  \n  // Replace this with your actual deployed app ID\n  const appId = 123456 // TODO: Replace with actual app ID\n  \n  // Get the ABI method definitions from your contract client\n  // In a real scenario, you would import your generated app client\n  // For example: import { YourAppClient } from './artifacts/YourApp.client'\n  // const appClient = new YourAppClient({ sender: alice, resolveBy: 'id', id: appId }, algorand.client.algod)\n  // const txnArgMethod = appClient.appClient.getABIMethod('txnArg')!\n  // const methodArgMethod = appClient.appClient.getABIMethod('methodArg')!\n  \n  console.log('\\nStep 1: Create the innermost method call (Level 3) with a payment transaction')\n  \n  // Level 3 (innermost): Method that takes a transaction argument\n  const txnArg2Call: AppCallMethodCall = {\n    sender: alice.addr,\n    appId: appId,\n    method: txnArgMethod, // Replace with actual method\n    note: 'txnArg2Call',\n    args: [\n      algorand.createTransaction.payment({\n        sender: alice.addr,\n        receiver: alice.addr,\n        amount: AlgoAmount.MicroAlgo(1),\n      })\n    ],\n  }\n  \n  console.log('Level 3 configured: txnArg with payment transaction (amount: 1 microAlgo)')\n  \n  console.log('\\nStep 2: Create the middle method call (Level 2) that takes Level 3 as an argument')\n  \n  // Level 2 (middle): Method that takes the innermost method call as an argument\n  const txnArg1Call: AppCallMethodCall = {\n    sender: alice.addr,\n    appId: appId,\n    method: methodArgMethod, // Replace with actual method\n    note: 'txnArg1Call',\n    args: [txnArg2Call],\n  }\n  \n  console.log('Level 2 configured: methodArg taking Level 3 as argument')\n  \n  console.log('\\nStep 3: Create the outermost method call (Level 1) that takes Level 2 as an argument')\n  \n  // Level 1 (outermost): Build and send the transaction group\n  const nestedTxnArgRes = await algorand\n    .newGroup()\n    .addAppCallMethodCall({\n      sender: alice.addr,\n      appId: appId,\n      note: 'nestedTxnArgRes',\n      method: methodArgMethod, // Replace with actual method\n      args: [txnArg1Call],\n    })\n    .send()\n  \n  console.log('\\nTransaction group sent successfully!')\n  console.log('Transaction IDs:', nestedTxnArgRes.txIds)\n  \n  // Extract and display the return values from all three levels\n  if (nestedTxnArgRes.returns) {\n    console.log('\\nReturn values from nested calls:')\n    \n    const firstReturn = nestedTxnArgRes.returns[0]?.returnValue?.valueOf()\n    const secondReturn = nestedTxnArgRes.returns[1]?.returnValue?.valueOf()\n    const thirdReturn = nestedTxnArgRes.returns[2]?.returnValue?.valueOf()\n    \n    console.log('- Level 3 return (sender from txnArg):', firstReturn)\n    console.log('- Level 2 return (app ID from methodArg):', secondReturn)\n    console.log('- Level 1 return (app ID from methodArg):', thirdReturn)\n  }\n  \n  console.log('\\nMulti-layer nested method call example completed successfully!')\n  console.log('This demonstrates the full depth of method composition capabilities.')\n}\n\n// Run the example\nmultiLayerNestedCallsExample().catch(console.error)"
}
```
