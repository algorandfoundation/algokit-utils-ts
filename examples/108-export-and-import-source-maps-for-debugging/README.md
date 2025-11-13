# Export and Import Source Maps for Debugging

Shows how to export source maps from one app client instance and import them into another for enhanced error debugging with source code context.

## Example Details

```json
{
  "example_id": "108-export-and-import-source-maps-for-debugging",
  "title": "Export and Import Source Maps for Debugging",
  "summary": "Shows how to export source maps from one app client instance and import them into another for enhanced error debugging with source code context.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "error handling",
  "specific_use_case": "Export and import source maps for better error debugging",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "client.exportSourceMaps",
    "client.importSourceMaps",
    "error debugging with source context"
  ],
  "feature_tags": [
    "debugging",
    "source-maps",
    "error-handling",
    "serialization",
    "developer-tools"
  ],
  "folder": "108-export-and-import-source-maps-for-debugging",
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
      "Deploy a smart contract with source maps"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Error without source map shows generic 'assert failed' message",
    "Error with imported source map shows exact TEAL source code location with context",
    "Stack trace includes source code snippet with error marker"
  ],
  "source_tests": [
    {
      "file": "src/types/app-factory-and-client.spec.ts",
      "test_name": "Export and import of source map works"
    }
  ],
  "artifacts_plan": [],
  "notes": "Source maps map compiled TEAL bytecode back to the original source code, providing much better error messages during debugging. This is especially useful when sharing client instances or debugging across different environments.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\n\n/**\n * This example demonstrates how to export and import source maps for better error debugging.\n * \n * Source maps allow you to:\n * - See the exact TEAL source code that caused an error\n * - Get meaningful stack traces with source context\n * - Share debugging information between client instances\n * - Preserve source maps across serialization/deserialization\n * \n * Without source maps, errors show generic messages like \"assert failed pc=885\"\n * With source maps, you see the actual source code line that caused the error\n */\n\nasync function demonstrateSourceMaps() {\n  // Initialize the Algorand client for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get or create a test account\n  const testAccount = await algorand.account.fromEnvironment('TEST_ACCOUNT')\n  \n  console.log('Test account address:', testAccount.addr)\n  \n  // Deploy or get an existing app client\n  // This should be a contract with source maps included\n  const appId = 123n // Replace with your deployed app ID\n  const appSpec = {} // Replace with your app spec\n  \n  const originalClient = algorand.client.getAppClientById({\n    appId: appId,\n    defaultSender: testAccount.addr,\n    appSpec: appSpec,\n  })\n  \n  console.log('\\n📦 Exporting source maps from original client...')\n  \n  // Export source maps from the original client\n  // This contains the mapping from bytecode to source code\n  const sourceMaps = originalClient.exportSourceMaps()\n  \n  console.log('✅ Source maps exported successfully')\n  console.log('Source map data size:', JSON.stringify(sourceMaps).length, 'bytes')\n  \n  // Create a new client instance (simulating a fresh client or different context)\n  console.log('\\n🔧 Creating new client instance without source maps...')\n  \n  const newClient = algorand.client.getAppClientById({\n    appId: appId,\n    defaultSender: testAccount.addr,\n    appSpec: appSpec,\n  })\n  \n  // First, try calling an error method WITHOUT source maps imported\n  console.log('\\n❌ Attempting to trigger error WITHOUT source maps...')\n  try {\n    await newClient.send.call({\n      method: 'error', // This method intentionally fails\n    })\n  } catch (error: any) {\n    console.log('\\nError caught (without source maps):')\n    console.log('  Message:', error.message || 'Unknown error')\n    console.log('  Stack trace:', error.stack ? 'Generic - contains \"assert failed\"' : 'No stack')\n    // Without source maps, the error is less helpful\n  }\n  \n  // Now import the source maps into the new client\n  console.log('\\n📥 Importing source maps into new client...')\n  \n  // Source maps can be serialized and deserialized (e.g., saved to file, sent over network)\n  const serializedSourceMaps = JSON.parse(JSON.stringify(sourceMaps))\n  newClient.importSourceMaps(serializedSourceMaps)\n  \n  console.log('✅ Source maps imported successfully')\n  \n  // Now try the same error WITH source maps imported\n  console.log('\\n❌ Attempting to trigger error WITH source maps...')\n  try {\n    await newClient.send.call({\n      method: 'error', // This method intentionally fails\n    })\n  } catch (error: any) {\n    console.log('\\nError caught (with source maps):')\n    console.log('  Message:', error.message || 'Unknown error')\n    \n    // With source maps, we get detailed error information\n    if (error.led) {\n      console.log('\\n📍 Error Details:')\n      console.log('  Program Counter (PC):', error.led.pc)\n      console.log('  Transaction ID:', error.led.txId)\n      console.log('  Error Message:', error.led.msg)\n      \n      if (error.led.traces && error.led.traces.length > 0) {\n        console.log('  Number of traces:', error.led.traces.length)\n      }\n    }\n    \n    // The stack trace now includes source code context\n    if (error.stack) {\n      console.log('\\n📄 Stack Trace with Source Context:')\n      console.log(error.stack)\n      console.log('\\n✨ Notice the source code context with \"<--- Error\" marker!')\n    }\n  }\n  \n  console.log('\\n💡 Key Takeaways:')\n  console.log('  - Source maps can be exported and imported between client instances')\n  console.log('  - They can be serialized (e.g., saved to file or sent over network)')\n  console.log('  - Importing source maps provides much better error messages')\n  console.log('  - Error messages include exact TEAL source code and line numbers')\n  console.log('  - This is invaluable for debugging smart contract issues')\n}\n\n// Run the example\ndemonstratSourceMaps()\n  .then(() => {\n    console.log('\\n✨ Example completed successfully!')\n    process.exit(0)\n  })\n  .catch((error) => {\n    console.error('\\n❌ Example failed:', error)\n    process.exit(1)\n  })"
}
```
