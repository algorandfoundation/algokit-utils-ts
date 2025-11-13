# Replace App with Schema-Breaking Changes

Demonstrates how to handle schema-breaking changes during app deployment by using the replacement strategy. When schema changes are incompatible with updates, the app can be deleted and recreated with the new schema.

## Example Details

```json
{
  "example_id": "124-replace-app-with-schema-breaking-changes",
  "title": "Replace App with Schema-Breaking Changes",
  "summary": "Demonstrates how to handle schema-breaking changes during app deployment by using the replacement strategy. When schema changes are incompatible with updates, the app can be deleted and recreated with the new schema.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Deploy an app, then deploy with a schema-breaking change and onSchemaBreak='replace' to delete and recreate the app",
  "target_users": [
    "SDK developers",
    "Smart contract developers",
    "DevOps engineers"
  ],
  "features_tested": [
    "algorand.appDeployer.deploy",
    "onSchemaBreak parameter",
    "schema changes",
    "app replacement"
  ],
  "feature_tags": [
    "schema-management",
    "schema-breaking-changes",
    "app-replacement",
    "state-management",
    "deployment-strategies"
  ],
  "folder": "124-replace-app-with-schema-breaking-changes",
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
    "Initial app deployed with original schema",
    "Schema changes explained",
    "Replacement app deployed with new schema",
    "New app ID displayed (different from original)",
    "Confirmation that old app was deleted",
    "Educational notes about schema breaking changes and their implications"
  ],
  "source_tests": [
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Deploy replacement of deletable schema broken app"
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
      "note": "Detailed explanation of schema management, breaking changes, and best practices"
    }
  ],
  "notes": "This example is crucial for developers managing app schema evolution. It demonstrates the constraints of Algorand's storage model and provides a practical solution for handling schema-breaking changes. The example emphasizes the trade-offs and implications of replacing an app.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport * as algokit from '@algorandfoundation/algokit-utils'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates how to handle schema-breaking changes in Algorand apps.\n * \n * When you need to change the storage schema (global/local state) of an app,\n * you often cannot update it in place because Algorand doesn't allow certain\n * schema modifications. In these cases, you can use the 'replace' strategy\n * with onSchemaBreak parameter.\n * \n * This example shows:\n * 1. Deploying an app with an initial schema\n * 2. Attempting to deploy with a schema-breaking change\n * 3. Using onSchemaBreak: 'replace' to handle the situation\n * 4. The old app is deleted and a new one is created\n */\n\nasync function main() {\n  // Initialize AlgorandClient for local development\n  const algorand = AlgorandClient.defaultLocalNet()\n  const account = await algorand.account.fromEnvironment('DEPLOYER')\n  \n  console.log('=== Deploying Initial App with Original Schema ===')\n  console.log(`Using account: ${account.addr}\\n`)\n  \n  // Define approval and clear programs\n  const approvalProgram = `#pragma version 10\n  // Approval program v1.0\n  int 1\n  return`\n  \n  const clearProgram = `#pragma version 10\n  // Clear state program\n  int 1\n  return`\n  \n  // Compile the programs\n  const approval = await algorand.client.algod.compile(approvalProgram).do()\n  const clear = await algorand.client.algod.compile(clearProgram).do()\n  \n  // Deploy the first version with initial schema\n  const deployment1 = {\n    sender: account.addr,\n    approvalProgram: new Uint8Array(Buffer.from(approval.result, 'base64')),\n    clearStateProgram: new Uint8Array(Buffer.from(clear.result, 'base64')),\n    schema: {\n      globalUints: 2,        // Initial: 2 global uint values\n      globalByteSlices: 1,   // Initial: 1 global byte slice\n      localUints: 1,         // Initial: 1 local uint value\n      localByteSlices: 0,    // Initial: 0 local byte slices\n    },\n    metadata: {\n      name: 'SchemaApp',\n      version: '1.0',\n      deletable: true,  // Must be deletable to allow replacement\n      updatable: true,\n    },\n  }\n  \n  const result1 = await algorand.appDeployer.deploy(deployment1)\n  \n  console.log(`✅ Initial deployment successful!`)\n  console.log(`   App ID: ${result1.appId}`)\n  console.log(`   Version: ${result1.version}`)\n  console.log(`   Schema (Global): ${deployment1.schema.globalUints} uints, ${deployment1.schema.globalByteSlices} byte slices`)\n  console.log(`   Schema (Local): ${deployment1.schema.localUints} uints, ${deployment1.schema.localByteSlices} byte slices\\n`)\n  \n  // Wait a moment for the transaction to be processed\n  await new Promise(resolve => setTimeout(resolve, 1000))\n  \n  console.log('=== Deploying Updated App with Schema-Breaking Changes ===')\n  console.log('Schema changes:')\n  console.log('  - Global uints: 2 → 3 (adding storage)')\n  console.log('  - Local byte slices: 0 → 2 (adding storage)')\n  console.log('\\nThese changes break the schema and require replacement...\\n')\n  \n  // Deploy with schema-breaking changes\n  const deployment2 = {\n    sender: account.addr,\n    approvalProgram: new Uint8Array(Buffer.from(approval.result, 'base64')),\n    clearStateProgram: new Uint8Array(Buffer.from(clear.result, 'base64')),\n    schema: {\n      globalUints: 3,        // Changed: 2 → 3 (schema breaking!)\n      globalByteSlices: 1,   // Unchanged\n      localUints: 1,         // Unchanged\n      localByteSlices: 2,    // Changed: 0 → 2 (schema breaking!)\n    },\n    metadata: {\n      name: 'SchemaApp',\n      version: '2.0',\n      deletable: true,\n      updatable: true,\n    },\n    onSchemaBreak: 'replace',  // Handle schema break by replacing the app\n  }\n  \n  const result2 = await algorand.appDeployer.deploy(deployment2)\n  \n  console.log(`✅ Replacement deployment successful!`)\n  console.log(`   New App ID: ${result2.appId}`)\n  console.log(`   Old App ID: ${result1.appId}`)\n  console.log(`   App IDs are different: ${result2.appId !== result1.appId}`)\n  console.log(`   Version: ${result2.version}`)\n  console.log(`   Operation: ${result2.operationPerformed}`)\n  console.log(`   Schema (Global): ${deployment2.schema.globalUints} uints, ${deployment2.schema.globalByteSlices} byte slices`)\n  console.log(`   Schema (Local): ${deployment2.schema.localUints} uints, ${deployment2.schema.localByteSlices} byte slices\\n`)\n  \n  // Check if the old app was deleted\n  if (result2.deleteResult) {\n    console.log(`   ✅ Old app was deleted as part of replacement`)\n    console.log(`   Delete transaction ID: ${result2.deleteResult.transaction.txID()}\\n`)\n  }\n  \n  console.log('=== Understanding Schema Changes ===')\n  console.log('Schema-breaking changes occur when:')\n  console.log('  • You increase the number of global uints')\n  console.log('  • You increase the number of global byte slices')\n  console.log('  • You increase the number of local uints')\n  console.log('  • You increase the number of local byte slices')\n  console.log('')\n  console.log('⚠️  Algorand does NOT allow updating an app to increase storage!')\n  console.log('\\nSolutions:')\n  console.log('  1. Use onSchemaBreak: \"replace\" to delete and recreate (as shown here)')\n  console.log('  2. Use onSchemaBreak: \"fail\" to abort the deployment')\n  console.log('  3. Design your schema with extra capacity from the start\\n')\n  \n  console.log('=== Important Considerations ===')\n  console.log('When replacing an app due to schema changes:')\n  console.log('  ⚠️  All global state is lost (reset to empty)')\n  console.log('  ⚠️  Users must re-opt-in to the new app')\n  console.log('  ⚠️  All local state is lost for all users')\n  console.log('  ⚠️  The app gets a new ID (update references!)')\n  console.log('  ✅  You get the new schema you need')\n  console.log('  ✅  Fresh start with clean state\\n')\n}\n\nmain().catch(console.error)"
}
```
