# Update Application with Deploy-Time Parameters

Demonstrates idempotent application deployment and how to update an existing application with new deploy-time parameters. Shows operation detection, round tracking, and the difference between create and update operations.

## Example Details

```json
{
  "example_id": "132-update-application-with-deploy-time-parameters",
  "title": "Update Application with Deploy-Time Parameters",
  "summary": "Demonstrates idempotent application deployment and how to update an existing application with new deploy-time parameters. Shows operation detection, round tracking, and the difference between create and update operations.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Update an existing application with new deploy-time parameters",
  "target_users": [
    "SDK developers",
    "DevOps engineers",
    "Smart contract developers"
  ],
  "features_tested": [
    "client.deploy",
    "allowUpdate",
    "onUpdate",
    "operationPerformed",
    "updatedRound vs createdRound",
    "idempotent deployment"
  ],
  "feature_tags": [
    "app-client",
    "deployment",
    "update",
    "idempotent",
    "deploy-time-params",
    "round-tracking"
  ],
  "folder": "132-update-application-with-deploy-time-parameters",
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
      "Ensure you have an app spec JSON file from your smart contract"
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
    "Deploying application with VALUE=1...",
    "Operation performed: create",
    "App ID: <number>",
    "=== UPDATING APPLICATION ===",
    "Deploying again with VALUE=2...",
    "Operation performed: update",
    "✅ Application was updated (not recreated)",
    "Round Information:",
    "  Created in Round: <round1>",
    "  Updated in Round: <round2>",
    "✅ Deploy-time parameter VALUE was updated from 1 to 2"
  ],
  "source_tests": [
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "Deploy app - update"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "app_spec.json",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "User needs to provide their own app spec with deploy-time parameters (template variables)"
    }
  ],
  "notes": "This example demonstrates idempotent deployment where the deploy() method intelligently determines whether to create or update an application. The allowUpdate flag must be set to true during initial deployment to allow future updates. Deploy-time parameters are template variables in TEAL code that can be customized at deployment time.",
  "generated_code": "import * as algokit from '@algorandfoundation/algokit-utils'\n\n// This example demonstrates updating an existing application with new deploy-time parameters\n// It shows idempotent deployment - deploy() can create or update based on the situation\n\nasync function updateApplicationWithDeployParams() {\n  // Initialize AlgoKit and get clients\n  const algod = algokit.getAlgoClient(algokit.getDefaultLocalNetConfig('algod'))\n  const indexer = algokit.getAlgoClient(algokit.getDefaultLocalNetConfig('indexer'))\n  const account = await algokit.getLocalNetDispenserAccount(algod)\n\n  // Load your application specification\n  const appSpec = '<YOUR_APP_SPEC>' // Replace with your actual app spec\n\n  console.log('Setting up app client...')\n  \n  // Create an app client\n  const client = algokit.getAppClient(\n    {\n      resolveBy: 'creatorAndName',\n      app: appSpec,\n      sender: account,\n      creatorAddress: account.addr,\n      findExistingUsing: indexer,\n    },\n    algod,\n  )\n\n  console.log('\\n=== INITIAL DEPLOYMENT ===')\n  console.log('Deploying application with VALUE=1...')\n  \n  // First deployment - create the application\n  const createdApp = await client.deploy({\n    version: '1.0',\n    deployTimeParams: {\n      VALUE: 1, // Initial deploy-time parameter\n    },\n    allowUpdate: true, // Allow future updates\n  })\n\n  console.log(`Operation performed: ${createdApp.operationPerformed}`)\n  console.log(`App ID: ${createdApp.appId}`)\n  console.log(`App Address: ${createdApp.appAddress}`)\n  console.log(`Created in Round: ${createdApp.createdRound}`)\n\n  console.log('\\n=== UPDATING APPLICATION ===')\n  console.log('Deploying again with VALUE=2...')\n  \n  // Second deployment - update the existing application\n  const updatedApp = await client.deploy({\n    version: '1.0',\n    deployTimeParams: {\n      VALUE: 2, // Updated deploy-time parameter\n    },\n    onUpdate: 'update', // Specify what to do on update\n  })\n\n  console.log(`Operation performed: ${updatedApp.operationPerformed}`)\n  \n  // Verify this was an update, not a new creation\n  if (updatedApp.operationPerformed === 'update') {\n    console.log('✅ Application was updated (not recreated)')\n    console.log(`App ID remains: ${updatedApp.appId}`)\n    console.log(`App Address remains: ${updatedApp.appAddress}`)\n    console.log(`\\nRound Information:`)\n    console.log(`  Created in Round: ${updatedApp.createdRound}`)\n    console.log(`  Updated in Round: ${updatedApp.updatedRound}`)\n    \n    // Verify the app ID didn't change\n    if (updatedApp.appId === createdApp.appId) {\n      console.log('✅ App ID unchanged (same app)')\n    }\n    \n    // Verify the address didn't change\n    if (updatedApp.appAddress === createdApp.appAddress) {\n      console.log('✅ App address unchanged (same app)')\n    }\n    \n    // Verify the created round is the same but updated round is different\n    if (updatedApp.createdRound === createdApp.createdRound) {\n      console.log('✅ Created round unchanged')\n    }\n    \n    if (updatedApp.updatedRound !== updatedApp.createdRound) {\n      console.log('✅ Updated round is different from created round')\n    }\n    \n    console.log(`\\n✅ Deploy-time parameter VALUE was updated from 1 to 2`)\n  } else {\n    console.log(`⚠️  Expected update but got: ${updatedApp.operationPerformed}`)\n  }\n\n  return { createdApp, updatedApp }\n}\n\n// Run the example\nupdateApplicationWithDeployParams()\n  .then(() => {\n    console.log('\\n✅ Example completed successfully')\n    process.exit(0)\n  })\n  .catch((error) => {\n    console.error('❌ Error:', error)\n    process.exit(1)\n  })"
}
```
