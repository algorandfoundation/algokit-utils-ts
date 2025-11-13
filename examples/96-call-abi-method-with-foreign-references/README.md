# Call ABI Method with Foreign References

Demonstrates how to call an ABI method with explicit foreign references including apps, accounts, and assets without automatic resource population.

## Example Details

```json
{
  "example_id": "96-call-abi-method-with-foreign-references",
  "title": "Call ABI Method with Foreign References",
  "summary": "Demonstrates how to call an ABI method with explicit foreign references including apps, accounts, and assets without automatic resource population.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "transaction management",
  "specific_use_case": "Call an ABI method with foreign references (apps, accounts, assets)",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "appReferences",
    "accountReferences",
    "assetReferences",
    "populateAppCallResources",
    "ABI method calls with foreign references"
  ],
  "feature_tags": [
    "abi",
    "foreign-references",
    "cross-app-call",
    "transaction-resources",
    "app-references",
    "account-references",
    "asset-references"
  ],
  "folder": "96-call-abi-method-with-foreign-references",
  "prerequisites": {
    "tools": [
      "algokit"
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
      "Start LocalNet with 'algokit localnet start'",
      "Ensure you have a deployed smart contract with an ABI method that accepts foreign references"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Transaction confirmed with return value showing referenced app, asset, and account details",
    "Example: 'App: 345, Asset: 567, Account: 123:456'"
  ],
  "source_tests": [
    {
      "file": "src/types/app-factory-and-client.spec.ts",
      "test_name": "Construct transaction with abi encoding including foreign references not in signature"
    }
  ],
  "artifacts_plan": [],
  "notes": "This example shows how to manually specify foreign references when calling an ABI method. Setting populateAppCallResources to false means you must explicitly provide all app, account, and asset references needed by the contract.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport { Account } from 'algosdk'\n\n/**\n * This example demonstrates how to call an ABI method with explicit foreign references.\n * Foreign references allow your smart contract to interact with other apps, accounts, and assets.\n * \n * Key concepts:\n * - appReferences: Array of app IDs that the contract will reference\n * - accountReferences: Array of accounts that the contract will access\n * - assetReferences: Array of asset IDs that the contract will use\n * - populateAppCallResources: When false, you must explicitly provide all references\n */\n\nasync function callAbiWithForeignReferences() {\n  // Initialize the Algorand client for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get or create a test account\n  const testAccount = await algorand.account.fromEnvironment('TEST_ACCOUNT')\n  \n  console.log('Test account address:', testAccount.addr)\n  \n  // Get the app client for your deployed contract\n  // Replace with your actual app ID and app spec\n  const appId = 123n // Replace with your deployed app ID\n  const client = algorand.client.getAppClientById({\n    appId: appId,\n    defaultSender: testAccount.addr,\n    // Add your app spec here\n  })\n  \n  console.log('\\nCalling ABI method with foreign references...')\n  \n  // Define the foreign references\n  const appReference = 345n // App ID to reference\n  const assetReference = 567n // Asset ID to reference\n  const accountReference = testAccount.addr // Account to reference\n  \n  try {\n    // Call the ABI method with explicit foreign references\n    const result = await client.send.call({\n      method: 'call_abi_foreign_refs',\n      // Explicitly specify foreign app references\n      appReferences: [appReference],\n      // Explicitly specify foreign account references\n      accountReferences: [accountReference],\n      // Explicitly specify foreign asset references\n      assetReferences: [assetReference],\n      // Disable automatic resource population - we're providing everything explicitly\n      populateAppCallResources: false,\n    })\n    \n    console.log('\\n✅ Transaction successful!')\n    console.log('Transaction ID:', result.transactions[0].txID())\n    console.log('Return value:', result.return)\n    console.log('\\nThe contract successfully accessed:')\n    console.log(`  - App ID: ${appReference}`)\n    console.log(`  - Asset ID: ${assetReference}`)\n    console.log(`  - Account: ${accountReference}`)\n    \n    // The return value shows how the contract used these references\n    console.log('\\nFull result:', JSON.stringify(result.return, null, 2))\n    \n  } catch (error) {\n    console.error('\\n❌ Error calling method with foreign references:')\n    console.error(error)\n    throw error\n  }\n}\n\n// Run the example\ncallAbiWithForeignReferences()\n  .then(() => {\n    console.log('\\n✨ Example completed successfully!')\n    process.exit(0)\n  })\n  .catch((error) => {\n    console.error('\\n❌ Example failed:', error)\n    process.exit(1)\n  })"
}
```
