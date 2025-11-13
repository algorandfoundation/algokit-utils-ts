# Update Application with ABI Update Method

Demonstrates how to update an existing application using an ABI update method with arguments. Shows the complete update workflow including method invocation, return value capture, and operation verification.

## Example Details

```json
{
  "example_id": "131-update-application-with-abi-update-method",
  "title": "Update Application with ABI Update Method",
  "summary": "Demonstrates how to update an existing application using an ABI update method with arguments. Shows the complete update workflow including method invocation, return value capture, and operation verification.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Update an existing application using an ABI update method",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "client.deploy",
    "updateArgs with ABI method",
    "onUpdate",
    "OnApplicationComplete.UpdateApplicationOC",
    "return value from update method",
    "operationPerformed detection"
  ],
  "feature_tags": [
    "app-client",
    "update",
    "abi",
    "update-method",
    "return-values",
    "on-complete"
  ],
  "folder": "131-update-application-with-abi-update-method",
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
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start LocalNet: algokit localnet start",
      "Ensure you have an app spec JSON file with an 'update_abi' method"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Setting up app client...",
    "=== INITIAL DEPLOYMENT ===",
    "Creating application with VALUE=1...",
    "✅ Application created",
    "=== UPDATING WITH ABI METHOD ===",
    "Updating application with VALUE=2 and calling update_abi method...",
    "✅ Update operation performed successfully",
    "App Identity:",
    "  App ID: <number> (same: true)",
    "✅ Transaction type confirmed as UpdateApplication",
    "✅ Return value from update_abi method: arg_io",
    "✅ Application successfully updated with ABI method"
  ],
  "source_tests": [
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "Deploy app - update (abi)"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "app_spec.json",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "User needs to provide their own app spec with an 'update_abi' method that accepts a string argument and returns a string"
    }
  ],
  "notes": "This example requires an application specification with an ABI update method. The update method allows you to execute custom logic during the update operation, such as state migrations or validation. The method can accept arguments and return values, making updates more flexible and programmable.",
  "generated_code": "import * as algokit from '@algorandfoundation/algokit-utils'\nimport { OnApplicationComplete } from 'algosdk'\n\n// This example demonstrates updating an application using an ABI update method\n// The update method can accept arguments and return values\n\nasync function updateAppWithAbiMethod() {\n  // Initialize AlgoKit and get clients\n  const algod = algokit.getAlgoClient(algokit.getDefaultLocalNetConfig('algod'))\n  const indexer = algokit.getAlgoClient(algokit.getDefaultLocalNetConfig('indexer'))\n  const account = await algokit.getLocalNetDispenserAccount(algod)\n\n  // Load your application specification\n  const appSpec = '<YOUR_APP_SPEC>' // Replace with your actual app spec\n\n  console.log('Setting up app client...')\n  \n  // Create an app client\n  const client = algokit.getAppClient(\n    {\n      resolveBy: 'creatorAndName',\n      app: appSpec,\n      sender: account,\n      creatorAddress: account.addr,\n      findExistingUsing: indexer,\n    },\n    algod,\n  )\n\n  console.log('\\n=== INITIAL DEPLOYMENT ===')\n  console.log('Creating application with VALUE=1...')\n  \n  // First deployment - create the application\n  const createdApp = await client.deploy({\n    version: '1.0',\n    deployTimeParams: {\n      VALUE: 1,\n    },\n    allowUpdate: true, // Must allow updates\n  })\n\n  console.log(`✅ Application created`)\n  console.log(`App ID: ${createdApp.appId}`)\n  console.log(`Created in Round: ${createdApp.createdRound}`)\n\n  console.log('\\n=== UPDATING WITH ABI METHOD ===')\n  console.log('Updating application with VALUE=2 and calling update_abi method...')\n  \n  // Second deployment - update with ABI method\n  const updatedApp = await client.deploy({\n    version: '1.0',\n    deployTimeParams: {\n      VALUE: 2, // Updated parameter\n    },\n    onUpdate: 'update', // Perform an update\n    updateArgs: {\n      // Specify the ABI method to call during update\n      method: 'update_abi', // Name of your ABI update method\n      methodArgs: ['arg_io'], // Arguments to pass to the update method\n    },\n  })\n\n  // Verify the update operation\n  if (updatedApp.operationPerformed === 'update') {\n    console.log('✅ Update operation performed successfully')\n    \n    // Verify it's the same app\n    console.log(`\\nApp Identity:`)\n    console.log(`  App ID: ${updatedApp.appId} (same: ${updatedApp.appId === createdApp.appId})`)\n    console.log(`  App Address: ${updatedApp.appAddress} (same: ${updatedApp.appAddress === createdApp.appAddress})`)\n    \n    // Check round information\n    console.log(`\\nRound Information:`)\n    console.log(`  Created in Round: ${updatedApp.createdRound}`)\n    console.log(`  Updated in Round: ${updatedApp.updatedRound}`)\n    console.log(`  Rounds are different: ${updatedApp.updatedRound !== updatedApp.createdRound}`)\n    \n    // Verify the transaction type\n    if (updatedApp.transaction.applicationCall?.onComplete === OnApplicationComplete.UpdateApplicationOC) {\n      console.log('\\n✅ Transaction type confirmed as UpdateApplication')\n    }\n    \n    // Display the return value from the update method\n    if (updatedApp.return?.returnValue) {\n      console.log(`\\n✅ Return value from update_abi method: ${updatedApp.return.returnValue}`)\n    }\n    \n    console.log('\\n✅ Application successfully updated with ABI method')\n  } else {\n    console.log(`⚠️  Expected update but got: ${updatedApp.operationPerformed}`)\n  }\n\n  return { createdApp, updatedApp }\n}\n\n// Run the example\nupdateAppWithAbiMethod()\n  .then(() => {\n    console.log('\\n✅ Example completed successfully')\n    process.exit(0)\n  })\n  .catch((error) => {\n    console.error('❌ Error:', error)\n    process.exit(1)\n  })"
}
```
