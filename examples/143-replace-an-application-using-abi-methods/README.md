# Replace an Application Using ABI Methods

Shows how to replace an existing application using ABI methods for both delete and create operations, capturing return values from both operations

## Example Details

```json
{
  "example_id": "143-replace-an-application-using-abi-methods",
  "title": "Replace an Application Using ABI Methods",
  "summary": "Shows how to replace an existing application using ABI methods for both delete and create operations, capturing return values from both operations",
  "language": "typescript",
  "complexity": "complex",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Replace an application using ABI methods for both delete and create operations",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "client.deploy",
    "onUpdate: 'replace'",
    "createArgs with ABI methods",
    "deleteArgs with ABI methods",
    "deleteReturn",
    "return value handling"
  ],
  "feature_tags": [
    "app-client",
    "deployment",
    "replace",
    "abi-methods",
    "delete-abi",
    "create-abi",
    "return-values"
  ],
  "folder": "143-replace-an-application-using-abi-methods",
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
      "Ensure you have a compiled app spec JSON file with ABI methods (create_abi and delete_abi)"
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
    "Second deployment replaces the app with VALUE=2 using ABI methods",
    "Delete ABI method is called with argument 'arg2_io' and returns that value",
    "Create ABI method is called with argument 'arg_io' and returns that value",
    "New app ID is greater than the original app ID",
    "Both return values are logged"
  ],
  "source_tests": [
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "Deploy app - replace (abi)"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.json",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Sample app spec with ABI methods (create_abi, delete_abi) and deploy-time parameters"
    },
    {
      "target_file": "package.json",
      "type": "config",
      "action": "generate",
      "source_path": null,
      "note": "Package configuration with dependencies"
    }
  ],
  "notes": "This advanced example demonstrates replacing an app while using custom ABI methods for creation and deletion. Useful when you need to pass specific arguments or capture return values during the replacement process.",
  "generated_code": "import algosdk from 'algosdk'\nimport * as algokit from '@algorandfoundation/algokit-utils'\nimport appSpec from './contract.json'\n\n/**\n * This example demonstrates how to replace an existing Algorand application\n * using custom ABI methods for both the delete and create operations.\n * This allows you to pass specific arguments and capture return values\n * during the replacement process.\n */\n\nasync function replaceAppWithABI() {\n  // Setup clients for LocalNet\n  const algodClient = algokit.getAlgoClient(\n    algokit.getAlgoNodeConfig('algod', 'localnet')\n  )\n  const indexer = algokit.getAlgoClient(\n    algokit.getAlgoNodeConfig('indexer', 'localnet')\n  )\n\n  // Get a test account with funds\n  const account = await algokit.getLocalNetDispenserAccount(algodClient)\n\n  console.log('Account address:', account.addr)\n  console.log('\\n--- Step 1: Deploy initial app ---')\n\n  // Create an app client that can find existing apps by creator and name\n  const client = algokit.getAppClient(\n    {\n      resolveBy: 'creatorAndName',\n      app: appSpec,\n      sender: account,\n      creatorAddress: account.addr,\n      findExistingUsing: indexer,\n    },\n    algodClient\n  )\n\n  // Deploy the first version of the app with VALUE=1\n  // allowDelete: true is required for the app to be deletable later\n  const createdApp = await client.deploy({\n    version: '1.0',\n    deployTimeParams: {\n      VALUE: 1,\n    },\n    allowDelete: true,\n    sendParams: { populateAppCallResources: false },\n  })\n\n  console.log('Initial app created:')\n  console.log('  App ID:', createdApp.appId)\n  console.log('  App Address:', createdApp.appAddress)\n  console.log('  Operation:', createdApp.operationPerformed)\n\n  console.log('\\n--- Step 2: Replace the app using ABI methods ---')\n\n  // Deploy again with onUpdate: 'replace'\n  // Use custom ABI methods for both delete and create operations\n  const replacedApp = await client.deploy({\n    version: '1.0',\n    deployTimeParams: {\n      VALUE: 2,\n    },\n    onUpdate: 'replace',\n    // Custom ABI method for creating the new app\n    createArgs: {\n      method: 'create_abi',\n      methodArgs: ['arg_io'], // Arguments passed to the create method\n    },\n    // Custom ABI method for deleting the old app\n    deleteArgs: {\n      method: 'delete_abi',\n      methodArgs: ['arg2_io'], // Arguments passed to the delete method\n    },\n    sendParams: { populateAppCallResources: false },\n  })\n\n  console.log('App replaced with ABI methods:')\n  console.log('  New App ID:', replacedApp.appId)\n  console.log('  New App Address:', replacedApp.appAddress)\n  console.log('  Operation:', replacedApp.operationPerformed)\n  console.log('  Old App ID (deleted):', createdApp.appId)\n\n  // Verify the replacement\n  if (replacedApp.appId > createdApp.appId) {\n    console.log('\\n✓ Replacement successful: New app ID is greater than old app ID')\n  }\n\n  // Check return values from ABI methods\n  console.log('\\nABI Method Return Values:')\n  if (replacedApp.return?.returnValue) {\n    console.log('  Create method returned:', replacedApp.return.returnValue)\n  }\n  if (replacedApp.deleteReturn?.returnValue) {\n    console.log('  Delete method returned:', replacedApp.deleteReturn.returnValue)\n  }\n\n  // Check delete result\n  if (replacedApp.deleteResult) {\n    console.log('\\nDelete operation details:')\n    console.log('  Deleted app ID:', replacedApp.deleteResult.transaction.applicationCall?.appIndex?.toString())\n    console.log('  Transaction ID:', replacedApp.deleteResult.transaction.txID())\n    console.log('  On Complete:', algosdk.OnApplicationComplete[replacedApp.deleteResult.transaction.applicationCall?.onComplete || 0])\n  }\n\n  console.log('\\n--- Summary ---')\n  console.log('Using ABI methods during replacement allows you to:')\n  console.log('  • Pass custom arguments to create and delete operations')\n  console.log('  • Capture and use return values from both operations')\n  console.log('  • Execute custom cleanup logic during deletion')\n  console.log('  • Initialize the new app with specific data during creation')\n}\n\n// Run the example\nreplaceAppWithABI().catch(console.error)\n"
}
```
