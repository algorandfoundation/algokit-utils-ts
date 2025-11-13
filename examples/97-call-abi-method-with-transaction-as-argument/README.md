# Call ABI Method with Transaction as Argument

Demonstrates how to call an ABI method that accepts a transaction as an argument, enabling complex multi-step operations and transaction composition.

## Example Details

```json
{
  "example_id": "97-call-abi-method-with-transaction-as-argument",
  "title": "Call ABI Method with Transaction as Argument",
  "summary": "Demonstrates how to call an ABI method that accepts a transaction as an argument, enabling complex multi-step operations and transaction composition.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "transaction composition",
  "specific_use_case": "Call an ABI method that accepts a transaction as an argument",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "client.call",
    "ABI method with transaction argument",
    "AppManager.getABIReturn",
    "transaction groups",
    "createTransaction.payment"
  ],
  "feature_tags": [
    "abi-method",
    "transaction-argument",
    "transaction-composition",
    "atomic-transactions",
    "multi-transaction",
    "payment"
  ],
  "folder": "97-call-abi-method-with-transaction-as-argument",
  "prerequisites": {
    "tools": [
      "algokit",
      "docker"
    ],
    "libraries": [
      "algokit-utils",
      "algosdk"
    ],
    "environment": [
      {
        "name": "ALGOD_TOKEN",
        "required": true,
        "example": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      {
        "name": "ALGOD_SERVER",
        "required": true,
        "example": "http://localhost:4001"
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start AlgoKit LocalNet: algokit localnet start"
    ],
    "install": [
      "npm install algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "App created with ID: <app_id>",
    "Creating payment transaction for <amount> microAlgos",
    "Calling ABI method with transaction argument...",
    "Transaction group sent successfully",
    "Number of transactions in group: 2",
    "Return value: Sent <amount>. test"
  ],
  "source_tests": [
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "Construct transaction with abi encoding including transaction"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.algo.ts",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Sample ARC-32 app spec with call_abi_txn method that accepts transaction"
    }
  ],
  "notes": "This example demonstrates transaction composition where an ABI method accepts a transaction as an argument. This is useful for complex operations like verifying a payment was made before performing an action, or coordinating multiple transactions atomically.",
  "generated_code": "import { AlgorandClient, AppManager } from '@algorandfoundation/algokit-utils'\nimport { microAlgo } from '@algorandfoundation/algokit-utils/amount'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates how to call an ABI method that accepts a transaction\n * as one of its arguments. This enables powerful transaction composition patterns\n * where the smart contract can verify and react to other transactions in the same\n * atomic group.\n */\n\n// Sample app spec with call_abi_txn method that accepts a transaction argument\nconst appSpec = {\n  hints: {\n    call_abi_txn: {\n      call_config: {\n        no_op: 'CALL',\n      },\n    },\n  },\n  contract: {\n    name: 'TransactionCompositionApp',\n    methods: [\n      {\n        name: 'call_abi_txn',\n        args: [\n          { type: 'txn', name: 'payment_txn' },  // Transaction argument\n          { type: 'string', name: 'message' },\n        ],\n        returns: { type: 'string' },\n      },\n    ],\n  },\n  state: {\n    global: {\n      num_byte_slices: 0,\n      num_uints: 0,\n    },\n    local: {\n      num_byte_slices: 0,\n      num_uints: 0,\n    },\n  },\n  schema: {\n    global: {\n      declared: {},\n      reserved: {},\n    },\n    local: {\n      declared: {},\n      reserved: {},\n    },\n  },\n  source: {\n    approval: 'I3ByYWdtYSB2ZXJzaW9uIDEw',\n    clear: 'I3ByYWdtYSB2ZXJzaW9uIDEw',\n  },\n  bare_call_config: {\n    no_op: 'CREATE',\n    opt_in: 'NEVER',\n    close_out: 'NEVER',\n    update_application: 'NEVER',\n    delete_application: 'NEVER',\n  },\n  template_variables: {\n    UPDATABLE: { type: 'uint64' },\n    DELETABLE: { type: 'uint64' },\n    VALUE: { type: 'uint64' },\n  },\n}\n\nasync function callABIMethodWithTransactionArgument() {\n  // Initialize AlgorandClient for LocalNet\n  const algod = new algosdk.Algodv2('a' + 'a'.repeat(63), 'http://localhost', 4001)\n  const algorand = AlgorandClient.fromClients({ algod })\n\n  // Get a test account from the LocalNet dispenser\n  const testAccount = await algorand.account.fromEnvironment('LOCALNET')\n  console.log(`Using account: ${testAccount.addr}`)\n\n  // Step 1: Create and deploy the app\n  console.log('\\nCreating app...')\n  const appClient = algorand.client.getAppClient({\n    resolveBy: 'id',\n    app: appSpec,\n    sender: testAccount,\n    id: 0,\n  })\n\n  const createResult = await appClient.create({\n    deployTimeParams: {\n      UPDATABLE: 1,\n      DELETABLE: 1,\n      VALUE: 1,\n    },\n  })\n\n  console.log(`App created with ID: ${createResult.appId}`)\n\n  // Step 2: Create a payment transaction to pass as an argument\n  const paymentAmount = microAlgo(Math.ceil(Math.random() * 10000))\n  console.log(`\\nCreating payment transaction for ${paymentAmount.microAlgo} microAlgos`)\n  \n  const paymentTxn = await algorand.createTransaction.payment({\n    sender: testAccount.addr,\n    receiver: testAccount.addr,\n    amount: paymentAmount,\n  })\n\n  // Step 3: Call the ABI method with the transaction as an argument\n  console.log('\\nCalling ABI method with transaction argument...')\n  \n  /**\n   * When you pass a transaction as a methodArg, AlgoKit Utils will:\n   * 1. Automatically group the transactions together atomically\n   * 2. Handle the ABI encoding for the transaction reference\n   * 3. Sign and send both transactions as a group\n   */\n  const result = await appClient.call({\n    method: 'call_abi_txn',\n    methodArgs: [\n      paymentTxn,  // Pass the payment transaction as the first argument\n      'test',      // String message as second argument\n    ],\n  })\n\n  // Step 4: Process the results\n  console.log('Transaction group sent successfully!')\n  console.log(`Number of transactions in group: ${result.transactions.length}`)\n  console.log(`Transaction IDs: ${result.txIds.join(', ')}`)\n\n  // Step 5: Extract and display the ABI return value\n  if (result.confirmations && result.confirmations[1]) {\n    const abiMethod = appClient.getABIMethod('call_abi_txn')\n    if (abiMethod) {\n      const returnValue = AppManager.getABIReturn(\n        result.confirmations[1],\n        abiMethod\n      )\n      \n      if (returnValue?.returnValue) {\n        console.log(`\\nReturn value: ${returnValue.returnValue}`)\n        console.log(`Expected format: \"Sent ${paymentAmount.microAlgo}. test\"`)\n      }\n    }\n  }\n\n  console.log('\\n✅ Example completed successfully!')\n}\n\n// Run the example\ncallABIMethodWithTransactionArgument().catch(console.error)\n"
}
```
