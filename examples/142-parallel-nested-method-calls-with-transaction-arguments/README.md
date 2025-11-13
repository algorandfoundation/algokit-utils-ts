# Parallel Nested Method Calls with Transaction Arguments

Demonstrates how to compose a method with multiple nested method calls in parallel, each with their own transaction arguments. Shows how to call a method that accepts multiple method call arguments simultaneously, useful for complex multi-step operations that need to happen atomically.

## Example Details

```json
{
  "example_id": "142-parallel-nested-method-calls-with-transaction-arguments",
  "title": "Parallel Nested Method Calls with Transaction Arguments",
  "summary": "Demonstrates how to compose a method with multiple nested method calls in parallel, each with their own transaction arguments. Shows how to call a method that accepts multiple method call arguments simultaneously, useful for complex multi-step operations that need to happen atomically.",
  "language": "typescript",
  "complexity": "complex",
  "example_potential": "medium",
  "use_case_category": "transaction management",
  "specific_use_case": "Call a method that accepts multiple method call arguments, each of which has its own transaction argument",
  "target_users": [
    "Advanced smart contract developers",
    "Complex dApp developers"
  ],
  "features_tested": [
    "algorand.newGroup()",
    "addAppCallMethodCall",
    "multiple nested method calls",
    "parallel method composition",
    "transaction arguments",
    "AppCallMethodCall type"
  ],
  "feature_tags": [
    "nested-method-calls",
    "parallel-composition",
    "app-call",
    "method-arguments",
    "advanced-composition",
    "transaction-group",
    "multi-arg-methods"
  ],
  "folder": "142-parallel-nested-method-calls-with-transaction-arguments",
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
      "Deploy a smart contract with methods that accept multiple method call arguments"
    ],
    "install": [
      "npm install"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Parallel nested transaction group sent successfully",
    "Three return values from the method calls",
    "First return: <sender-address> (from first nested call)",
    "Second return: <sender-address> (from second nested call)",
    "Third return: <app-id>",
    "Transaction IDs and confirmation details"
  ],
  "source_tests": [
    {
      "file": "src/types/algorand-client.spec.ts",
      "test_name": "method with two method call args that each have a txn arg"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.algo.ts",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Sample smart contract with txnArg and doubleNestedTxnArg methods"
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
  "notes": "This example shows parallel method composition where multiple nested method calls are passed as separate arguments to a parent method. Each nested call has its own transaction argument.",
  "generated_code": "import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils'\nimport { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'\nimport { AppCallMethodCall } from '@algorandfoundation/algokit-utils/types/composer'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates parallel nested method calls with transaction arguments.\n * \n * Scenario: Call a method that accepts multiple method call arguments,\n * each of which has its own transaction argument.\n * \n * This is useful for complex multi-step operations where you need to\n * compose multiple parallel contract interactions in a single atomic group.\n * \n * Structure:\n * doubleNestedTxnArg(arg1, methodCall1, arg2, methodCall2)\n *   ├─ methodCall1: txnArg(payment1)\n *   └─ methodCall2: txnArg(payment2)\n */\n\nasync function parallelNestedCallsExample() {\n  // Initialize AlgorandClient for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get or create an account to use as sender\n  const alice = algorand.account.fromEnvironment('ALICE', algosdk.generateAccount())\n  \n  console.log('Setting up parallel nested method call example...')\n  console.log('Sender address:', alice.addr)\n  \n  // Ensure alice has funds\n  await algorand.send.payment({\n    sender: algorand.account.localNetDispenser(),\n    receiver: alice.addr,\n    amount: AlgoAmount.Algos(10),\n  })\n  \n  // NOTE: You need to deploy your smart contract and get the appId\n  // For this example, we assume you have a contract with these methods:\n  // - txnArg(txn: transaction): returns sender address\n  // - doubleNestedTxnArg(arg1, method1, arg2, method2): processes both method calls\n  \n  // Replace this with your actual deployed app ID\n  const appId = 123456 // TODO: Replace with actual app ID\n  \n  // Get the ABI method definitions from your contract client\n  // In a real scenario, you would import your generated app client\n  // For example: import { YourAppClient } from './artifacts/YourApp.client'\n  // const appClient = new YourAppClient({ sender: alice, resolveBy: 'id', id: appId }, algorand.client.algod)\n  // const txnArgMethod = appClient.appClient.getABIMethod('txnArg')!\n  // const doubleNestedMethod = appClient.appClient.getABIMethod('doubleNestedTxnArg')!\n  \n  console.log('\\nStep 1: Create the first nested method call with a payment transaction (0 microAlgo)')\n  \n  // First nested method call with its own transaction argument\n  const firstTxnCall: AppCallMethodCall = {\n    sender: alice,\n    appId: appId,\n    method: txnArgMethod, // Replace with actual method\n    args: [\n      algorand.createTransaction.payment({\n        sender: alice,\n        receiver: alice,\n        amount: AlgoAmount.MicroAlgo(0),\n      })\n    ],\n  }\n  \n  console.log('First nested call configured: txnArg with payment of 0 microAlgo')\n  \n  console.log('\\nStep 2: Create the second nested method call with a different payment transaction (1 microAlgo)')\n  \n  // Second nested method call with its own transaction argument and a note to differentiate it\n  const secondTxnCall: AppCallMethodCall = {\n    sender: alice,\n    appId: appId,\n    method: txnArgMethod, // Replace with actual method\n    args: [\n      algorand.createTransaction.payment({\n        sender: alice,\n        receiver: alice,\n        amount: AlgoAmount.MicroAlgo(1),\n      })\n    ],\n    note: new Uint8Array([1]), // Adding a note to differentiate this call\n  }\n  \n  console.log('Second nested call configured: txnArg with payment of 1 microAlgo and custom note')\n  \n  console.log('\\nStep 3: Create the parent method call that takes both nested calls as arguments')\n  \n  // Build and send the transaction group with parallel nested method calls\n  const doubleNestedTxnArgRes = await algorand\n    .newGroup()\n    .addAppCallMethodCall({\n      sender: alice,\n      appId: appId,\n      method: doubleNestedMethod, // Replace with actual method\n      // Pass both nested method calls as separate arguments\n      // undefined values are placeholders for other arguments the method might need\n      args: [undefined, firstTxnCall, undefined, secondTxnCall],\n    })\n    .send()\n  \n  console.log('\\nTransaction group sent successfully!')\n  console.log('Transaction IDs:', doubleNestedTxnArgRes.txIds)\n  \n  // Extract and display the return values\n  if (doubleNestedTxnArgRes.returns) {\n    console.log('\\nReturn values from parallel nested calls:')\n    \n    const firstReturn = doubleNestedTxnArgRes.returns[0]?.returnValue?.valueOf()\n    const secondReturn = doubleNestedTxnArgRes.returns[1]?.returnValue?.valueOf()\n    const thirdReturn = doubleNestedTxnArgRes.returns[2]?.returnValue?.valueOf()\n    \n    console.log('- First nested call return (sender from first txnArg):', firstReturn)\n    console.log('- Second nested call return (sender from second txnArg):', secondReturn)\n    console.log('- Parent method return (app ID):', thirdReturn)\n  }\n  \n  console.log('\\nParallel nested method call example completed successfully!')\n  console.log('This demonstrates how to compose multiple nested calls in parallel within a single method.')\n}\n\n// Run the example\nparallelNestedCallsExample().catch(console.error)"
}
```
