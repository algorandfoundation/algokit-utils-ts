# Debug Smart Contract Logic Errors

Demonstrates how to handle and debug logic errors in smart contracts with detailed error information including program counter, stack traces, and source code context.

## Example Details

```json
{
  "example_id": "103-debug-smart-contract-logic-errors",
  "title": "Debug Smart Contract Logic Errors",
  "summary": "Demonstrates how to handle and debug logic errors in smart contracts with detailed error information including program counter, stack traces, and source code context.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "error handling",
  "specific_use_case": "Handle and debug logic errors in smart contracts",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "error handling",
    "logic error details",
    "error traces",
    "program counter tracking",
    "stack traces with source context"
  ],
  "feature_tags": [
    "error-handling",
    "debugging",
    "logic-errors",
    "stack-trace",
    "program-counter",
    "teal-debugging",
    "developer-experience"
  ],
  "folder": "103-debug-smart-contract-logic-errors",
  "prerequisites": {
    "tools": [
      "algokit"
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
      "Start LocalNet with 'algokit localnet start'",
      "Deploy a smart contract with a method that contains a logic error (e.g., failed assert)"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Detailed error information including program counter (PC)",
    "Transaction ID of the failed transaction",
    "Stack trace showing exact TEAL source code with error location marked",
    "Error traces for debugging",
    "Pretty-printed error context"
  ],
  "source_tests": [
    {
      "file": "src/types/app-factory-and-client.spec.ts",
      "test_name": "Display nice error messages when there is a logic error"
    }
  ],
  "artifacts_plan": [],
  "notes": "AlgoKit Utils automatically provides enhanced error messages for logic errors. The 'led' (Logic Error Details) object contains comprehensive debugging information including PC, transaction ID, traces, and source code context when source maps are available.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\n\n/**\n * This example demonstrates how to handle and debug logic errors in smart contracts.\n * \n * When a smart contract encounters a logic error (like a failed assert), AlgoKit Utils\n * provides detailed debugging information including:\n * - Program Counter (PC): The exact bytecode position where the error occurred\n * - Transaction ID: The ID of the failed transaction\n * - Stack trace: TEAL source code with the error location marked\n * - Traces: Execution traces for step-by-step debugging\n * - LED (Logic Error Details): Comprehensive error metadata\n * \n * This makes debugging smart contracts much easier compared to raw Algorand errors.\n */\n\nasync function demonstrateLogicErrorDebugging() {\n  // Initialize the Algorand client for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get or create a test account\n  const testAccount = await algorand.account.fromEnvironment('TEST_ACCOUNT')\n  \n  console.log('Test account address:', testAccount.addr)\n  console.log('\\nThis example will intentionally trigger a logic error to demonstrate debugging features.\\n')\n  \n  // Get the app client for your deployed contract\n  // This should be a contract with an 'error' method that fails\n  const appId = 123n // Replace with your deployed app ID\n  const appSpec = {} // Replace with your app spec\n  \n  const client = algorand.client.getAppClientById({\n    appId: appId,\n    defaultSender: testAccount.addr,\n    appSpec: appSpec,\n  })\n  \n  console.log('Calling smart contract method that will fail...')\n  \n  try {\n    // Call a method that intentionally fails (e.g., has a failed assert)\n    await client.send.call({\n      method: 'error',\n    })\n    \n    // This line should never be reached\n    console.log('❌ ERROR: Method should have failed but succeeded!')\n    \n  } catch (error: any) {\n    console.log('\\n✅ Logic error caught as expected!\\n')\n    \n    // The error object contains rich debugging information\n    console.log('═══════════════════════════════════════════════════')\n    console.log('📊 LOGIC ERROR DETAILS (LED)')\n    console.log('═══════════════════════════════════════════════════\\n')\n    \n    if (error.led) {\n      // Program Counter: The exact position in the bytecode where the error occurred\n      console.log('🎯 Program Counter (PC):', error.led.pc)\n      console.log('   This is the bytecode position of the failing instruction\\n')\n      \n      // Error message from the blockchain\n      console.log('💬 Error Message:', error.led.msg)\n      console.log('   Raw error message from the Algorand node\\n')\n      \n      // Transaction ID of the failed transaction\n      console.log('🔗 Transaction ID:', error.led.txId)\n      console.log('   Use this to look up the transaction on AlgoExplorer\\n')\n      \n      // Execution traces (if available)\n      if (error.led.traces && error.led.traces.length > 0) {\n        console.log('📋 Execution Traces:', error.led.traces.length, 'trace(s) available')\n        console.log('   Traces show the execution path leading to the error\\n')\n      }\n    } else {\n      console.log('⚠️  No LED information available (source maps may be missing)\\n')\n    }\n    \n    // Stack trace with source code context (when source maps are available)\n    if (error.stack) {\n      console.log('═══════════════════════════════════════════════════')\n      console.log('📄 STACK TRACE WITH SOURCE CODE')\n      console.log('═══════════════════════════════════════════════════\\n')\n      \n      console.log(error.stack)\n      \n      console.log('\\n✨ The stack trace shows:')\n      console.log('   - The actual TEAL source code')\n      console.log('   - The exact line where the error occurred (marked with \"<--- Error\")')\n      console.log('   - Surrounding code context for better understanding')\n    } else {\n      console.log('⚠️  No stack trace available\\n')\n    }\n    \n    console.log('\\n═══════════════════════════════════════════════════')\n    console.log('💡 DEBUGGING TIPS')\n    console.log('═══════════════════════════════════════════════════\\n')\n    \n    console.log('1. Program Counter (PC):')\n    console.log('   - Shows exactly where in the bytecode the error occurred')\n    console.log('   - Useful for pinpointing issues in compiled code\\n')\n    \n    console.log('2. Source Maps:')\n    console.log('   - Enable source maps during compilation for better errors')\n    console.log('   - AlgoKit automatically includes source maps in debug builds\\n')\n    \n    console.log('3. Stack Traces:')\n    console.log('   - Read the marked line (\"<--- Error\") to see the failing instruction')\n    console.log('   - Review surrounding code to understand the context\\n')\n    \n    console.log('4. Traces:')\n    console.log('   - Use traces to follow the execution path')\n    console.log('   - Helpful for understanding how the contract reached the error\\n')\n    \n    console.log('5. Transaction ID:')\n    console.log('   - Look up on AlgoExplorer for additional details')\n    console.log('   - Can view full transaction state and inner transactions\\n')\n  }\n}\n\n// Run the example\ndemonstratLogicErrorDebugging()\n  .then(() => {\n    console.log('\\n✨ Example completed successfully!')\n    console.log('\\nYou now know how to debug logic errors in Algorand smart contracts!')\n    process.exit(0)\n  })\n  .catch((error) => {\n    console.error('\\n❌ Example failed:', error)\n    process.exit(1)\n  })"
}
```
