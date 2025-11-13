# Fail-Fast Deployment Strategy with onUpdate=Fail

Demonstrates using the onUpdate='fail' parameter to implement a fail-fast deployment strategy. When an existing app is detected, the deployment immediately stops with an error instead of updating or replacing the app.

## Example Details

```json
{
  "example_id": "110-fail-fast-deployment-strategy-with-onupdatefail",
  "title": "Fail-Fast Deployment Strategy with onUpdate=Fail",
  "summary": "Demonstrates using the onUpdate='fail' parameter to implement a fail-fast deployment strategy. When an existing app is detected, the deployment immediately stops with an error instead of updating or replacing the app.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "medium",
  "use_case_category": "error handling",
  "specific_use_case": "Deploy an app, then attempt to deploy an update with onUpdate='fail', verifying that deployment stops with an error",
  "target_users": [
    "SDK developers",
    "DevOps engineers"
  ],
  "features_tested": [
    "algorand.appDeployer.deploy",
    "onUpdate='fail' parameter",
    "Deployment strategies",
    "Error handling"
  ],
  "feature_tags": [
    "app-deployment",
    "deployment-strategies",
    "error-handling",
    "fail-fast",
    "devops",
    "onUpdate-parameter"
  ],
  "folder": "110-fail-fast-deployment-strategy-with-onupdatefail",
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
    "Initial deployment creates a new app successfully",
    "Second deployment attempt with onUpdate='fail' throws an error",
    "Error message: 'Update detected and onUpdate=Fail, stopping deployment'",
    "No transaction is sent for the second deployment",
    "Educational explanation of all onUpdate strategies and their use cases"
  ],
  "source_tests": [
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Deploy failure for updated app fails if onupdate = Fail"
    }
  ],
  "artifacts_plan": [],
  "notes": "The onUpdate='fail' strategy is particularly useful in CI/CD pipelines where you want to prevent accidental updates to production apps. It provides a safety mechanism that requires explicit action to update existing apps. This example also provides comprehensive documentation of all available onUpdate strategies.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundry/algokit-utils'\nimport { consoleLogger } from '@algorandfoundry/algokit-utils/types/logging'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates the fail-fast deployment strategy using onUpdate='fail'.\n * \n * Key concepts:\n * - Deploy an initial version of an app\n * - Attempt to deploy again with onUpdate='fail'\n * - Deployment stops immediately when an existing app is detected\n * - Useful for strict CI/CD pipelines that should never update production apps\n */\n\nasync function failFastDeployment() {\n  // Initialize AlgorandClient for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  algorand.setLogger(consoleLogger)\n\n  // Get a test account with funds from LocalNet\n  const sender = await algorand.account.localNet.dispenser()\n\n  console.log('=== Initial App Deployment ===')\n  \n  // Define app metadata\n  const metadata = {\n    name: 'MyProductionApp',\n    version: '1.0',\n    updatable: true,\n    deletable: false,\n  }\n\n  // Deploy the initial version\n  const deployment1 = {\n    sender: sender.addr,\n    metadata: metadata,\n    approvalProgram: await getApprovalProgram(1),\n    clearStateProgram: await getClearProgram(),\n    schema: {\n      globalUints: 1,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n  }\n\n  const result1 = await algorand.appDeployer.deploy(deployment1)\n\n  if ('transaction' in result1) {\n    console.log(`✓ Initial deployment successful`)\n    console.log(`  App ID: ${result1.appId}`)\n    console.log(`  Version: ${result1.version}`)\n    console.log(`  Transaction ID: ${result1.transaction.txID()}`)\n  }\n\n  // Wait for indexer to catch up\n  await new Promise(resolve => setTimeout(resolve, 2000))\n\n  console.log('\\n=== Attempting Deployment with onUpdate=\\'fail\\' ===')\n  console.log('This will fail because an app with the same name already exists.\\n')\n\n  // Attempt to deploy again with onUpdate='fail'\n  const deployment2 = {\n    sender: sender.addr,\n    metadata: metadata, // Same metadata as before\n    approvalProgram: await getApprovalProgram(2), // Different code\n    clearStateProgram: await getClearProgram(),\n    schema: {\n      globalUints: 1,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n    // Setting onUpdate='fail' means deployment will error if app exists\n    onUpdate: 'fail' as const,\n  }\n\n  try {\n    await algorand.appDeployer.deploy(deployment2)\n    \n    // We should never reach this line\n    console.log('❌ ERROR: Deployment should have failed but succeeded!')\n  } catch (error: any) {\n    console.log('✓ Deployment failed as expected (onUpdate=\\'fail\\')')\n    console.log(`\\n=== Error Details ===')\n    console.log(`Error message: ${error.message}`)\n    \n    // Check the specific error message\n    if (error.message.includes('Update detected and onUpdate=Fail')) {\n      console.log('\\nThis error indicates that:')\n      console.log('  - An existing app with the same metadata was found')\n      console.log('  - The onUpdate parameter was set to \\'fail\\'')\n      console.log('  - The deployment was stopped before any transaction was sent')\n    }\n  }\n\n  console.log('\\n=== Understanding onUpdate Strategies ===')\n  console.log('\\nThe onUpdate parameter controls behavior when an existing app is detected:\\n')\n  console.log('  • onUpdate=\"fail\" (used here):')\n  console.log('    - Immediately stops deployment with an error')\n  console.log('    - No transactions are sent to the network')\n  console.log('    - Use in strict production environments')\n  console.log('    - Prevents accidental updates\\n')\n  console.log('  • onUpdate=\"update\":')\n  console.log('    - Updates the existing app with new code')\n  console.log('    - Requires updatable=true in original deployment')\n  console.log('    - Use for controlled app version upgrades\\n')\n  console.log('  • onUpdate=\"replace\":')\n  console.log('    - Deletes the old app and creates a new one')\n  console.log('    - Requires deletable=true in original deployment')\n  console.log('    - Use when app ID can change\\n')\n  console.log('  • onUpdate=\"append\":')\n  console.log('    - Creates a new app instance (doesn\\'t update existing)')\n  console.log('    - Use when you want multiple versions running\\n')\n\n  console.log('=== Use Cases for onUpdate=\"fail\" ===')\n  console.log('\\n1. Production deployment pipelines:')\n  console.log('   - Prevent accidental overwrites of production apps')\n  console.log('   - Require explicit manual intervention for updates\\n')\n  console.log('2. Immutable deployment requirements:')\n  console.log('   - Enforce that apps are never updated after initial deployment')\n  console.log('   - Audit compliance scenarios\\n')\n  console.log('3. Testing and validation:')\n  console.log('   - Ensure deployment scripts are idempotent')\n  console.log('   - Catch configuration errors before they reach production')\n}\n\n/**\n * Helper function to generate approval program\n */\nasync function getApprovalProgram(version: number): Promise<Uint8Array> {\n  const tealCode = `#pragma version 10\n  txn ApplicationID\n  int 0\n  ==\n  bnz create\n  \n  int 1\n  return\n  \n  create:\n  byte \"version\"\n  int ${version}\n  app_global_put\n  int 1\n  return`\n  \n  const client = algosdk.makeApplicationClient(\n    algosdk.algodClient('http://localhost', 4001, 'a'.repeat(64))\n  )\n  const compiled = await algosdk.compileProgram(client, tealCode)\n  return compiled.compiledProgram\n}\n\n/**\n * Helper function to generate clear state program\n */\nasync function getClearProgram(): Promise<Uint8Array> {\n  const tealCode = `#pragma version 10\n  int 1`\n  \n  const client = algosdk.makeApplicationClient(\n    algosdk.algodClient('http://localhost', 4001, 'a'.repeat(64))\n  )\n  const compiled = await algosdk.compileProgram(client, tealCode)\n  return compiled.compiledProgram\n}\n\n// Run the example\nfailFastDeployment().catch(console.error)"
}
```
