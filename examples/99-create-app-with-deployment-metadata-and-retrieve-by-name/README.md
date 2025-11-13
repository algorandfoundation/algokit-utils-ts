# Create App with Deployment Metadata and Retrieve by Name

Demonstrates how to create an Algorand application with deployment metadata (name, version, updatable, deletable) and retrieve it by name using the app deployer

## Example Details

```json
{
  "example_id": "99-create-app-with-deployment-metadata-and-retrieve-by-name",
  "title": "Create App with Deployment Metadata and Retrieve by Name",
  "summary": "Demonstrates how to create an Algorand application with deployment metadata (name, version, updatable, deletable) and retrieve it by name using the app deployer",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Create an app with metadata and retrieve it by name to verify all metadata fields are correctly stored and returned",
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
    "deployment-metadata",
    "app-retrieval",
    "metadata-storage",
    "app-deployer"
  ],
  "folder": "99-create-app-with-deployment-metadata-and-retrieve-by-name",
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
    "App created with ID and metadata",
    "Retrieved app information showing name, version, updatable, deletable flags",
    "Confirmation that metadata matches creation parameters"
  ],
  "source_tests": [
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Created app is retrieved by name with deployment metadata"
    }
  ],
  "artifacts_plan": [],
  "notes": "This example requires LocalNet to be running and shows the fundamental pattern for creating apps with metadata that can be tracked and retrieved by name.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates how to:\n * 1. Create an Algorand application with deployment metadata\n * 2. Retrieve the app by creator address and name\n * 3. Verify all metadata fields are correctly stored\n */\n\nasync function main() {\n  // Initialize Algorand client for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get a test account with funds\n  const testAccount = await algorand.account.fromEnvironment('ACCOUNT1')\n  console.log(`Using account: ${testAccount.addr}\\n`)\n\n  // Define deployment metadata\n  const appName = 'MY_APP'\n  const creationMetadata = {\n    name: appName,\n    version: '1.0',\n    updatable: true,\n    deletable: false\n  }\n\n  console.log('Creating app with metadata:')\n  console.log(JSON.stringify(creationMetadata, null, 2))\n  console.log()\n\n  // Create a simple app (using approval and clear programs)\n  // In production, replace these with your actual TEAL programs\n  const approvalProgram = await algorand.app.compileTeal(\n    '#pragma version 10\\nint 1\\nreturn'\n  )\n  const clearProgram = await algorand.app.compileTeal(\n    '#pragma version 10\\nint 1\\nreturn'\n  )\n\n  // Create the app with metadata\n  const appCreateResult = await algorand.send.appCreate({\n    sender: testAccount.addr,\n    approvalProgram: approvalProgram.compiledBase64ToBytes,\n    clearStateProgram: clearProgram.compiledBase64ToBytes,\n    schema: {\n      globalUints: 0,\n      globalByteSlices: 0,\n      localUints: 0,\n      localByteSlices: 0\n    },\n    onComplete: algosdk.OnApplicationComplete.NoOpOC,\n    // Include metadata in the transaction note\n    note: new TextEncoder().encode(JSON.stringify(creationMetadata))\n  })\n\n  console.log(`✅ App created successfully!`)\n  console.log(`App ID: ${appCreateResult.appId}`)\n  console.log(`App Address: ${appCreateResult.appAddress}`)\n  console.log(`Confirmed in round: ${appCreateResult.confirmation.confirmedRound}\\n`)\n\n  // Wait for indexer to catch up (important for LocalNet)\n  console.log('Waiting for indexer to index the transaction...')\n  await new Promise(resolve => setTimeout(resolve, 2000))\n\n  // Retrieve apps by name for this creator\n  const apps = await algorand.appDeployer.getCreatorAppsByName(testAccount.addr)\n\n  console.log('\\n📋 Retrieved apps by name:')\n  console.log(`Creator: ${apps.creator}`)\n  console.log(`Apps found: ${Object.keys(apps.apps).join(', ')}\\n`)\n\n  // Get the specific app we just created\n  const retrievedApp = apps.apps[appName]\n  \n  if (retrievedApp) {\n    console.log('✅ App metadata verification:')\n    console.log(`  App ID: ${retrievedApp.appId}`)\n    console.log(`  App Address: ${retrievedApp.appAddress}`)\n    console.log(`  Name: ${retrievedApp.name}`)\n    console.log(`  Version: ${retrievedApp.version}`)\n    console.log(`  Updatable: ${retrievedApp.updatable}`)\n    console.log(`  Deletable: ${retrievedApp.deletable}`)\n    console.log(`  Created Round: ${retrievedApp.createdRound}`)\n    console.log(`  Updated Round: ${retrievedApp.updatedRound}`)\n    console.log(`\\n  Created Metadata:`, retrievedApp.createdMetadata)\n    \n    // Verify the data matches\n    const isValid = \n      retrievedApp.appId === appCreateResult.appId &&\n      retrievedApp.name === creationMetadata.name &&\n      retrievedApp.version === creationMetadata.version &&\n      retrievedApp.updatable === creationMetadata.updatable &&\n      retrievedApp.deletable === creationMetadata.deletable\n    \n    console.log(`\\n${isValid ? '✅' : '❌'} Metadata verification: ${isValid ? 'PASSED' : 'FAILED'}`)\n  } else {\n    console.log(`❌ App '${appName}' not found in retrieved apps`)\n  }\n}\n\nmain().catch(console.error)"
}
```
