# Update a Deployed Updatable Application

Demonstrates how to deploy an initial version of an updatable app, then deploy an update with new code and version metadata, maintaining the same app ID throughout the update process.

## Example Details

```json
{
  "example_id": "133-update-a-deployed-updatable-application",
  "title": "Update a Deployed Updatable Application",
  "summary": "Demonstrates how to deploy an initial version of an updatable app, then deploy an update with new code and version metadata, maintaining the same app ID throughout the update process.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Deploy an updatable app, then deploy an update with new code and version, verifying the same app ID is updated",
  "target_users": [
    "SDK developers",
    "Smart contract developers",
    "DevOps engineers"
  ],
  "features_tested": [
    "algorand.appDeployer.deploy",
    "App update with onUpdate='update'",
    "Version management",
    "Idempotent deployment"
  ],
  "feature_tags": [
    "app-deployment",
    "app-update",
    "updatable-apps",
    "version-management",
    "idempotent-deployment",
    "metadata"
  ],
  "folder": "133-update-a-deployed-updatable-application",
  "prerequisites": {
    "tools": [
      "algokit",
      "docker"
    ],
    "libraries": [
      "@algorandfoundry/algokit-utils",
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
      "Start LocalNet: algokit localnet start"
    ],
    "install": [
      "npm install @algorandfoundry/algokit-utils algosdk"
    ],
    "execute": [
      "ts-node main.ts"
    ]
  },
  "expected_output": [
    "Initial deployment creates a new app with version 1.0",
    "Update deployment maintains the same app ID",
    "Version is updated to 2.0",
    "Updated round number reflects the update transaction",
    "App metadata shows updatable=true and deleted=false"
  ],
  "source_tests": [
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Deploy update to updatable updated app"
    }
  ],
  "artifacts_plan": [],
  "notes": "This example requires a running LocalNet instance. The helper functions for generating approval and clear programs are simplified for demonstration purposes. In production, you would typically load pre-compiled TEAL programs or use a smart contract framework.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundry/algokit-utils'\nimport { consoleLogger } from '@algorandfoundry/algokit-utils/types/logging'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates how to update an existing updatable application.\n * \n * Key concepts:\n * - Deploy an initial version of an updatable app\n * - Deploy an update with new code and version metadata\n * - The same app ID is maintained across updates\n * - Using onUpdate='update' to perform the update operation\n */\n\nasync function updateDeployedApp() {\n  // Initialize AlgorandClient for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  algorand.setLogger(consoleLogger)\n\n  // Get a test account with funds from LocalNet\n  const sender = await algorand.account.localNet.dispenser()\n\n  console.log('=== Deploying Initial Version of Updatable App ===')\n  \n  // Define initial app metadata with updatable flag set to true\n  const initialMetadata = {\n    name: 'MyUpdatableApp',\n    version: '1.0',\n    updatable: true,\n    deletable: false,\n  }\n\n  // Deploy the initial version\n  const deployment1 = {\n    sender: sender.addr,\n    metadata: initialMetadata,\n    // In a real scenario, you would provide your approval and clear programs\n    approvalProgram: await getApprovalProgram(1), // Version 1 code\n    clearStateProgram: await getClearProgram(),\n    schema: {\n      globalUints: 1,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n  }\n\n  const result1 = await algorand.appDeployer.deploy(deployment1)\n\n  if ('transaction' in result1) {\n    console.log(`✓ Initial deployment successful`)\n    console.log(`  App ID: ${result1.appId}`)\n    console.log(`  Version: ${result1.version}`)\n    console.log(`  Created Round: ${result1.createdRound}`)\n    console.log(`  Transaction ID: ${result1.transaction.txID()}`)\n  }\n\n  // Wait for indexer to catch up\n  await new Promise(resolve => setTimeout(resolve, 2000))\n\n  console.log('\\n=== Deploying Update (Version 2.0) ===')\n\n  // Define updated metadata with new version\n  const updatedMetadata = {\n    ...initialMetadata,\n    version: '2.0',\n  }\n\n  // Deploy the update with new code\n  const deployment2 = {\n    sender: sender.addr,\n    metadata: updatedMetadata,\n    approvalProgram: await getApprovalProgram(2), // Version 2 code (different)\n    clearStateProgram: await getClearProgram(),\n    schema: {\n      globalUints: 1,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n    // Specify onUpdate='update' to update the existing app\n    onUpdate: 'update' as const,\n  }\n\n  const result2 = await algorand.appDeployer.deploy(deployment2)\n\n  if ('transaction' in result2 && result2.confirmation) {\n    console.log(`✓ Update deployment successful`)\n    console.log(`  App ID: ${result2.appId} (same as before: ${result1.appId === result2.appId})`)\n    console.log(`  Version: ${result2.version}`)\n    console.log(`  Updated Round: ${result2.updatedRound}`)\n    console.log(`  Transaction ID: ${result2.transaction.txID()}`)\n    console.log(`\\n  Metadata:`)    \n    console.log(`    - Updatable: ${result2.updatable}`)\n    console.log(`    - Deletable: ${result2.deletable}`)\n    console.log(`    - Deleted: ${result2.deleted}`)\n  }\n\n  console.log('\\n=== Summary ===')\n  console.log(`The app was successfully updated from v${result1.version} to v${result2.version}`)\n  console.log(`The app ID remained constant: ${result2.appId}`)\n  console.log(`This demonstrates idempotent deployment with update capability.`)\n}\n\n/**\n * Helper function to generate approval program\n * In a real application, this would load your TEAL code or compiled program\n */\nasync function getApprovalProgram(version: number): Promise<Uint8Array> {\n  // Simple approval program that stores a value (version) in global state\n  const tealCode = `#pragma version 10\n  txn ApplicationID\n  int 0\n  ==\n  bnz create\n  \n  txn OnCompletion\n  int UpdateApplication\n  ==\n  bnz update\n  \n  int 1\n  return\n  \n  create:\n  byte \"version\"\n  int ${version}\n  app_global_put\n  int 1\n  return\n  \n  update:\n  byte \"version\"\n  int ${version}\n  app_global_put\n  int 1\n  return`\n  \n  const client = algosdk.makeApplicationClient(\n    algosdk.algodClient('http://localhost', 4001, 'a'.repeat(64))\n  )\n  const compiled = await algosdk.compileProgram(client, tealCode)\n  return compiled.compiledProgram\n}\n\n/**\n * Helper function to generate clear state program\n */\nasync function getClearProgram(): Promise<Uint8Array> {\n  const tealCode = `#pragma version 10\n  int 1`\n  \n  const client = algosdk.makeApplicationClient(\n    algosdk.algodClient('http://localhost', 4001, 'a'.repeat(64))\n  )\n  const compiled = await algosdk.compileProgram(client, tealCode)\n  return compiled.compiledProgram\n}\n\n// Run the example\nupdateDeployedApp().catch(console.error)"
}
```
