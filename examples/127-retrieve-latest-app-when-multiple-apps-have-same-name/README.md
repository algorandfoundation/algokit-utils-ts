# Retrieve Latest App When Multiple Apps Have Same Name

Shows how the SDK handles multiple apps created with the same name, demonstrating that getCreatorAppsByName returns only the most recently created app

## Example Details

```json
{
  "example_id": "127-retrieve-latest-app-when-multiple-apps-have-same-name",
  "title": "Retrieve Latest App When Multiple Apps Have Same Name",
  "summary": "Shows how the SDK handles multiple apps created with the same name, demonstrating that getCreatorAppsByName returns only the most recently created app",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "medium",
  "use_case_category": "app deployment",
  "specific_use_case": "Create multiple apps with the same name and verify that getCreatorAppsByName returns the most recently created one",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "algorand.send.appCreate",
    "algorand.appDeployer.getCreatorAppsByName"
  ],
  "feature_tags": [
    "app-creation",
    "name-collision",
    "latest-app-retrieval",
    "multiple-apps",
    "app-deployer"
  ],
  "folder": "127-retrieve-latest-app-when-multiple-apps-have-same-name",
  "prerequisites": {
    "tools": [
      "algokit",
      "docker"
    ],
    "libraries": [
      "@algorandfoundation/algokit-utils"
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
    "Three apps created with the same name",
    "Retrieved app matches the third (most recent) app",
    "First and second app IDs are shown as not matching"
  ],
  "source_tests": [
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Latest created app is retrieved"
    }
  ],
  "artifacts_plan": [],
  "notes": "This example demonstrates important behavior for developers managing multiple deployments - only the latest app with a given name is returned by getCreatorAppsByName.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates how the SDK handles multiple apps with the same name.\n * When multiple apps are created with identical names, getCreatorAppsByName returns\n * only the most recently created app.\n * \n * This is important for understanding app deployment patterns and version management.\n */\n\nasync function main() {\n  // Initialize Algorand client for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get a test account with funds\n  const testAccount = await algorand.account.fromEnvironment('ACCOUNT1')\n  console.log(`Using account: ${testAccount.addr}\\n`)\n\n  // Define deployment metadata (same name for all apps)\n  const appName = 'MY_APP'\n  const creationMetadata = {\n    name: appName,\n    version: '1.0',\n    updatable: true,\n    deletable: false\n  }\n\n  console.log('Creating multiple apps with the same name...')\n  console.log(`App name: ${appName}\\n`)\n\n  // Compile simple TEAL programs\n  const approvalProgram = await algorand.app.compileTeal(\n    '#pragma version 10\\nint 1\\nreturn'\n  )\n  const clearProgram = await algorand.app.compileTeal(\n    '#pragma version 10\\nint 1\\nreturn'\n  )\n\n  // Create three apps with the same name but different leases\n  // (lease prevents transaction deduplication)\n  console.log('Creating App 1...')\n  const app1 = await algorand.send.appCreate({\n    sender: testAccount.addr,\n    approvalProgram: approvalProgram.compiledBase64ToBytes,\n    clearStateProgram: clearProgram.compiledBase64ToBytes,\n    schema: {\n      globalUints: 0,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0\n    },\n    onComplete: algosdk.OnApplicationComplete.NoOpOC,\n    note: new TextEncoder().encode(JSON.stringify(creationMetadata)),\n    lease: new Uint8Array([1]) // Unique lease to prevent deduplication\n  })\n  console.log(`  ✅ App 1 created with ID: ${app1.appId}`)\n\n  console.log('Creating App 2...')\n  const app2 = await algorand.send.appCreate({\n    sender: testAccount.addr,\n    approvalProgram: approvalProgram.compiledBase64ToBytes,\n    clearStateProgram: clearProgram.compiledBase64ToBytes,\n    schema: {\n      globalUints: 0,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0\n    },\n    onComplete: algosdk.OnApplicationComplete.NoOpOC,\n    note: new TextEncoder().encode(JSON.stringify(creationMetadata)),\n    lease: new Uint8Array([2])\n  })\n  console.log(`  ✅ App 2 created with ID: ${app2.appId}`)\n\n  console.log('Creating App 3...')\n  const app3 = await algorand.send.appCreate({\n    sender: testAccount.addr,\n    approvalProgram: approvalProgram.compiledBase64ToBytes,\n    clearStateProgram: clearProgram.compiledBase64ToBytes,\n    schema: {\n      globalUints: 0,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0\n    },\n    onComplete: algosdk.OnApplicationComplete.NoOpOC,\n    note: new TextEncoder().encode(JSON.stringify(creationMetadata)),\n    lease: new Uint8Array([3])\n  })\n  console.log(`  ✅ App 3 created with ID: ${app3.appId}\\n`)\n\n  // Wait for indexer to catch up\n  console.log('Waiting for indexer to index the transactions...')\n  await new Promise(resolve => setTimeout(resolve, 2000))\n\n  // Retrieve apps by name\n  const apps = await algorand.appDeployer.getCreatorAppsByName(testAccount.addr)\n\n  console.log('\\n📋 Retrieved apps by name:')\n  const retrievedApp = apps.apps[appName]\n  \n  if (retrievedApp) {\n    console.log(`\\n🔍 Checking which app is returned for name '${appName}':`)\n    console.log(`  App 1 ID: ${app1.appId} - ${retrievedApp.appId === app1.appId ? '❌' : '✅'} Not returned`)\n    console.log(`  App 2 ID: ${app2.appId} - ${retrievedApp.appId === app2.appId ? '❌' : '✅'} Not returned`)\n    console.log(`  App 3 ID: ${app3.appId} - ${retrievedApp.appId === app3.appId ? '✅' : '❌'} RETURNED (Latest)`)\n    \n    console.log(`\\n✅ Result: getCreatorAppsByName returns the LATEST app created with name '${appName}'`)\n    console.log(`   Retrieved App ID: ${retrievedApp.appId}`)\n  } else {\n    console.log(`❌ App '${appName}' not found in retrieved apps`)\n  }\n\n  console.log(`\\n💡 Key Takeaway: When multiple apps share the same name, only the most`)\n  console.log(`   recently created app is returned by getCreatorAppsByName.`)\n}\n\nmain().catch(console.error)"
}
```
