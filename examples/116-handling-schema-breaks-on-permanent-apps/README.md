# Handling Schema Breaks on Permanent Apps

Demonstrates how attempting to replace a permanent (non-deletable) app with a schema-breaking change fails, helping developers understand the importance of planning schema design upfront for permanent applications.

## Example Details

```json
{
  "example_id": "116-handling-schema-breaks-on-permanent-apps",
  "title": "Handling Schema Breaks on Permanent Apps",
  "summary": "Demonstrates how attempting to replace a permanent (non-deletable) app with a schema-breaking change fails, helping developers understand the importance of planning schema design upfront for permanent applications.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "error handling",
  "specific_use_case": "Deploy a permanent app with a schema-breaking change and onSchemaBreak='replace', verifying deletion fails",
  "target_users": [
    "SDK developers",
    "Smart contract developers",
    "DevOps engineers"
  ],
  "features_tested": [
    "algorand.appDeployer.deploy",
    "LogicError.parseLogicError",
    "schema break detection",
    "permanent app constraints"
  ],
  "feature_tags": [
    "app-deployment",
    "schema-breaks",
    "error-handling",
    "permanent-apps",
    "logic-errors"
  ],
  "folder": "116-handling-schema-breaks-on-permanent-apps",
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
        "example": "http://localhost:4001"
      },
      {
        "name": "ALGOD_TOKEN",
        "required": false,
        "example": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      {
        "name": "INDEXER_SERVER",
        "required": false,
        "example": "http://localhost:8980"
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start LocalNet using 'algokit localnet start'"
    ],
    "install": [
      "npm install"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Initial deployment of permanent app succeeds",
    "Attempted schema-breaking replacement fails with 'logic eval error: assert failed'",
    "LogicError is parsed and displayed",
    "Error message confirms permanent apps cannot be deleted for schema replacement"
  ],
  "source_tests": [
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Deploy replacement to schema broken, permanent app fails"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "approval.teal",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Simple TEAL approval program with global state"
    },
    {
      "target_file": "clear.teal",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Simple TEAL clear state program"
    }
  ],
  "notes": "This example is crucial for understanding permanent app limitations. Once an app is deployed as permanent (deletable: false), it cannot be replaced even with onSchemaBreak='replace'. Developers must design their schema correctly from the start.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport { Config } from '@algorandfoundation/algokit-utils/types/config'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates what happens when you try to replace a permanent app\n * (deletable: false) with a schema-breaking change.\n *\n * Key Learning: Permanent apps cannot be deleted and replaced, even with onSchemaBreak='replace'.\n * You must design your schema correctly from the start for permanent applications.\n */\n\nasync function main() {\n  // Configure AlgoKit\n  Config.configure({ debug: true })\n\n  // Initialize AlgorandClient for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get a test account with funds\n  const account = await algorand.account.fromEnvironment('DEPLOYER')\n  console.log('Using account:', account.addr)\n\n  // Define simple TEAL programs\n  const approvalProgram = `#pragma version 8\n// Simple approval program with global state\nint 1\nreturn`\n\n  const clearProgram = `#pragma version 8\n// Simple clear state program\nint 1\nreturn`\n\n  // Step 1: Deploy a permanent app (deletable: false)\n  console.log('\\n--- Step 1: Deploying permanent app ---')\n  \n  const metadata = {\n    name: 'PermanentApp',\n    version: '1.0',\n    deletable: false,  // This makes the app permanent\n    updatable: true,\n  }\n\n  const deployment1 = {\n    sender: account,\n    approvalProgram: approvalProgram,\n    clearStateProgram: clearProgram,\n    schema: {\n      globalUints: 1,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n    metadata: metadata,\n  }\n\n  const result1 = await algorand.appDeployer.deploy(deployment1)\n  console.log('✅ Permanent app deployed successfully')\n  console.log('   App ID:', result1.appId)\n  console.log('   App Address:', result1.appAddress)\n  console.log('   Created Round:', result1.createdRound)\n  console.log('   Deletable:', result1.deletable)\n\n  // Wait for indexer to catch up\n  await new Promise(resolve => setTimeout(resolve, 2000))\n\n  // Step 2: Attempt to deploy with schema-breaking change and onSchemaBreak='replace'\n  console.log('\\n--- Step 2: Attempting schema-breaking replacement ---')\n  console.log('   Breaking schema by changing globalUints: 1 -> 2')\n  console.log('   Using onSchemaBreak: \"replace\"')\n  \n  const deployment2 = {\n    sender: account,\n    approvalProgram: approvalProgram,\n    clearStateProgram: clearProgram,\n    schema: {\n      globalUints: 2,  // Schema break: increased from 1 to 2\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n    metadata: {\n      ...metadata,\n      version: '2.0',\n    },\n    onSchemaBreak: 'replace',  // Try to replace the app\n  }\n\n  try {\n    await algorand.appDeployer.deploy(deployment2)\n    console.log('❌ This should not happen - deployment should have failed!')\n  } catch (error: any) {\n    console.log('\\n❌ Deployment failed as expected!')\n    console.log('   Error:', error.message)\n    \n    // Parse the logic error for more details\n    if (error.message.includes('logic eval error')) {\n      console.log('\\n📋 Analysis:')\n      console.log('   - The app is marked as permanent (deletable: false)')\n      console.log('   - Schema breaks require deleting and recreating the app')\n      console.log('   - Permanent apps cannot be deleted')\n      console.log('   - Therefore, schema-breaking changes are not possible')\n      console.log('\\n💡 Key Takeaway:')\n      console.log('   Design your schema carefully for permanent apps!')\n      console.log('   Once deployed as permanent, the schema cannot be changed.')\n    }\n  }\n\n  // Verify the original app still exists\n  console.log('\\n--- Verification ---')\n  const appInfo = await algorand.client.algod.getApplicationByID(result1.appId).do()\n  console.log('✅ Original permanent app still exists')\n  console.log('   App ID:', result1.appId)\n  console.log('   Global State Schema - Uints:', appInfo.params['global-state-schema'].uints)\n}\n\nmain().catch(console.error)"
}
```
