# Replace an Application with Delete and Recreate

Demonstrates how to replace an existing Algorand application by deleting it and creating a new one using the 'replace' deployment strategy

## Example Details

```json
{
  "example_id": "126-replace-an-application-with-delete-and-recreate",
  "title": "Replace an Application with Delete and Recreate",
  "summary": "Demonstrates how to replace an existing Algorand application by deleting it and creating a new one using the 'replace' deployment strategy",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Replace an existing application by deleting it and creating a new one",
  "target_users": [
    "SDK developers",
    "DevOps engineers",
    "Smart contract developers"
  ],
  "features_tested": [
    "client.deploy",
    "onUpdate: 'replace'",
    "deleteResult",
    "OnApplicationComplete.DeleteApplicationOC",
    "app replacement"
  ],
  "feature_tags": [
    "app-client",
    "deployment",
    "replace",
    "delete",
    "schema-breaking-changes",
    "deployment-strategies"
  ],
  "folder": "126-replace-an-application-with-delete-and-recreate",
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
      },
      {
        "name": "INDEXER_SERVER",
        "required": false,
        "example": "http://localhost"
      },
      {
        "name": "INDEXER_PORT",
        "required": false,
        "example": "8980"
      },
      {
        "name": "INDEXER_TOKEN",
        "required": false,
        "example": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start LocalNet using 'algokit localnet start'",
      "Ensure you have a compiled app spec JSON file for your smart contract"
    ],
    "install": [
      "npm install"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "First deployment creates app with VALUE=1",
    "Second deployment replaces the app with VALUE=2",
    "New app ID is greater than the original app ID",
    "Delete transaction confirmation is logged",
    "Operation performed: replace"
  ],
  "source_tests": [
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "Deploy app - replace"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.json",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Sample app spec with deploy-time parameters (VALUE, UPDATABLE, DELETABLE)"
    },
    {
      "target_file": "package.json",
      "type": "config",
      "action": "generate",
      "source_path": null,
      "note": "Package configuration with dependencies"
    }
  ],
  "notes": "This example shows how to handle schema-breaking changes by replacing an application instead of updating it. The original app is deleted and a new one is created with the updated configuration.",
  "generated_code": "import algosdk from 'algosdk'\nimport * as algokit from '@algorandfoundation/algokit-utils'\nimport appSpec from './contract.json'\n\n/**\n * This example demonstrates how to replace an existing Algorand application\n * by deleting it and creating a new one. This is useful when you need to make\n * schema-breaking changes that cannot be handled by a regular update.\n */\n\nasync function replaceApp() {\n  // Setup clients for LocalNet\n  const algodClient = algokit.getAlgoClient(\n    algokit.getAlgoNodeConfig('algod', 'localnet')\n  )\n  const indexer = algokit.getAlgoClient(\n    algokit.getAlgoNodeConfig('indexer', 'localnet')\n  )\n\n  // Get a test account with funds\n  const account = await algokit.getLocalNetDispenserAccount(algodClient)\n\n  console.log('Account address:', account.addr)\n  console.log('\\n--- Step 1: Deploy initial app ---')\n\n  // Create an app client that can find existing apps by creator and name\n  const client = algokit.getAppClient(\n    {\n      resolveBy: 'creatorAndName',\n      app: appSpec,\n      sender: account,\n      creatorAddress: account.addr,\n      findExistingUsing: indexer,\n    },\n    algodClient\n  )\n\n  // Deploy the first version of the app with VALUE=1\n  // allowDelete: true is required for the app to be deletable later\n  const createdApp = await client.deploy({\n    version: '1.0',\n    deployTimeParams: {\n      VALUE: 1,\n    },\n    allowDelete: true,\n  })\n\n  console.log('Initial app created:')\n  console.log('  App ID:', createdApp.appId)\n  console.log('  App Address:', createdApp.appAddress)\n  console.log('  Operation:', createdApp.operationPerformed)\n\n  console.log('\\n--- Step 2: Replace the app with a new version ---')\n\n  // Deploy again with onUpdate: 'replace'\n  // This will delete the old app and create a new one with VALUE=2\n  const replacedApp = await client.deploy({\n    version: '1.0',\n    deployTimeParams: {\n      VALUE: 2,\n    },\n    onUpdate: 'replace',\n  })\n\n  console.log('App replaced:')\n  console.log('  New App ID:', replacedApp.appId)\n  console.log('  New App Address:', replacedApp.appAddress)\n  console.log('  Operation:', replacedApp.operationPerformed)\n  console.log('  Old App ID (deleted):', createdApp.appId)\n\n  // Verify the replacement\n  if (replacedApp.appId > createdApp.appId) {\n    console.log('\\n✓ Replacement successful: New app ID is greater than old app ID')\n  }\n\n  // Check delete result\n  if (replacedApp.deleteResult) {\n    console.log('\\nDelete operation details:')\n    console.log('  Deleted app ID:', replacedApp.deleteResult.transaction.applicationCall?.appIndex?.toString())\n    console.log('  Transaction ID:', replacedApp.deleteResult.transaction.txID())\n    console.log('  On Complete:', algosdk.OnApplicationComplete[replacedApp.deleteResult.transaction.applicationCall?.onComplete || 0])\n  }\n\n  console.log('\\n--- Summary ---')\n  console.log('The replace strategy is useful when:')\n  console.log('  • Making schema-breaking changes (e.g., changing global/local state)')\n  console.log('  • Completely redesigning app logic')\n  console.log('  • Starting fresh with a new app instance')\n  console.log('\\nNote: The old app must have allowDelete: true for replacement to work')\n}\n\n// Run the example\nreplaceApp().catch(console.error)\n"
}
```
