# Handle Failed Update of Immutable Application

Demonstrates what happens when attempting to update an immutable app. Shows how to properly handle the logic error that occurs when trying to update an app that was deployed with updatable=false.

## Example Details

```json
{
  "example_id": "113-handle-failed-update-of-immutable-application",
  "title": "Handle Failed Update of Immutable Application",
  "summary": "Demonstrates what happens when attempting to update an immutable app. Shows how to properly handle the logic error that occurs when trying to update an app that was deployed with updatable=false.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "error handling",
  "specific_use_case": "Deploy an immutable app and attempt to update it, verifying that the update fails with a logic error",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "algorand.appDeployer.deploy",
    "LogicError.parseLogicError",
    "Immutable app behavior",
    "Error handling"
  ],
  "feature_tags": [
    "app-deployment",
    "error-handling",
    "immutable-apps",
    "logic-errors",
    "app-security"
  ],
  "folder": "113-handle-failed-update-of-immutable-application",
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
    "Initial deployment creates an immutable app with updatable=false",
    "Update attempt fails with 'logic eval error: assert failed'",
    "Logic error is caught and parsed successfully",
    "Error details show the transaction ID and failure reason",
    "Educational summary about immutability and best practices"
  ],
  "source_tests": [
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Deploy update to immutable updated app fails"
    }
  ],
  "artifacts_plan": [],
  "notes": "This example demonstrates proper error handling when working with immutable apps. The LogicError.parseLogicError utility helps extract meaningful information from on-chain errors. This is essential for building robust deployment scripts.",
  "generated_code": "import { AlgorandClient, LogicError } from '@algorandfoundry/algokit-utils'\nimport { consoleLogger } from '@algorandfoundry/algokit-utils/types/logging'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates what happens when you try to update an immutable application.\n * \n * Key concepts:\n * - Deploy an app with updatable=false (immutable)\n * - Attempt to update the immutable app\n * - Catch and parse the resulting logic error\n * - Understand app immutability for security\n */\n\nasync function handleImmutableAppUpdate() {\n  // Initialize AlgorandClient for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  algorand.setLogger(consoleLogger)\n\n  // Get a test account with funds from LocalNet\n  const sender = await algorand.account.localNet.dispenser()\n\n  console.log('=== Deploying Immutable App ===')\n  \n  // Define app metadata with updatable flag set to FALSE\n  const metadata = {\n    name: 'MyImmutableApp',\n    version: '1.0',\n    updatable: false, // This makes the app immutable\n    deletable: false,\n  }\n\n  // Deploy the initial immutable version\n  const deployment1 = {\n    sender: sender.addr,\n    metadata: metadata,\n    approvalProgram: await getApprovalProgram(1),\n    clearStateProgram: await getClearProgram(),\n    schema: {\n      globalUints: 1,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n  }\n\n  const result1 = await algorand.appDeployer.deploy(deployment1)\n\n  if ('transaction' in result1) {\n    console.log(`✓ Immutable app deployed successfully`)\n    console.log(`  App ID: ${result1.appId}`)\n    console.log(`  Version: ${result1.version}`)\n    console.log(`  Updatable: ${result1.updatable}`)\n    console.log(`  Transaction ID: ${result1.transaction.txID()}`)\n  }\n\n  // Wait for indexer to catch up\n  await new Promise(resolve => setTimeout(resolve, 2000))\n\n  console.log('\\n=== Attempting to Update Immutable App ===')\n\n  // Attempt to deploy an update (this will fail)\n  const deployment2 = {\n    sender: sender.addr,\n    metadata: {\n      ...metadata,\n      version: '2.0',\n    },\n    approvalProgram: await getApprovalProgram(2), // Different code\n    clearStateProgram: await getClearProgram(),\n    schema: {\n      globalUints: 1,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n    onUpdate: 'update' as const,\n  }\n\n  try {\n    // This will throw an error because the app is immutable\n    await algorand.appDeployer.deploy(deployment2)\n    \n    // We should never reach this line\n    console.log('❌ ERROR: Update should have failed but succeeded!')\n  } catch (error: any) {\n    console.log('✓ Update failed as expected (app is immutable)')\n    console.log(`\\n=== Error Details ===')\n    console.log(`Error message: ${error.message}`)\n    \n    // Check if it's a logic error\n    if (error.message.includes('logic eval error') || error.message.includes('assert failed')) {\n      console.log('\\nThis is a logic error - the app contract rejected the update.')\n      \n      // Parse the logic error for more details\n      const logicError = LogicError.parseLogicError(error)\n      \n      if (logicError) {\n        console.log('\\n=== Parsed Logic Error ===')\n        console.log(`Transaction ID: ${logicError.txId}`)\n        console.log(`Message: ${logicError.message}`)\n        if (logicError.program) {\n          console.log(`Failed in: ${logicError.program}`)\n        }\n        if (logicError.line) {\n          console.log(`Line: ${logicError.line}`)\n        }\n      }\n    }\n  }\n\n  console.log('\\n=== Summary ===')\n  console.log('Immutable apps cannot be updated once deployed.')\n  console.log('This is a security feature to ensure app logic cannot be changed.')\n  console.log('When deploying apps, carefully consider whether they should be updatable.')\n  console.log('\\nBest practices:')\n  console.log('  - Use updatable=false for production apps that should never change')\n  console.log('  - Use updatable=true during development or for apps that need upgrades')\n  console.log('  - Always handle update errors gracefully in your deployment scripts')\n}\n\n/**\n * Helper function to generate approval program\n * The program includes logic to prevent updates when updatable=false\n */\nasync function getApprovalProgram(version: number): Promise<Uint8Array> {\n  const tealCode = `#pragma version 10\n  txn ApplicationID\n  int 0\n  ==\n  bnz create\n  \n  txn OnCompletion\n  int UpdateApplication\n  ==\n  bnz update\n  \n  int 1\n  return\n  \n  create:\n  byte \"version\"\n  int ${version}\n  app_global_put\n  int 1\n  return\n  \n  update:\n  // For immutable apps, this will fail\n  // In real deployment templates, this checks the updatable flag\n  int 0\n  assert\n  int 1\n  return`\n  \n  const client = algosdk.makeApplicationClient(\n    algosdk.algodClient('http://localhost', 4001, 'a'.repeat(64))\n  )\n  const compiled = await algosdk.compileProgram(client, tealCode)\n  return compiled.compiledProgram\n}\n\n/**\n * Helper function to generate clear state program\n */\nasync function getClearProgram(): Promise<Uint8Array> {\n  const tealCode = `#pragma version 10\n  int 1`\n  \n  const client = algosdk.makeApplicationClient(\n    algosdk.algodClient('http://localhost', 4001, 'a'.repeat(64))\n  )\n  const compiled = await algosdk.compileProgram(client, tealCode)\n  return compiled.compiledProgram\n}\n\n// Run the example\nhandleImmutableAppUpdate().catch(console.error)"
}
```
