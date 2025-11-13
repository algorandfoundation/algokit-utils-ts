# Deploy App with Replacement Strategy

Demonstrates how to deploy a new version of an app by replacing the existing app with a completely new one, including deletion of the old app and creation of a new app with updated code.

## Example Details

```json
{
  "example_id": "106-deploy-app-with-replacement-strategy",
  "title": "Deploy App with Replacement Strategy",
  "summary": "Demonstrates how to deploy a new version of an app by replacing the existing app with a completely new one, including deletion of the old app and creation of a new app with updated code.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Deploy a deletable app, then deploy with onUpdate='replace' to delete the old app and create a new one",
  "target_users": [
    "SDK developers",
    "DevOps engineers",
    "Smart contract developers"
  ],
  "features_tested": [
    "algorand.appDeployer.deploy",
    "onUpdate parameter",
    "app replacement",
    "app deletion"
  ],
  "feature_tags": [
    "deployment",
    "app-replacement",
    "versioning",
    "lifecycle-management",
    "deletable-apps"
  ],
  "folder": "106-deploy-app-with-replacement-strategy",
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
        "name": "DEPLOYER_MNEMONIC",
        "required": true,
        "example": "your 25-word mnemonic phrase"
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start LocalNet: algokit localnet start",
      "Ensure you have a funded account for deployment"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Initial app deployed with v1.0",
    "Initial app ID displayed",
    "Replacement app deployed with v2.0",
    "New app ID displayed (different from initial)",
    "Confirmation that old app was deleted",
    "Summary showing the replacement strategy worked"
  ],
  "source_tests": [
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Deploy replacement to deletable, updated app"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "package.json",
      "type": "config",
      "action": "generate",
      "source_path": null,
      "note": "Package.json with required dependencies"
    },
    {
      "target_file": "README.md",
      "type": "config",
      "action": "generate",
      "source_path": null,
      "note": "Explanation of the replacement strategy and when to use it"
    }
  ],
  "notes": "This example focuses on the 'replace' deployment strategy, which is useful when you want to completely replace an app rather than update it in place. The app must be marked as deletable for this strategy to work.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport * as algokit from '@algorandfoundation/algokit-utils'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates how to replace an existing Algorand app with a new one.\n * \n * When you need to deploy a new version of your app but prefer complete replacement\n * over updating the existing app, you can use the 'replace' strategy. This will:\n * 1. Delete the old app (if it's deletable)\n * 2. Create a new app with the updated code and metadata\n * \n * This is useful when:\n * - You want a clean slate with a new app ID\n * - The changes are too significant for an update\n * - You want to reset all global/local state\n */\n\nasync function main() {\n  // Initialize AlgorandClient for local development\n  const algorand = AlgorandClient.defaultLocalNet()\n  const account = await algorand.account.fromEnvironment('DEPLOYER')\n  \n  console.log('=== Deploying Initial App (v1.0) ===')\n  console.log(`Using account: ${account.addr}\\n`)\n  \n  // Define approval and clear programs for v1.0\n  const approvalProgramV1 = `#pragma version 10\n  // Simple approval program v1.0\n  int 1\n  return`\n  \n  const clearProgram = `#pragma version 10\n  // Clear state program\n  int 1\n  return`\n  \n  // Compile the programs\n  const approvalV1 = await algorand.client.algod.compile(approvalProgramV1).do()\n  const clear = await algorand.client.algod.compile(clearProgram).do()\n  \n  // Deploy the first version of the app\n  // Set deletable: true so we can replace it later\n  const deployment1 = {\n    sender: account.addr,\n    approvalProgram: new Uint8Array(Buffer.from(approvalV1.result, 'base64')),\n    clearStateProgram: new Uint8Array(Buffer.from(clear.result, 'base64')),\n    schema: {\n      globalUints: 1,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n    metadata: {\n      name: 'MyApp',\n      version: '1.0',\n      deletable: true,  // Important: must be deletable to allow replacement\n      updatable: true,\n    },\n  }\n  \n  const result1 = await algorand.appDeployer.deploy(deployment1)\n  \n  console.log(`✅ Initial deployment successful!`)\n  console.log(`   App ID: ${result1.appId}`)\n  console.log(`   Version: ${result1.version}`)\n  console.log(`   Operation: ${result1.operationPerformed}`)\n  console.log(`   Deletable: ${result1.deletable}`)\n  console.log(`   Updatable: ${result1.updatable}\\n`)\n  \n  // Wait a moment for the transaction to be processed\n  await new Promise(resolve => setTimeout(resolve, 1000))\n  \n  console.log('=== Deploying Replacement App (v2.0) ===')\n  \n  // Define updated approval program for v2.0\n  const approvalProgramV2 = `#pragma version 10\n  // Updated approval program v2.0 with changes\n  int 2\n  return`\n  \n  const approvalV2 = await algorand.client.algod.compile(approvalProgramV2).do()\n  \n  // Deploy the replacement app\n  // Use onUpdate: 'replace' to delete old app and create new one\n  const deployment2 = {\n    sender: account.addr,\n    approvalProgram: new Uint8Array(Buffer.from(approvalV2.result, 'base64')),\n    clearStateProgram: new Uint8Array(Buffer.from(clear.result, 'base64')),\n    schema: {\n      globalUints: 1,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n    metadata: {\n      name: 'MyApp',\n      version: '2.0',\n      deletable: true,\n      updatable: true,\n    },\n    onUpdate: 'replace',  // This triggers the replacement strategy\n  }\n  \n  const result2 = await algorand.appDeployer.deploy(deployment2)\n  \n  console.log(`✅ Replacement deployment successful!`)\n  console.log(`   New App ID: ${result2.appId}`)\n  console.log(`   Old App ID: ${result1.appId}`)\n  console.log(`   App IDs are different: ${result2.appId !== result1.appId}`)\n  console.log(`   Version: ${result2.version}`)\n  console.log(`   Operation: ${result2.operationPerformed}`)\n  \n  // Check if the old app was deleted\n  if (result2.deleteResult) {\n    console.log(`   ✅ Old app was deleted successfully`)\n    console.log(`   Delete transaction ID: ${result2.deleteResult.transaction.txID()}\\n`)\n  }\n  \n  console.log('=== Summary ===')\n  console.log(`The replacement strategy allows you to:`)\n  console.log(`1. Delete the old app (App ID: ${result1.appId})`)\n  console.log(`2. Create a new app (App ID: ${result2.appId})`)\n  console.log(`3. Start fresh with new state and a new app ID`)\n  console.log(`\\nNote: The old app must be deletable for this to work!`)\n}\n\nmain().catch(console.error)"
}
```
