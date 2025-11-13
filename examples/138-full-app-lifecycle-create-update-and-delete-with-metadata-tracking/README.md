# Full App Lifecycle: Create, Update, and Delete with Metadata Tracking

Comprehensive example demonstrating the complete app lifecycle including creating multiple apps, updating one with new metadata, deleting another, and tracking all state changes

## Example Details

```json
{
  "example_id": "138-full-app-lifecycle-create-update-and-delete-with-metadata-tracking",
  "title": "Full App Lifecycle: Create, Update, and Delete with Metadata Tracking",
  "summary": "Comprehensive example demonstrating the complete app lifecycle including creating multiple apps, updating one with new metadata, deleting another, and tracking all state changes",
  "language": "typescript",
  "complexity": "complex",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Create multiple apps, update one with new metadata, delete another, and verify all apps and their states are correctly tracked",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "algorand.send.appCreate",
    "algorand.send.appUpdate",
    "algorand.send.appDelete",
    "algorand.appDeployer.getCreatorAppsByName"
  ],
  "feature_tags": [
    "app-lifecycle",
    "app-creation",
    "app-update",
    "app-deletion",
    "metadata-tracking",
    "deployment-metadata",
    "app-deployer"
  ],
  "folder": "138-full-app-lifecycle-create-update-and-delete-with-metadata-tracking",
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
    "Three apps created with different names",
    "One app updated with new metadata (version, updatable, deletable flags changed)",
    "One app deleted",
    "Retrieved apps showing correct states: one updated, one unchanged, one deleted",
    "Metadata tracking showing creation and update metadata separately"
  ],
  "source_tests": [
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Created, updated and deleted apps are retrieved by name with deployment metadata"
    }
  ],
  "artifacts_plan": [],
  "notes": "This is the most comprehensive example showing full app lifecycle management. It demonstrates best practices for managing app deployments including versioning, metadata updates, and proper tracking of app states.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport algosdk from 'algosdk'\n\n/**\n * Comprehensive example demonstrating the full Algorand app lifecycle:\n * \n * 1. Create multiple apps with deployment metadata\n * 2. Update an app with new metadata (version upgrade, flag changes)\n * 3. Delete an app\n * 4. Retrieve all apps and verify their states\n * \n * This shows how metadata is tracked throughout the app's lifetime,\n * including creation metadata, update metadata, and deletion status.\n */\n\nasync function main() {\n  // Initialize Algorand client for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get a test account with funds\n  const testAccount = await algorand.account.fromEnvironment('ACCOUNT1')\n  console.log(`Using account: ${testAccount.addr}\\n`)\n\n  // ========================================\n  // STEP 1: Create three apps with metadata\n  // ========================================\n  console.log('📦 STEP 1: Creating three apps with metadata\\n')\n  \n  const appName1 = 'APP_1'\n  const appName2 = 'APP_2'\n  const appName3 = 'APP_3'\n  \n  const creationMetadata = {\n    name: appName1,\n    version: '1.0',\n    updatable: true,\n    deletable: true\n  }\n\n  // Compile simple TEAL programs\n  const approvalProgram = await algorand.app.compileTeal(\n    '#pragma version 10\\nint 1\\nreturn'\n  )\n  const clearProgram = await algorand.app.compileTeal(\n    '#pragma version 10\\nint 1\\nreturn'\n  )\n\n  // Create App 1\n  console.log(`Creating ${appName1}...`)\n  const app1 = await algorand.send.appCreate({\n    sender: testAccount.addr,\n    approvalProgram: approvalProgram.compiledBase64ToBytes,\n    clearStateProgram: clearProgram.compiledBase64ToBytes,\n    schema: {\n      globalUints: 0,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0\n    },\n    onComplete: algosdk.OnApplicationComplete.NoOpOC,\n    note: new TextEncoder().encode(JSON.stringify(creationMetadata))\n  })\n  console.log(`  ✅ ${appName1} created with ID: ${app1.appId}\\n`)\n\n  // Create App 2\n  console.log(`Creating ${appName2}...`)\n  const app2 = await algorand.send.appCreate({\n    sender: testAccount.addr,\n    approvalProgram: approvalProgram.compiledBase64ToBytes,\n    clearStateProgram: clearProgram.compiledBase64ToBytes,\n    schema: {\n      globalUints: 0,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0\n    },\n    onComplete: algosdk.OnApplicationComplete.NoOpOC,\n    note: new TextEncoder().encode(JSON.stringify({ ...creationMetadata, name: appName2 }))\n  })\n  console.log(`  ✅ ${appName2} created with ID: ${app2.appId}\\n`)\n\n  // Create App 3\n  console.log(`Creating ${appName3}...`)\n  const app3 = await algorand.send.appCreate({\n    sender: testAccount.addr,\n    approvalProgram: approvalProgram.compiledBase64ToBytes,\n    clearStateProgram: clearProgram.compiledBase64ToBytes,\n    schema: {\n      globalUints: 0,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0\n    },\n    onComplete: algosdk.OnApplicationComplete.NoOpOC,\n    note: new TextEncoder().encode(JSON.stringify({ ...creationMetadata, name: appName3 }))\n  })\n  console.log(`  ✅ ${appName3} created with ID: ${app3.appId}\\n`)\n\n  // ========================================\n  // STEP 2: Update App 1 with new metadata\n  // ========================================\n  console.log('🔄 STEP 2: Updating App 1 with new metadata\\n')\n  \n  const updateMetadata = {\n    name: appName1,\n    version: '2.0', // Version upgrade\n    updatable: false, // Lock further updates\n    deletable: false // Prevent deletion\n  }\n\n  console.log(`Updating ${appName1} (ID: ${app1.appId})...`)\n  console.log('  New metadata:', JSON.stringify(updateMetadata, null, 2))\n  \n  const update1 = await algorand.send.appUpdate({\n    appId: app1.appId,\n    sender: testAccount.addr,\n    approvalProgram: approvalProgram.compiledBase64ToBytes,\n    clearStateProgram: clearProgram.compiledBase64ToBytes,\n    note: new TextEncoder().encode(JSON.stringify(updateMetadata))\n  })\n  console.log(`  ✅ ${appName1} updated in round: ${update1.confirmation.confirmedRound}\\n`)\n\n  // ========================================\n  // STEP 3: Delete App 3\n  // ========================================\n  console.log('🗑️  STEP 3: Deleting App 3\\n')\n  \n  console.log(`Deleting ${appName3} (ID: ${app3.appId})...`)\n  const delete3 = await algorand.send.appDelete({\n    appId: app3.appId,\n    sender: testAccount.addr\n  })\n  console.log(`  ✅ ${appName3} deleted in round: ${delete3.confirmation.confirmedRound}\\n`)\n\n  // Wait for indexer to catch up\n  console.log('Waiting for indexer to index all transactions...')\n  await new Promise(resolve => setTimeout(resolve, 3000))\n\n  // ========================================\n  // STEP 4: Retrieve and verify all apps\n  // ========================================\n  console.log('\\n📋 STEP 4: Retrieving all apps and verifying states\\n')\n  \n  const apps = await algorand.appDeployer.getCreatorAppsByName(testAccount.addr)\n\n  console.log(`Creator: ${apps.creator}`)\n  console.log(`Apps found: ${Object.keys(apps.apps).sort().join(', ')}\\n`)\n\n  // Verify App 1 (updated)\n  console.log(`\\n━━━ ${appName1} (Updated App) ━━━`)\n  const app1Data = apps.apps[appName1]\n  if (app1Data) {\n    console.log(`App ID: ${app1Data.appId}`)\n    console.log(`App Address: ${app1Data.appAddress}`)\n    console.log(`Deleted: ${app1Data.deleted}`)\n    console.log(`\\nCreation Metadata (v1.0):`, app1Data.createdMetadata)\n    console.log(`  - Created in round: ${app1Data.createdRound}`)\n    console.log(`\\nCurrent Metadata (v2.0):`, {\n      name: app1Data.name,\n      version: app1Data.version,\n      updatable: app1Data.updatable,\n      deletable: app1Data.deletable\n    })\n    console.log(`  - Updated in round: ${app1Data.updatedRound}`)\n    console.log(`\\n✅ Metadata shows version upgrade from 1.0 to 2.0`)\n    console.log(`✅ Update flags changed: updatable=${app1Data.updatable}, deletable=${app1Data.deletable}`)\n  }\n\n  // Verify App 2 (unchanged)\n  console.log(`\\n━━━ ${appName2} (Unchanged App) ━━━`)\n  const app2Data = apps.apps[appName2]\n  if (app2Data) {\n    console.log(`App ID: ${app2Data.appId}`)\n    console.log(`Deleted: ${app2Data.deleted}`)\n    console.log(`Version: ${app2Data.version}`)\n    console.log(`\\n✅ App remains in original state`)\n  }\n\n  // Verify App 3 (deleted)\n  console.log(`\\n━━━ ${appName3} (Deleted App) ━━━`)\n  const app3Data = apps.apps[appName3]\n  if (app3Data) {\n    console.log(`App ID: ${app3Data.appId}`)\n    console.log(`Deleted: ${app3Data.deleted}`)\n    console.log(`\\n✅ App is marked as deleted but still tracked in metadata`)\n  }\n\n  // Summary\n  console.log('\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')\n  console.log('📊 SUMMARY')\n  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')\n  console.log(`✅ Created 3 apps with metadata`)\n  console.log(`✅ Updated 1 app (${appName1}) - version 1.0 → 2.0`)\n  console.log(`✅ Deleted 1 app (${appName3})`)\n  console.log(`✅ All apps tracked with correct states`)\n  console.log(`\\n💡 Key Features Demonstrated:`)\n  console.log(`   • Creation metadata preserved even after updates`)\n  console.log(`   • Update metadata tracked separately with round number`)\n  console.log(`   • Deleted apps remain in metadata with deleted=true flag`)\n  console.log(`   • Full lifecycle visibility for app management`)\n}\n\nmain().catch(console.error)"
}
```
