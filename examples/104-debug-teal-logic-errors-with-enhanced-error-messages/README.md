# Debug TEAL Logic Errors with Enhanced Error Messages

Demonstrates how AlgoKit Utils SDK automatically provides enhanced error messages when TEAL logic errors occur, including detailed stack traces, program counter information, and transaction traces.

## Example Details

```json
{
  "example_id": "104-debug-teal-logic-errors-with-enhanced-error-messages",
  "title": "Debug TEAL Logic Errors with Enhanced Error Messages",
  "summary": "Demonstrates how AlgoKit Utils SDK automatically provides enhanced error messages when TEAL logic errors occur, including detailed stack traces, program counter information, and transaction traces.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "error handling",
  "specific_use_case": "Handle and debug a TEAL logic error with enhanced error messages",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "error handling",
    "logic error debugging",
    "error.led",
    "error traces",
    "TEAL stack traces"
  ],
  "feature_tags": [
    "error-handling",
    "debugging",
    "teal",
    "logic-errors",
    "app-client",
    "error-traces"
  ],
  "folder": "104-debug-teal-logic-errors-with-enhanced-error-messages",
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
      "Start LocalNet: algokit localnet start"
    ],
    "install": [
      "npm install"
    ],
    "execute": [
      "npm run start"
    ]
  },
  "expected_output": [
    "Application deployed with ID",
    "Logic error caught with enhanced debugging information",
    "Program counter (PC) location",
    "Detailed TEAL stack trace",
    "Transaction ID and error message",
    "Number of traces available"
  ],
  "source_tests": [
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "Display nice error messages when there is a logic error"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.algo.ts",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Simple contract with an error method that demonstrates TEAL logic errors"
    },
    {
      "target_file": "package.json",
      "type": "config",
      "action": "generate",
      "source_path": null,
      "note": "Package configuration with dependencies"
    }
  ],
  "notes": "This example requires a smart contract with an 'error' method that intentionally fails with an assert. The enhanced error messages are automatically provided by the AlgoKit Utils SDK.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates how AlgoKit Utils SDK provides enhanced error messages\n * when TEAL logic errors occur during smart contract execution.\n * \n * The SDK automatically:\n * - Captures the TEAL stack trace\n * - Provides the program counter (PC) where the error occurred\n * - Shows the exact TEAL instruction that failed\n * - Includes transaction traces for debugging\n */\n\nasync function debugLogicErrors() {\n  // Initialize the AlgorandClient for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  const algod = algorand.client.algod\n  const indexer = algorand.client.indexer\n  \n  // Get a test account with funds\n  const testAccount = await algorand.account.localNet.dispenser()\n  \n  console.log('Deploying application with intentional error...')\n  \n  // Deploy your application (replace with your app spec)\n  // This example assumes you have an appSpec with an 'error' method\n  const appClient = algorand.client.getTypedAppClient({\n    sender: testAccount,\n    // Your app spec here\n  })\n  \n  await appClient.create.bare()\n  const app = await appClient.appClient.getAppReference()\n  \n  console.log(`Application deployed with ID: ${app.appId}`)\n  console.log(`Application address: ${app.appAddress}`)\n  \n  // Call a method that will cause a TEAL logic error\n  console.log('\\nCalling method that will trigger a logic error...')\n  \n  try {\n    await appClient.call({\n      method: 'error',\n      methodArgs: [],\n    })\n    \n    // This line should never be reached\n    console.log('No error occurred (unexpected!)')\n    \n  } catch (e: any) {\n    console.log('\\n❌ Logic error caught! Here\\'s the enhanced debugging information:\\n')\n    \n    // The SDK provides a 'led' (Logic Error Details) object\n    console.log('=== Logic Error Details (e.led) ===')\n    console.log(`Program Counter: ${e.led.pc}`)\n    console.log(`Error Message: ${e.led.msg}`)\n    console.log(`Transaction ID: ${e.led.txId}`)\n    console.log(`Number of traces: ${e.led.traces.length}`)\n    \n    // The stack trace shows exactly where in the TEAL code the error occurred\n    console.log('\\n=== TEAL Stack Trace ===')\n    console.log(e.stack)\n    \n    // Additional information available in the error object\n    console.log('\\n=== Additional Debug Info ===')\n    console.log(`Transaction confirmed: ${e.led.txId.length === 52}`)\n    console.log(`Error type: TEAL logic error (assert failed)`)\n    \n    // The error details help you:\n    // 1. Find the exact line in your TEAL code that failed\n    // 2. Understand why the assertion failed\n    // 3. Access transaction traces for step-by-step debugging\n    \n    console.log('\\n✅ Error debugging information successfully captured')\n    console.log('\\nKey features demonstrated:')\n    console.log('- Detailed TEAL stack traces showing the error location')\n    console.log('- Program counter (PC) for pinpointing the instruction')\n    console.log('- Transaction ID for looking up details on the blockchain')\n    console.log('- Error traces for step-by-step debugging')\n    console.log('\\nThis makes debugging TEAL logic errors much easier!')\n  }\n}\n\ndebugLogicErrors().catch(console.error)"
}
```
