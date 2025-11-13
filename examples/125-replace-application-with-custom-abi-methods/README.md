# Replace Application with Custom ABI Methods

Shows how to replace an application using custom ABI methods for both creation and deletion, with the ability to capture return values from both operations.

## Example Details

```json
{
  "example_id": "125-replace-application-with-custom-abi-methods",
  "title": "Replace Application with Custom ABI Methods",
  "summary": "Shows how to replace an application using custom ABI methods for both creation and deletion, with the ability to capture return values from both operations.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Replace an application using custom ABI create and delete methods",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "factory.deploy",
    "createParams with ABI method",
    "deleteParams with ABI method",
    "deleteReturn",
    "return values from ABI methods",
    "populateAppCallResources"
  ],
  "feature_tags": [
    "app-deployment",
    "app-replacement",
    "abi-methods",
    "custom-create",
    "custom-delete",
    "return-values",
    "factory-pattern"
  ],
  "folder": "125-replace-application-with-custom-abi-methods",
  "prerequisites": {
    "tools": [
      "algokit",
      "docker",
      "node"
    ],
    "libraries": [
      "@algorandfoundation/algokit-utils",
      "algosdk"
    ],
    "environment": [
      {
        "name": "ALGOD_TOKEN",
        "required": false,
        "example": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      {
        "name": "ALGOD_SERVER",
        "required": false,
        "example": "http://localhost"
      },
      {
        "name": "ALGOD_PORT",
        "required": false,
        "example": "4001"
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start LocalNet: algokit localnet start",
      "Ensure your smart contract has 'create_abi' and 'delete_abi' methods defined"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Initial app deployed",
    "Replacement performed using ABI methods",
    "Return value from create_abi method: 'arg_io'",
    "Return value from delete_abi method: 'arg2_io'",
    "New app created with higher ID",
    "Old app deleted successfully"
  ],
  "source_tests": [
    {
      "file": "src/types/app-factory-and-client.spec.ts",
      "test_name": "Deploy app - replace (abi)"
    }
  ],
  "artifacts_plan": [],
  "notes": "Your smart contract must implement both 'create_abi' and 'delete_abi' methods that accept the appropriate arguments and return values. The populateAppCallResources: false option gives you more control over resource population.",
  "generated_code": "import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'\nimport * as algosdk from 'algosdk'\nimport { OnApplicationComplete } from 'algosdk'\n\n/**\n * This example demonstrates advanced app replacement using custom ABI methods.\n * \n * Unlike simple replacement, this shows:\n * - Using custom ABI methods for app creation (create_abi)\n * - Using custom ABI methods for app deletion (delete_abi)\n * - Capturing return values from both operations\n * - Passing arguments to both create and delete methods\n * \n * This is useful when your smart contract has specific initialization\n * or cleanup logic that needs to be executed during deployment/deletion.\n */\n\nasync function replaceApplicationWithAbiExample() {\n  // Set up the testing environment with LocalNet\n  const localnet = await algorandFixture()\n  const { testAccount } = localnet.context\n\n  // Create a factory instance for your application\n  // Your app spec should define 'create_abi' and 'delete_abi' methods\n  const factory = localnet.algorand.client.getTypedAppFactory({\n    // Your app specification with ABI methods would go here\n    // Must include:\n    // - create_abi: A method that handles app creation with custom logic\n    // - delete_abi: A method that handles app deletion with custom logic\n  })\n\n  console.log('Step 1: Deploy initial application')\n  const { result: createdApp } = await factory.deploy({\n    deployTimeParams: {\n      VALUE: 1,\n    },\n    deletable: true, // Required for replacement\n    populateAppCallResources: false, // Manual resource handling\n  })\n\n  console.log(`✓ Initial app deployed with ID: ${createdApp.appId}`)\n  console.log(`  App address: ${createdApp.appAddress}`)\n\n  console.log('\\nStep 2: Replace app using custom ABI methods')\n  const { result: app } = await factory.deploy({\n    deployTimeParams: {\n      VALUE: 2,\n    },\n    onUpdate: 'replace',\n    \n    // Custom ABI method for creation\n    createParams: {\n      method: 'create_abi',\n      args: ['arg_io'], // Arguments passed to the create method\n    },\n    \n    // Custom ABI method for deletion\n    deleteParams: {\n      method: 'delete_abi',\n      args: ['arg2_io'], // Arguments passed to the delete method\n    },\n    \n    populateAppCallResources: false,\n  })\n\n  console.log(`\\n✓ Replacement with ABI methods completed!`)\n  console.log(`  Operation performed: ${app.operationPerformed}`)\n  console.log(`  Old app ID: ${createdApp.appId}`)\n  console.log(`  New app ID: ${app.appId}`)\n  console.log(`  New app address: ${app.appAddress}`)\n  console.log(`  Address matches: ${algosdk.getApplicationAddress(app.appId) === app.appAddress ? '✓' : '✗'}`)\n\n  // Return values from ABI methods\n  console.log(`\\n✓ ABI Method Return Values:`)\n  console.log(`  create_abi returned: \"${app.return}\"`)\n  console.log(`  delete_abi returned: \"${app.deleteReturn}\"`)\n\n  // Verify the deletion occurred\n  if (app.deleteResult && app.deleteResult.confirmation) {\n    console.log(`\\n✓ Old application deleted via ABI method`)\n    console.log(`  Deleted app ID: ${app.deleteResult.transaction.applicationCall?.appIndex}`)\n    console.log(`  OnComplete: ${app.deleteResult.transaction.applicationCall?.onComplete === OnApplicationComplete.DeleteApplicationOC ? 'DeleteApplication' : 'Unknown'}`)\n  }\n\n  console.log('\\nℹ️  Benefits of ABI methods:')\n  console.log('  • Execute custom initialization logic during creation')\n  console.log('  • Perform cleanup operations before deletion')\n  console.log('  • Capture return values for validation or logging')\n  console.log('  • Pass dynamic arguments to control behavior')\n}\n\n// Run the example\nreplaceApplicationWithAbiExample()\n  .then(() => {\n    console.log('\\n✅ Example completed successfully')\n    process.exit(0)\n  })\n  .catch((error) => {\n    console.error('\\n❌ Error:', error)\n    process.exit(1)\n  })"
}
```
