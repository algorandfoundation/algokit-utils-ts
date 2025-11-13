# Pass Transaction as Method Argument

Shows how to call a smart contract method that accepts a transaction as an argument, a common pattern for complex dApp logic.

## Example Details

```json
{
  "example_id": "121-pass-transaction-as-method-argument",
  "title": "Pass Transaction as Method Argument",
  "summary": "Shows how to call a smart contract method that accepts a transaction as an argument, a common pattern for complex dApp logic.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "transaction management",
  "specific_use_case": "Call a smart contract method that accepts a transaction as an argument",
  "target_users": [
    "Smart contract developers",
    "dApp developers"
  ],
  "features_tested": [
    "algorand.newGroup.addAppCallMethodCall",
    "algorand.createTransaction.payment",
    "transaction arguments to methods",
    "ABI method calls"
  ],
  "feature_tags": [
    "abi-method-call",
    "transaction-reference",
    "method-arguments",
    "transaction-groups",
    "smart-contracts"
  ],
  "folder": "121-pass-transaction-as-method-argument",
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
    "Transaction group sent successfully",
    "Method return value showing the sender address",
    "Confirmation that the transaction argument was processed correctly"
  ],
  "source_tests": [
    {
      "file": "src/types/algorand-client.spec.ts",
      "test_name": "method with txn arg"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.py",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Contract with txnArg method that accepts a transaction argument"
    }
  ],
  "notes": "This example requires a deployed smart contract with a method that accepts transaction arguments. The pattern is useful for payment verification, escrow logic, and complex multi-step workflows.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates how to pass a transaction as an argument to a smart contract method.\n * This pattern is useful when your contract needs to verify or process transaction details.\n */\n\nasync function transactionAsArgumentExample() {\n  // Initialize AlgorandClient - connects to your Algorand node\n  const algorand = AlgorandClient.defaultLocalNet()\n\n  // Get account from LocalNet\n  const alice = (await algorand.account.localNetDispenser()).account\n\n  // Deploy or reference your application\n  // For this example, assume we have an app with a 'txnArg' method that accepts a transaction\n  const appId = 1234 // Replace with your actual app ID\n\n  // Get the ABI method definition\n  // In a real scenario, you'd import this from your contract's ABI JSON\n  const txnArgMethod = new algosdk.ABIMethod({\n    name: 'txnArg',\n    args: [{ type: 'txn', name: 'payment', desc: 'Payment transaction to process' }],\n    returns: { type: 'address', desc: 'Sender address from the transaction' },\n  })\n\n  console.log('Creating a transaction group with a payment transaction as a method argument...')\n\n  // Create a transaction group where:\n  // 1. A payment transaction is added to the group\n  // 2. An app call method references that payment transaction as an argument\n  const txnResult = await algorand\n    .newGroup()\n    // Add a payment transaction to the group\n    .addPayment({\n      sender: alice.addr,\n      receiver: alice.addr,\n      amount: AlgoAmount.MicroAlgo(0),\n      note: new Uint8Array([1]),\n    })\n    // Add an app call that references a payment transaction as an argument\n    .addAppCallMethodCall({\n      sender: alice.addr,\n      appId: appId,\n      method: txnArgMethod,\n      // Create a transaction to pass as an argument\n      // Note: This transaction is created but not sent separately - it's passed as data\n      args: [\n        algorand.createTransaction.payment({\n          sender: alice.addr,\n          receiver: alice.addr,\n          amount: AlgoAmount.MicroAlgo(0),\n        }),\n      ],\n    })\n    .send()\n\n  console.log('\\nTransaction group sent successfully!')\n  console.log(`Transaction ID: ${txnResult.txIds[0]}`)\n\n  // Access the return value from the method call\n  if (txnResult.returns && txnResult.returns.length > 0) {\n    const returnValue = txnResult.returns[0].returnValue?.valueOf()\n    console.log(`\\nMethod return value: ${returnValue}`)\n    console.log(`Expected: ${alice.addr}`)\n    console.log(`Match: ${returnValue === alice.addr}`)\n  }\n\n  console.log('\\nKey takeaways:')\n  console.log('- Transactions can be passed as arguments to ABI method calls')\n  console.log('- Use algorand.createTransaction to create transaction objects for arguments')\n  console.log('- The transaction is included in the group but processed by the smart contract')\n  console.log('- This pattern enables contracts to verify and process transaction details')\n  console.log('- Common use cases: escrow validation, payment verification, multi-step workflows')\n}\n\n// Run the example\ntransactionAsArgumentExample().catch(console.error)\n"
}
```
