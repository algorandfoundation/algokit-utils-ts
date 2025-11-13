# Handle Errors When Replacing Permanent Apps

Demonstrates proper error handling when attempting to replace a permanent (non-deletable) app. Shows how to detect and handle logic errors that occur when trying to delete an app that cannot be deleted.

## Example Details

```json
{
  "example_id": "112-handle-errors-when-replacing-permanent-apps",
  "title": "Handle Errors When Replacing Permanent Apps",
  "summary": "Demonstrates proper error handling when attempting to replace a permanent (non-deletable) app. Shows how to detect and handle logic errors that occur when trying to delete an app that cannot be deleted.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "error handling",
  "specific_use_case": "Deploy a permanent (non-deletable) app and attempt to replace it, verifying the deletion fails with a logic error",
  "target_users": [
    "SDK developers",
    "Smart contract developers",
    "DevOps engineers"
  ],
  "features_tested": [
    "algorand.appDeployer.deploy",
    "LogicError.parseLogicError",
    "error handling",
    "app permanence"
  ],
  "feature_tags": [
    "error-handling",
    "permanent-apps",
    "logic-errors",
    "deployment-strategies",
    "app-lifecycle"
  ],
  "folder": "112-handle-errors-when-replacing-permanent-apps",
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
    "Permanent app deployed successfully",
    "Attempt to replace the app fails with an error",
    "Logic error is caught and parsed",
    "Detailed explanation of why the error occurred",
    "Suggestions for alternative approaches",
    "Confirmation that the original app remains unchanged"
  ],
  "source_tests": [
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Deploy failure for replacement of permanent, updated app"
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
      "note": "Explanation of permanent apps and error handling best practices"
    }
  ],
  "notes": "This example is important for teaching developers about the implications of the deletable flag and proper error handling when deployment strategies fail. It demonstrates defensive programming and helps developers understand app lifecycle constraints.",
  "generated_code": "import { AlgorandClient, LogicError } from '@algorandfoundation/algokit-utils'\nimport * as algokit from '@algorandfoundation/algokit-utils'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates what happens when you try to replace a permanent app.\n * \n * When an app is deployed with deletable: false, it becomes permanent and cannot\n * be deleted. Attempting to use the 'replace' strategy on such an app will fail\n * with a logic error.\n * \n * This example shows:\n * 1. How to deploy a permanent app\n * 2. What happens when you try to replace it\n * 3. How to properly handle and parse the resulting logic error\n * 4. The importance of the deletable flag in app metadata\n */\n\nasync function main() {\n  // Initialize AlgorandClient for local development\n  const algorand = AlgorandClient.defaultLocalNet()\n  const account = await algorand.account.fromEnvironment('DEPLOYER')\n  \n  console.log('=== Deploying Permanent App (deletable: false) ===')\n  console.log(`Using account: ${account.addr}\\n`)\n  \n  // Define approval and clear programs\n  const approvalProgram = `#pragma version 10\n  // Approval program for permanent app\n  int 1\n  return`\n  \n  const clearProgram = `#pragma version 10\n  // Clear state program\n  int 1\n  return`\n  \n  // Compile the programs\n  const approval = await algorand.client.algod.compile(approvalProgram).do()\n  const clear = await algorand.client.algod.compile(clearProgram).do()\n  \n  // Deploy the permanent app\n  // IMPORTANT: deletable is set to false, making this app permanent\n  const deployment1 = {\n    sender: account.addr,\n    approvalProgram: new Uint8Array(Buffer.from(approval.result, 'base64')),\n    clearStateProgram: new Uint8Array(Buffer.from(clear.result, 'base64')),\n    schema: {\n      globalUints: 1,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n    metadata: {\n      name: 'PermanentApp',\n      version: '1.0',\n      deletable: false,  // This makes the app permanent!\n      updatable: true,   // Still updatable, but not deletable\n    },\n  }\n  \n  const result1 = await algorand.appDeployer.deploy(deployment1)\n  \n  console.log(`✅ Permanent app deployed successfully!`)\n  console.log(`   App ID: ${result1.appId}`)\n  console.log(`   Version: ${result1.version}`)\n  console.log(`   Deletable: ${result1.deletable} ⚠️`)\n  console.log(`   Updatable: ${result1.updatable}\\n`)\n  \n  // Wait a moment for the transaction to be processed\n  await new Promise(resolve => setTimeout(resolve, 1000))\n  \n  console.log('=== Attempting to Replace Permanent App (v2.0) ===')\n  console.log('⚠️  This should fail because the app is not deletable...\\n')\n  \n  // Define updated approval program for v2.0\n  const approvalProgramV2 = `#pragma version 10\n  // Updated approval program v2.0\n  int 2\n  return`\n  \n  const approvalV2 = await algorand.client.algod.compile(approvalProgramV2).do()\n  \n  // Attempt to deploy with replace strategy\n  const deployment2 = {\n    sender: account.addr,\n    approvalProgram: new Uint8Array(Buffer.from(approvalV2.result, 'base64')),\n    clearStateProgram: new Uint8Array(Buffer.from(clear.result, 'base64')),\n    schema: {\n      globalUints: 1,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n    metadata: {\n      name: 'PermanentApp',\n      version: '2.0',\n      deletable: false,\n      updatable: true,\n    },\n    onUpdate: 'replace',  // This will attempt to delete and recreate\n  }\n  \n  try {\n    // This should fail!\n    await algorand.appDeployer.deploy(deployment2)\n    console.log('❌ Unexpected: Deployment succeeded (this should not happen!)')\n  } catch (error: any) {\n    // Expected error path\n    console.log('✅ Expected error occurred!\\n')\n    console.log('=== Error Details ===')\n    console.log(`Error message: ${error.message}\\n`)\n    \n    // Parse the logic error for more details\n    const logicError = LogicError.parseLogicError(error)\n    \n    if (logicError) {\n      console.log('=== Parsed Logic Error ===')\n      console.log(`Transaction ID: ${logicError.txId}`)\n      console.log(`Program: ${logicError.program}`)\n      console.log(`Line: ${logicError.line}`)\n      console.log(`Message: ${logicError.message}\\n`)\n    }\n    \n    console.log('=== Why Did This Fail? ===')\n    console.log('The app was deployed with deletable: false, making it permanent.')\n    console.log('When you try to use the \"replace\" strategy, it attempts to:')\n    console.log('  1. Delete the old app')\n    console.log('  2. Create a new app')\n    console.log('')\n    console.log('Step 1 fails because the app\\'s approval program does not allow deletion.')\n    console.log('This is by design - permanent apps cannot be deleted!\\n')\n    \n    console.log('=== What Should You Do Instead? ===')\n    console.log('For permanent apps, you have these options:')\n    console.log('  1. Use onUpdate: \"update\" to update the existing app in place')\n    console.log('  2. Deploy a completely new app with a different name')\n    console.log('  3. Design the app to be deletable from the start if replacement is needed\\n')\n  }\n  \n  console.log('=== Verification ===')\n  console.log(`Original app (${result1.appId}) is still alive and unchanged.`)\n  console.log('You can verify this by querying the app from the blockchain.\\n')\n}\n\nmain().catch(console.error)"
}
```
