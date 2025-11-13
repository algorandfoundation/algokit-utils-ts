# Handling App Updates with Append Strategy

Demonstrates how to handle schema breaks and code updates by creating a new app alongside the existing one using the 'append' strategy, useful for blue-green deployments and gradual migrations.

## Example Details

```json
{
  "example_id": "115-handling-app-updates-with-append-strategy",
  "title": "Handling App Updates with Append Strategy",
  "summary": "Demonstrates how to handle schema breaks and code updates by creating a new app alongside the existing one using the 'append' strategy, useful for blue-green deployments and gradual migrations.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Deploy an app, then handle schema breaks or version updates by creating a new app with onSchemaBreak='append' or onUpdate='append' to maintain multiple versions",
  "target_users": [
    "SDK developers",
    "DevOps engineers",
    "Smart contract developers"
  ],
  "features_tested": [
    "algorand.appDeployer.deploy",
    "onSchemaBreak parameter",
    "onUpdate parameter",
    "multi-app version management"
  ],
  "feature_tags": [
    "app-deployment",
    "schema-management",
    "version-management",
    "blue-green-deployment",
    "multi-app-management",
    "migration-strategies"
  ],
  "folder": "115-handling-app-updates-with-append-strategy",
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
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Shows initial app deployment with app ID",
    "Shows schema break deployment creating a new app with different ID",
    "Shows version update deployment creating another new app",
    "Demonstrates that old apps remain active alongside new ones"
  ],
  "source_tests": [
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Deploy append for schema broken app if onSchemaBreak = AppendApp"
    },
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Deploy append for update app if onUpdate = AppendApp"
    }
  ],
  "artifacts_plan": [],
  "notes": "This example combines two related test cases that demonstrate the append strategy for different scenarios. The append strategy is a powerful deployment pattern for managing multiple app versions and performing zero-downtime deployments.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport * as algokit from '@algorandfoundation/algokit-utils'\nimport { Config } from '@algorandfoundation/algokit-utils'\n\n/**\n * This example demonstrates how to use the 'append' strategy when deploying apps.\n * The append strategy creates a new app instead of updating or replacing the existing one,\n * which is useful for:\n * - Blue-green deployments\n * - Gradual migrations\n * - Maintaining multiple app versions simultaneously\n * - Handling schema breaks without deleting the old app\n */\n\nasync function demonstrateAppendStrategies() {\n  // Initialize AlgorandClient for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  const sender = algorand.account.localNetDispenser()\n\n  console.log('=== App Deployment with Append Strategies ===')\n  console.log()\n\n  // ===== Example 1: Handling Schema Breaks with Append =====\n  console.log('Example 1: Schema Break with onSchemaBreak=append')\n  console.log('---------------------------------------------------')\n\n  // Initial app deployment\n  const metadata1 = {\n    name: 'MyApp',\n    version: '1.0',\n    updatable: true,\n    deletable: true,\n  }\n\n  const deployment1 = {\n    sender,\n    metadata: metadata1,\n    deployTimeParams: {},\n    schema: {\n      globalInts: 1,\n      globalBytes: 0,\n      localInts: 0,\n      localBytes: 0,\n    },\n    approvalProgram: `#pragma version 8\nint 1\nreturn`,\n    clearStateProgram: `#pragma version 8\nint 1\nreturn`,\n  }\n\n  console.log('Deploying initial app with schema: globalInts=1, globalBytes=0')\n  const result1 = await algorand.appDeployer.deploy(deployment1)\n  console.log(`✓ Created app with ID: ${result1.appId}`)\n  console.log(`  Operation: ${result1.operationPerformed}`)\n  console.log(`  Version: ${result1.version}`)\n  console.log()\n\n  // Deploy with schema break using 'append' strategy\n  // This will create a NEW app instead of replacing the old one\n  const deployment2 = {\n    sender,\n    metadata: metadata1, // Same metadata\n    onSchemaBreak: 'append' as const, // Key: Use append strategy\n    deployTimeParams: {},\n    schema: {\n      globalInts: 2, // BREAKING CHANGE: Different schema\n      globalBytes: 1,\n      localInts: 0,\n      localBytes: 0,\n    },\n    approvalProgram: `#pragma version 8\nint 1\nreturn`,\n    clearStateProgram: `#pragma version 8\nint 1\nreturn`,\n  }\n\n  console.log('Deploying with schema break (globalInts=2, globalBytes=1) and onSchemaBreak=append')\n  const result2 = await algorand.appDeployer.deploy(deployment2)\n  console.log(`✓ Created NEW app with ID: ${result2.appId}`)\n  console.log(`  Operation: ${result2.operationPerformed}`)\n  console.log(`  Old app ID: ${result1.appId} (still exists)`)\n  console.log(`  New app ID: ${result2.appId}`)\n  console.log(`  Both apps are now running simultaneously!`)\n  console.log()\n\n  // ===== Example 2: Version Updates with Append =====\n  console.log('Example 2: Version Update with onUpdate=append')\n  console.log('-----------------------------------------------')\n\n  // Initial app deployment with version 1.0\n  const metadata3 = {\n    name: 'MyVersionedApp',\n    version: '1.0',\n    updatable: true,\n    deletable: true,\n  }\n\n  const deployment3 = {\n    sender,\n    metadata: metadata3,\n    deployTimeParams: { VALUE: 1 },\n    schema: {\n      globalInts: 1,\n      globalBytes: 0,\n      localInts: 0,\n      localBytes: 0,\n    },\n    approvalProgram: `#pragma version 8\nint TMPL_VALUE\nreturn`,\n    clearStateProgram: `#pragma version 8\nint 1\nreturn`,\n  }\n\n  console.log('Deploying app version 1.0 with VALUE=1')\n  const result3 = await algorand.appDeployer.deploy(deployment3)\n  console.log(`✓ Created app with ID: ${result3.appId}`)\n  console.log(`  Version: ${result3.version}`)\n  console.log()\n\n  // Deploy version 2.0 with 'append' strategy\n  // This creates a new app instead of updating the existing one\n  const metadata4 = {\n    name: 'MyVersionedApp',\n    version: '2.0', // New version\n    updatable: true,\n    deletable: true,\n  }\n\n  const deployment4 = {\n    sender,\n    metadata: metadata4,\n    onUpdate: 'append' as const, // Key: Use append strategy for updates\n    deployTimeParams: { VALUE: 3 }, // Different template value\n    schema: {\n      globalInts: 1,\n      globalBytes: 0,\n      localInts: 0,\n      localBytes: 0,\n    },\n    approvalProgram: `#pragma version 8\nint TMPL_VALUE\nreturn`,\n    clearStateProgram: `#pragma version 8\nint 1\nreturn`,\n  }\n\n  console.log('Deploying version 2.0 with VALUE=3 and onUpdate=append')\n  const result4 = await algorand.appDeployer.deploy(deployment4)\n  console.log(`✓ Created NEW app with ID: ${result4.appId}`)\n  console.log(`  Operation: ${result4.operationPerformed}`)\n  console.log(`  Version 1.0 app ID: ${result3.appId} (still running)`)\n  console.log(`  Version 2.0 app ID: ${result4.appId} (newly created)`)\n  console.log()\n\n  console.log('=== Summary ===')\n  console.log('The append strategy allows you to:')\n  console.log('1. Keep old apps running while deploying new versions')\n  console.log('2. Perform gradual migrations by routing traffic between versions')\n  console.log('3. Rollback quickly by switching back to the old app')\n  console.log('4. Test new versions in production without replacing the old version')\n}\n\n// Run the example\ndemonstrateAppendStrategies().catch(console.error)"
}
```
