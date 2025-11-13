# Handle Schema Breaking Changes with Extra Pages

Demonstrates how the SDK detects breaking changes (like extra program pages) and handles them according to configured strategy using OnSchemaBreak options.

## Example Details

```json
{
  "example_id": "114-handle-schema-breaking-changes-with-extra-pages",
  "title": "Handle Schema Breaking Changes with Extra Pages",
  "summary": "Demonstrates how the SDK detects breaking changes (like extra program pages) and handles them according to configured strategy using OnSchemaBreak options.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Handle schema breaking changes when extra program pages are needed",
  "target_users": [
    "SDK developers",
    "DevOps engineers"
  ],
  "features_tested": [
    "factory.deploy",
    "OnSchemaBreak.Fail",
    "OnSchemaBreak.AppendApp",
    "extra pages detection",
    "OnUpdate.UpdateApp"
  ],
  "feature_tags": [
    "schema-break-detection",
    "extra-pages",
    "deployment-strategies",
    "error-handling",
    "app-factory",
    "breaking-changes"
  ],
  "folder": "114-handle-schema-breaking-changes-with-extra-pages",
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
    "Small app deployed successfully",
    "Update with OnSchemaBreak.Fail throws error about schema break",
    "Update with OnSchemaBreak.AppendApp creates new app",
    "Different app IDs for original and new app",
    "Clear explanation of schema break handling strategies"
  ],
  "source_tests": [
    {
      "file": "src/types/app-factory-and-client.spec.ts",
      "test_name": "Deploy app - update detects extra pages as breaking change"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "artifacts/small-app.arc56.json",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "ARC-56 app spec for a small application that fits in one page"
    },
    {
      "target_file": "artifacts/large-app.arc56.json",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "ARC-56 app spec for a large application that requires extra pages"
    }
  ],
  "notes": "This example requires two different app specs: a small one that fits in one page and a larger one that requires extra pages. The SDK automatically detects when extra pages would be needed and treats this as a breaking change. OnSchemaBreak.Fail prevents the deployment, while OnSchemaBreak.AppendApp creates a new app instance. OnSchemaBreak.ReplaceApp would delete and recreate at the same app ID (if using name-based deployment).",
  "generated_code": "import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'\nimport { AlgorandClient, OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils'\nimport smallAppArc56Json from './artifacts/small-app.arc56.json'\nimport largeAppArc56Json from './artifacts/large-app.arc56.json'\n\n/**\n * This example demonstrates how to handle schema breaking changes,\n * specifically when extra program pages are needed.\n * \n * Key concepts:\n * - Detecting schema breaks (extra pages requirement)\n * - Using OnSchemaBreak.Fail to prevent breaking updates\n * - Using OnSchemaBreak.AppendApp to create a new app when schema breaks\n * - Understanding deployment strategies for breaking changes\n */\n\nasync function handleSchemaBreakExample() {\n  // Setup: Initialize Algorand client and test account\n  const localnet = await algorandFixture()\n  const algorand = localnet.algorand\n\n  console.log('Step 1: Deploy small application (no extra pages)')\n  // Create factory with small app spec\n  let appFactory = algorand.client.getAppFactory({\n    appSpec: smallAppArc56Json,\n    defaultSender: localnet.context.testAccount.addr,\n  })\n\n  const { result: appCreateResult } = await appFactory.deploy({\n    updatable: true, // Allow updates\n  })\n\n  console.log(`Small app created with ID: ${appCreateResult.appId}`)\n  console.log(`Operation performed: ${appCreateResult.operationPerformed}`) // 'create'\n  console.log(`App address: ${appCreateResult.appAddress}`)\n\n  console.log('\\nStep 2: Attempt to update to larger app (requires extra pages)')\n  // Update factory to use large app spec that requires more pages\n  appFactory = algorand.client.getAppFactory({\n    appSpec: largeAppArc56Json, // This app needs extra pages\n    defaultSender: localnet.context.testAccount.addr,\n  })\n\n  console.log('\\nAttempt 1: Using OnSchemaBreak.Fail (will fail)')\n  try {\n    await appFactory.deploy({\n      updatable: true,\n      onSchemaBreak: OnSchemaBreak.Fail, // Fail if schema breaks\n      onUpdate: OnUpdate.UpdateApp,\n    })\n    console.log('❌ Unexpected: Update should have failed')\n  } catch (error) {\n    console.log('✓ Expected error caught:')\n    console.log(`  ${error instanceof Error ? error.message : error}`)\n    console.log('\\n  Schema break detected! Extra pages would break the schema.')\n    console.log('  The deployment was stopped to prevent breaking changes.')\n  }\n\n  console.log('\\nAttempt 2: Using OnSchemaBreak.AppendApp (will create new app)')\n  // This time, allow creating a new app when schema breaks\n  const { result: appAppendResult } = await appFactory.deploy({\n    updatable: true,\n    onSchemaBreak: OnSchemaBreak.AppendApp, // Create new app if schema breaks\n    onUpdate: OnUpdate.UpdateApp,\n  })\n\n  console.log(`\\n✓ New app created successfully!`)\n  console.log(`Operation performed: ${appAppendResult.operationPerformed}`) // 'create'\n  console.log(`New app ID: ${appAppendResult.appId}`)\n  console.log(`Original app ID: ${appCreateResult.appId}`)\n  console.log(`App IDs are different: ${appCreateResult.appId !== appAppendResult.appId}`)\n  \n  console.log('\\nSummary:')\n  console.log('- OnSchemaBreak.Fail: Prevents deployment when schema breaks detected')\n  console.log('- OnSchemaBreak.AppendApp: Creates a new app when schema breaks')\n  console.log('- Extra pages are detected as a breaking change')\n  console.log('- This protects your app from incompatible updates')\n}\n\n// Run the example\nhandleSchemaBreakExample().catch(console.error)"
}
```
