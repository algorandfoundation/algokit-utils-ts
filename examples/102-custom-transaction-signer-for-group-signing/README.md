# Custom Transaction Signer for Group Signing

Demonstrates how to implement a custom TransactionSigner to control signing logic for transaction groups, including tracking which transaction indexes are signed.

## Example Details

```json
{
  "example_id": "102-custom-transaction-signer-for-group-signing",
  "title": "Custom Transaction Signer for Group Signing",
  "summary": "Demonstrates how to implement a custom TransactionSigner to control signing logic for transaction groups, including tracking which transaction indexes are signed.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "medium",
  "use_case_category": "transaction signing",
  "specific_use_case": "Use a custom signer to sign all transactions in a group with an ABI call",
  "target_users": [
    "SDK developers",
    "Wallet developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "custom TransactionSigner",
    "transaction group signing",
    "sender parameter with custom signer",
    "ABI method calls with transaction arguments"
  ],
  "feature_tags": [
    "transaction-signing",
    "custom-signer",
    "transaction-groups",
    "abi-calls",
    "wallet-integration"
  ],
  "folder": "102-custom-transaction-signer-for-group-signing",
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
    "Custom signer called to sign transactions at indexes: 0,1",
    "Transaction group signed successfully",
    "Signed transaction indexes showing all group members were signed"
  ],
  "source_tests": [
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "Sign all transactions in group with abi call with transaction arg"
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
  "notes": "This example shows custom signer implementation which is crucial for wallet developers. The custom signer can be extended to include UI prompts, signing policies, hardware wallet integration, etc.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport { TransactionSigner } from 'algosdk'\nimport * as algokit from '@algorandfoundation/algokit-utils'\n\n/**\n * This example demonstrates how to implement a custom TransactionSigner\n * to control signing logic for transaction groups. This is useful for:\n * - Wallet integrations that need custom signing workflows\n * - Tracking which transactions are being signed\n * - Implementing conditional signing logic\n */\n\nasync function customTransactionSignerExample() {\n  // Initialize AlgoKit and get clients\n  const algorand = AlgorandClient.defaultLocalNet()\n  const algod = algorand.client.algod\n  const indexer = algorand.client.indexer\n\n  // Get a test account\n  const testAccount = await algorand.account.localNetDispenser()\n\n  console.log('Setting up application client...')\n  \n  // Deploy or get an existing application that has a method accepting transaction arguments\n  // For this example, assume we have a client for an app with 'call_abi_txn' method\n  // Replace this with your actual app deployment/client creation\n  const { client } = await deployYourApp(testAccount, algod, indexer)\n\n  // Create a payment transaction to pass as an argument\n  const txn = await algorand.createTransaction.payment({\n    sender: testAccount.addr,\n    receiver: testAccount.addr,\n    amount: algokit.microAlgo(5000),\n  })\n\n  console.log('Created payment transaction to use as method argument')\n\n  // Track which transaction indexes are being signed\n  let signedIndexes: number[] = []\n\n  // Implement a custom TransactionSigner\n  // This signer wraps the default signer but tracks which indexes are signed\n  const customSigner: TransactionSigner = (txnGroup, indexesToSign) => {\n    console.log(`Custom signer called to sign transactions at indexes: ${indexesToSign}`)\n    \n    // Store the indexes for logging/tracking\n    signedIndexes = indexesToSign\n    \n    // Delegate to the default signer for actual signing\n    // In a real wallet, you might show UI prompts, apply policies, etc.\n    return algokit.getSenderTransactionSigner(testAccount)(txnGroup, indexesToSign)\n  }\n\n  console.log('Calling ABI method with custom signer...')\n\n  // Call the ABI method with transaction argument and custom signer\n  const result = await client.call({\n    method: 'call_abi_txn',\n    methodArgs: [txn, 'test'],\n    sender: { addr: testAccount.addr, signer: customSigner },\n  })\n\n  console.log('\\nTransaction group signed successfully!')\n  console.log(`Signed transaction indexes: ${signedIndexes}`)\n  console.log(`Total transactions in group: ${result.transactions.length}`)\n  console.log(`Transaction IDs: ${result.transactions.map(t => t.txID()).join(', ')}`)\n\n  // The custom signer signed all transactions in the group (indexes [0, 1])\n  // Index 0: The ABI call transaction\n  // Index 1: The payment transaction passed as an argument\n  console.log('\\nCustom signer successfully tracked and signed all transactions in the group')\n}\n\n// Helper function placeholder - replace with your actual app deployment\nasync function deployYourApp(account: any, algod: any, indexer: any) {\n  // This is a placeholder - implement your actual app deployment logic\n  // The app should have a method like:\n  // call_abi_txn(txn: Transaction, note: string) -> void\n  throw new Error('Implement your app deployment logic here')\n}\n\n// Run the example\ncustomTransactionSignerExample().catch(console.error)"
}
```
