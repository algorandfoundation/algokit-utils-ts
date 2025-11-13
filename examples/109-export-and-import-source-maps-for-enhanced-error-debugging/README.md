# Export and Import Source Maps for Enhanced Error Debugging

Demonstrates how to export source maps from an app client and import them into another client instance to get detailed TEAL stack traces when debugging smart contract errors.

## Example Details

```json
{
  "example_id": "109-export-and-import-source-maps-for-enhanced-error-debugging",
  "title": "Export and Import Source Maps for Enhanced Error Debugging",
  "summary": "Demonstrates how to export source maps from an app client and import them into another client instance to get detailed TEAL stack traces when debugging smart contract errors.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "error handling",
  "specific_use_case": "Export and import source maps for enhanced error debugging",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "client.exportSourceMaps",
    "client.importSourceMaps",
    "error debugging",
    "TEAL stack traces"
  ],
  "feature_tags": [
    "source-maps",
    "debugging",
    "error-handling",
    "teal",
    "app-client"
  ],
  "folder": "109-export-and-import-source-maps-for-enhanced-error-debugging",
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
    "Source maps exported successfully",
    "Error caught without source maps (limited info)",
    "Source maps imported successfully",
    "Enhanced stack trace with TEAL code",
    "Program counter and error location details"
  ],
  "source_tests": [
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "Export and import of source map works"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.algo.ts",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Simple contract with an error method that demonstrates TEAL debugging"
    },
    {
      "target_file": "package.json",
      "type": "config",
      "action": "generate",
      "source_path": null,
      "note": "Package configuration with dependencies"
    }
  ],
  "notes": "This example requires a smart contract with an 'error' method that intentionally fails. The artifacts should include a simple contract for demonstration purposes.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport algosdk from 'algosdk'\nimport * as algokit from '@algorandfoundation/algokit-utils'\n\n/**\n * This example demonstrates how to export and import source maps for enhanced error debugging.\n * Source maps allow you to see the original TEAL source code in stack traces when errors occur,\n * making it much easier to debug smart contract issues.\n */\n\nasync function exportAndImportSourceMaps() {\n  // Initialize the AlgorandClient for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  const algod = algorand.client.algod\n  const indexer = algorand.client.indexer\n  \n  // Get a test account with funds\n  const testAccount = await algorand.account.localNet.dispenser()\n  \n  console.log('Deploying application...')\n  \n  // Deploy your application (replace with your app spec)\n  // This example assumes you have an appSpec with an 'error' method\n  const appClient = algorand.client.getTypedAppClient({\n    sender: testAccount,\n    // Your app spec here\n  })\n  \n  await appClient.create.bare()\n  const app = await appClient.appClient.getAppReference()\n  \n  console.log(`Application deployed with ID: ${app.appId}`)\n  \n  // Export the source maps from the original client\n  console.log('\\nExporting source maps from original client...')\n  const exportedSourceMaps = appClient.exportSourceMaps()\n  console.log('Source maps exported successfully')\n  \n  // Create a new client instance for the same app (without source maps)\n  console.log('\\nCreating new app client without source maps...')\n  const newClient = algokit.getAppClient(\n    {\n      resolveBy: 'id',\n      id: app.appId,\n      sender: testAccount,\n      // Your app spec here\n    },\n    algod,\n  )\n  \n  // Try calling an error method without source maps\n  console.log('\\nCalling error method without source maps...')\n  try {\n    await newClient.call({\n      method: 'error',\n      methodArgs: [],\n    })\n  } catch (e: any) {\n    console.log('Error caught (without source maps):')\n    console.log('Stack trace contains:', e.stack.substring(0, 100) + '...')\n    console.log('Limited debugging information available')\n  }\n  \n  // Import the source maps into the new client\n  console.log('\\nImporting source maps into new client...')\n  // Serialize and deserialize to simulate real-world scenario (e.g., saving to file)\n  newClient.importSourceMaps(JSON.parse(JSON.stringify(exportedSourceMaps)))\n  console.log('Source maps imported successfully')\n  \n  // Try calling the error method again with source maps\n  console.log('\\nCalling error method with source maps...')\n  try {\n    await newClient.call({\n      method: 'error',\n      methodArgs: [],\n    })\n  } catch (e: any) {\n    console.log('\\nError caught (with source maps):')\n    console.log('Enhanced stack trace:')\n    console.log(e.stack)\n    console.log('\\nError details:')\n    console.log(`  Program Counter: ${e.led.pc}`)\n    console.log(`  Message: ${e.led.msg}`)\n    console.log(`  Transaction ID: ${e.led.txId}`)\n    console.log('\\nWith source maps, you can see exactly where the error occurred in your TEAL code!')\n  }\n  \n  console.log('\\n✅ Source map export and import demonstration complete')\n  console.log('\\nKey takeaways:')\n  console.log('- Export source maps after deployment to preserve debugging information')\n  console.log('- Import source maps into new client instances for enhanced error messages')\n  console.log('- Source maps show the exact TEAL code location where errors occur')\n  console.log('- This is especially useful when debugging production applications')\n}\n\nexportAndImportSourceMaps().catch(console.error)"
}
```
