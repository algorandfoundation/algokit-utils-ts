# Raw Application Call with Manual Argument Encoding

Demonstrates how to make a raw application call with manually encoded arguments in an atomic transaction group, providing fine-grained control over the call parameters.

## Example Details

```json
{
  "example_id": "122-raw-application-call-with-manual-argument-encoding",
  "title": "Raw Application Call with Manual Argument Encoding",
  "summary": "Demonstrates how to make a raw application call with manually encoded arguments in an atomic transaction group, providing fine-grained control over the call parameters.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "medium",
  "use_case_category": "transaction management",
  "specific_use_case": "Make a raw application call with manually encoded arguments in an atomic transaction group",
  "target_users": [
    "Advanced SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "algorand.newGroup.addAppCall",
    "raw app call",
    "manual argument encoding",
    "atomic transaction groups",
    "method selectors"
  ],
  "feature_tags": [
    "transaction-groups",
    "raw-app-call",
    "manual-encoding",
    "abi-method-selector",
    "atomic-transactions",
    "advanced"
  ],
  "folder": "122-raw-application-call-with-manual-argument-encoding",
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
      "Start LocalNet: algokit localnet start"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Transaction group successfully executed",
    "Balance changes showing payment and fees",
    "App call logs showing the result of the calculation"
  ],
  "source_tests": [
    {
      "file": "src/types/algorand-client.spec.ts",
      "test_name": "addAppCall"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.py",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Simple contract with doMath method for demonstration"
    }
  ],
  "notes": "This example requires a deployed smart contract with a 'doMath' method. Users should replace the appId and method selector with their own contract details.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates how to make a raw application call with manually encoded arguments.\n * This approach gives you fine-grained control over the call parameters and is useful when you need\n * to work directly with the low-level ABI encoding.\n */\n\nasync function rawAppCallExample() {\n  // Initialize AlgorandClient - connects to your Algorand node\n  const algorand = AlgorandClient.defaultLocalNet()\n\n  // Get accounts from LocalNet\n  const alice = (await algorand.account.localNetDispenser()).account\n  const bob = algosdk.generateAccount()\n\n  // Fund bob's account\n  await algorand.send.payment({\n    sender: alice.addr,\n    receiver: bob.addr,\n    amount: AlgoAmount.Algos(10),\n  })\n\n  // Deploy a test application (replace this with your actual app deployment)\n  // For this example, assume we have an app with a 'doMath' method that takes two uint64s and an operation\n  const appId = 1234 // Replace with your actual app ID\n\n  // Get the ABI method selector for 'doMath'\n  // In a real scenario, you'd get this from your contract's ABI\n  const methodSelector = new Uint8Array([0x15, 0x1f, 0x7c, 0x75]) // Example selector\n\n  console.log('Creating atomic transaction group with payment and raw app call...')\n\n  // Get balances before the transaction\n  const alicePreBalance = (await algorand.account.getInformation(alice.addr)).balance\n  const bobPreBalance = (await algorand.account.getInformation(bob.addr)).balance\n\n  console.log(`Alice balance before: ${alicePreBalance.microAlgo} microAlgos`)\n  console.log(`Bob balance before: ${bobPreBalance.microAlgo} microAlgos`)\n\n  // Create an atomic transaction group with:\n  // 1. A payment transaction from Alice to Bob\n  // 2. A raw app call with manually encoded arguments\n  const result = await algorand\n    .newGroup()\n    // Add a payment transaction\n    .addPayment({\n      sender: alice.addr,\n      receiver: bob.addr,\n      amount: AlgoAmount.MicroAlgo(1),\n      note: new Uint8Array([1]),\n    })\n    // Add a raw app call with manually encoded arguments\n    .addAppCall({\n      sender: alice.addr,\n      appId: appId,\n      args: [\n        methodSelector, // Method selector (first 4 bytes of method signature hash)\n        algosdk.encodeUint64(1), // First argument: uint64 value 1\n        algosdk.encodeUint64(2), // Second argument: uint64 value 2\n        Uint8Array.from(Buffer.from('AANzdW0=', 'base64')), // Third argument: operation (\"sum\")\n      ],\n      note: 'addAppCall',\n    })\n    .execute()\n\n  console.log('\\nTransaction group executed successfully!')\n  console.log(`Group ID: ${result.groupId}`)\n\n  // Get balances after the transaction\n  const alicePostBalance = (await algorand.account.getInformation(alice.addr)).balance\n  const bobPostBalance = (await algorand.account.getInformation(bob.addr)).balance\n\n  console.log(`\\nAlice balance after: ${alicePostBalance.microAlgo} microAlgos`)\n  console.log(`Bob balance after: ${bobPostBalance.microAlgo} microAlgos`)\n  console.log(`Alice paid: ${alicePreBalance.microAlgo - alicePostBalance.microAlgo} microAlgos (includes fees)`)\n  console.log(`Bob received: ${bobPostBalance.microAlgo - bobPreBalance.microAlgo} microAlgos`)\n\n  // Check if there are logs from the app call\n  if (result.confirmations[1].logs && result.confirmations[1].logs.length > 0) {\n    const logData = Buffer.from(result.confirmations[1].logs[0]).toString('hex')\n    console.log(`\\nApp call log output: ${logData}`)\n  }\n\n  console.log('\\nKey takeaways:')\n  console.log('- Raw app calls give you fine-grained control over arguments')\n  console.log('- Method selectors are the first 4 bytes of the method signature hash')\n  console.log('- Arguments must be manually encoded using algosdk encoding functions')\n  console.log('- Atomic groups ensure all transactions succeed or fail together')\n}\n\n// Run the example\nrawAppCallExample().catch(console.error)\n"
}
```
