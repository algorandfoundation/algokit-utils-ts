# Using Foreign References in Application Calls

Demonstrates how to reference foreign apps, accounts, and assets when calling ABI methods, enabling cross-app interactions and access to external resources.

## Example Details

```json
{
  "example_id": "135-using-foreign-references-in-application-calls",
  "title": "Using Foreign References in Application Calls",
  "summary": "Demonstrates how to reference foreign apps, accounts, and assets when calling ABI methods, enabling cross-app interactions and access to external resources.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app interaction",
  "specific_use_case": "Call an ABI method with foreign app, account, and asset references",
  "target_users": [
    "SDK developers",
    "Smart contract developers",
    "DApp developers"
  ],
  "features_tested": [
    "client.call",
    "foreign references",
    "apps parameter",
    "accounts parameter",
    "assets parameter",
    "ABI return value decoding"
  ],
  "feature_tags": [
    "foreign-references",
    "cross-app-calls",
    "foreign-assets",
    "foreign-accounts",
    "abi-calls",
    "app-interaction"
  ],
  "folder": "135-using-foreign-references-in-application-calls",
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
    "Application deployed successfully",
    "Method called with foreign app, account, and asset references",
    "Return value showing the contract accessed the foreign references",
    "Explanation of how foreign references enable cross-app interactions"
  ],
  "source_tests": [
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "Construct transaction with abi encoding including foreign references not in signature"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.py",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Sample contract with call_abi_foreign_refs method that accesses foreign apps, accounts, and assets and returns information about them"
    }
  ],
  "notes": "Foreign references are crucial for building composable smart contracts. Algorand limits transactions to referencing up to 8 foreign apps, 4 foreign accounts, and 8 foreign assets. This example shows the basic pattern that can be extended for more complex cross-app interactions.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport { AppManager } from '@algorandfoundation/algokit-utils/types/app-manager'\n\n/**\n * This example demonstrates how to use foreign references (apps, accounts, assets)\n * when calling application methods. Foreign references allow your smart contract to:\n * - Read state from other applications\n * - Access account information beyond the sender\n * - Query asset parameters and holdings\n * - Perform cross-app interactions\n */\n\nasync function foreignReferencesExample() {\n  // Initialize AlgoKit and get clients\n  const algorand = AlgorandClient.defaultLocalNet()\n  const algod = algorand.client.algod\n  const indexer = algorand.client.indexer\n\n  // Get a test account\n  const testAccount = await algorand.account.localNetDispenser()\n  console.log(`Test account address: ${testAccount.addr}`)\n\n  // Deploy the application\n  console.log('\\nDeploying application...')\n  const { client } = await deployYourApp(testAccount, algod, indexer)\n  console.log('Application deployed successfully')\n\n  // Define foreign references to pass to the application\n  // These are resources external to the application that it needs to access\n  const foreignAppId = 345      // ID of another application\n  const foreignAssetId = 567     // ID of an asset (ASA)\n  const foreignAccount = testAccount.addr  // An account address\n\n  console.log('\\nCalling ABI method with foreign references:')\n  console.log(`  - Foreign App ID: ${foreignAppId}`)\n  console.log(`  - Foreign Asset ID: ${foreignAssetId}`)\n  console.log(`  - Foreign Account: ${foreignAccount}`)\n\n  // Call the ABI method with foreign references\n  // The apps, accounts, and assets arrays make these resources available to the contract\n  const result = await client.call({\n    method: 'call_abi_foreign_refs',\n    methodArgs: [],\n    apps: [foreignAppId],           // Foreign application references\n    accounts: [foreignAccount],     // Foreign account references\n    assets: [foreignAssetId],       // Foreign asset references\n  })\n\n  console.log('\\n✅ Method call successful!')\n  console.log(`Transaction ID: ${result.transactions[0].txID()}`)\n\n  // Decode and display the ABI return value\n  if (result.confirmations && result.confirmations[0]) {\n    const abiMethod = client.getABIMethod('call_abi_foreign_refs')\n    if (abiMethod) {\n      const returnValue = AppManager.getABIReturn(\n        result.confirmations[0],\n        abiMethod\n      )\n\n      console.log('\\nReturn value from contract:')\n      console.log(`  ${returnValue?.returnValue}`)\n\n      // The contract can now access these foreign references:\n      // - Read from the foreign app's global/local state\n      // - Get account balance, assets held, etc.\n      // - Query asset parameters (total supply, decimals, etc.)\n    }\n  }\n\n  console.log('\\nForeign references explained:')\n  console.log('  • apps[]: Allows reading state from other applications')\n  console.log('  • accounts[]: Provides access to account information')\n  console.log('  • assets[]: Enables querying asset parameters and holdings')\n  console.log('\\nThese references are essential for cross-app interactions and composability!')\n}\n\n// Helper function placeholder - replace with your actual app deployment\nasync function deployYourApp(account: any, algod: any, indexer: any) {\n  // This is a placeholder - implement your actual app deployment logic\n  // The app should have a method like:\n  // call_abi_foreign_refs() -> string\n  // that accesses the foreign references passed in the transaction\n  throw new Error('Implement your app deployment logic here')\n}\n\n// Run the example\nforeignReferencesExample().catch(console.error)"
}
```
