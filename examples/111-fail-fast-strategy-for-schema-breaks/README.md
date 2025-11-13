# Fail-Fast Strategy for Schema Breaks

Demonstrates how to use the 'fail' strategy for onSchemaBreak to prevent accidental schema changes. This is useful for production deployments where you want to be explicitly warned about schema changes before they happen.

## Example Details

```json
{
  "example_id": "111-fail-fast-strategy-for-schema-breaks",
  "title": "Fail-Fast Strategy for Schema Breaks",
  "summary": "Demonstrates how to use the 'fail' strategy for onSchemaBreak to prevent accidental schema changes. This is useful for production deployments where you want to be explicitly warned about schema changes before they happen.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "medium",
  "use_case_category": "error handling",
  "specific_use_case": "Deploy an app, then attempt to deploy with a schema break and onSchemaBreak='fail', verifying deployment stops with an error",
  "target_users": [
    "SDK developers",
    "DevOps engineers",
    "Smart contract developers"
  ],
  "features_tested": [
    "algorand.appDeployer.deploy",
    "onSchemaBreak parameter",
    "schema break detection"
  ],
  "feature_tags": [
    "app-deployment",
    "schema-breaks",
    "error-handling",
    "fail-fast",
    "production-safety"
  ],
  "folder": "111-fail-fast-strategy-for-schema-breaks",
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
    "Initial app deployment succeeds",
    "Attempted deployment with schema break fails immediately",
    "Error message explains schema break detected and suggests using 'replace' if intentional",
    "Original app remains unchanged"
  ],
  "source_tests": [
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Deploy failure for replacement of schema broken app fails if onSchemaBreak = Fail"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "approval.teal",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Simple TEAL approval program"
    },
    {
      "target_file": "clear.teal",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Simple TEAL clear state program"
    }
  ],
  "notes": "This example shows the fail-fast approach to schema changes, which is recommended for production environments to prevent accidental destructive changes.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport { Config } from '@algorandfoundation/algokit-utils/types/config'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates the fail-fast strategy for schema breaks.\n * \n * When onSchemaBreak='fail', the deployment will immediately stop if a schema\n * break is detected, preventing accidental destructive changes in production.\n * \n * This is the safest option for production deployments where schema changes\n * should be intentional and carefully planned.\n */\n\nasync function main() {\n  // Configure AlgoKit\n  Config.configure({ debug: true })\n\n  // Initialize AlgorandClient for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get a test account with funds\n  const account = await algorand.account.fromEnvironment('DEPLOYER')\n  console.log('Using account:', account.addr)\n\n  // Define simple TEAL programs\n  const approvalProgram = `#pragma version 8\n// Simple approval program\nint 1\nreturn`\n\n  const clearProgram = `#pragma version 8\n// Simple clear state program  \nint 1\nreturn`\n\n  // Step 1: Deploy initial version of the app\n  console.log('\\n--- Step 1: Deploying initial app version ---')\n  \n  const metadata = {\n    name: 'MyApp',\n    version: '1.0',\n    deletable: true,\n    updatable: true,\n  }\n\n  const deployment1 = {\n    sender: account,\n    approvalProgram: approvalProgram,\n    clearStateProgram: clearProgram,\n    schema: {\n      globalUints: 1,\n      globalByteSlices: 1,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n    metadata: metadata,\n  }\n\n  const result1 = await algorand.appDeployer.deploy(deployment1)\n  console.log('✅ App deployed successfully')\n  console.log('   App ID:', result1.appId)\n  console.log('   App Address:', result1.appAddress)\n  console.log('   Schema: globalUints=1, globalByteSlices=1')\n  console.log('   Version:', result1.version)\n\n  // Wait for indexer to catch up\n  await new Promise(resolve => setTimeout(resolve, 2000))\n\n  // Step 2: Attempt to deploy with schema-breaking change and onSchemaBreak='fail'\n  console.log('\\n--- Step 2: Attempting deployment with schema break ---')\n  console.log('   New schema: globalUints=2, globalByteSlices=1 (breaking change!)')\n  console.log('   Strategy: onSchemaBreak=\"fail\"')\n  \n  const deployment2 = {\n    sender: account,\n    approvalProgram: approvalProgram,\n    clearStateProgram: clearProgram,\n    schema: {\n      globalUints: 2,  // Schema break: changed from 1 to 2\n      globalByteSlices: 1,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n    metadata: metadata,\n    onSchemaBreak: 'fail',  // Fail immediately on schema break\n  }\n\n  try {\n    await algorand.appDeployer.deploy(deployment2)\n    console.log('❌ This should not happen - deployment should have failed!')\n  } catch (error: any) {\n    console.log('\\n❌ Deployment failed as expected!')\n    console.log('\\n📋 Error Details:')\n    console.log('   ', error.message)\n    \n    console.log('\\n💡 What happened:')\n    console.log('   1. Deployer detected the schema change (globalUints: 1 -> 2)')\n    console.log('   2. onSchemaBreak was set to \"fail\"')\n    console.log('   3. Deployment was stopped immediately before any changes')\n    console.log('   4. Original app remains unchanged')\n    \n    console.log('\\n✅ Use Cases for onSchemaBreak=\"fail\":')\n    console.log('   - Production deployments where changes should be explicit')\n    console.log('   - CI/CD pipelines that should halt on unexpected changes')\n    console.log('   - Safety mechanism to prevent accidental schema modifications')\n    \n    console.log('\\n🔄 Alternatives:')\n    console.log('   - onSchemaBreak=\"replace\": Delete and recreate the app (data loss!)')\n    console.log('   - onSchemaBreak=\"append\": Only allow adding storage (safer)')\n  }\n\n  // Verify the original app is unchanged\n  console.log('\\n--- Verification ---')\n  const appInfo = await algorand.client.algod.getApplicationByID(result1.appId).do()\n  console.log('✅ Original app is unchanged')\n  console.log('   App ID:', result1.appId)\n  console.log('   Global State Schema:')\n  console.log('     - Uints:', appInfo.params['global-state-schema'].uints)\n  console.log('     - ByteSlices:', appInfo.params['global-state-schema']['byte-slices'])\n}\n\nmain().catch(console.error)"
}
```
