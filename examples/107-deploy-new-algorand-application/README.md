# Deploy New Algorand Application

Demonstrates how to deploy a new Algorand application using the appDeployer with deployment metadata, including proper configuration for updatability and deletability controls.

## Example Details

```json
{
  "example_id": "107-deploy-new-algorand-application",
  "title": "Deploy New Algorand Application",
  "summary": "Demonstrates how to deploy a new Algorand application using the appDeployer with deployment metadata, including proper configuration for updatability and deletability controls.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Deploy a new app with deployment metadata and verify all fields are correctly set",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "algorand.appDeployer.deploy",
    "getApplicationAddress",
    "deployment metadata",
    "application creation"
  ],
  "feature_tags": [
    "app-deployment",
    "deployment-metadata",
    "idempotency",
    "smart-contracts",
    "application-lifecycle",
    "updatable-apps",
    "deletable-apps"
  ],
  "folder": "107-deploy-new-algorand-application",
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
        "name": "ALGOD_TOKEN",
        "required": false,
        "example": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      {
        "name": "ALGOD_SERVER",
        "required": false,
        "example": "http://localhost"
      },
      {
        "name": "ALGOD_PORT",
        "required": false,
        "example": "4001"
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
    "Application deployed successfully",
    "App ID: <number>",
    "App Address: <algorand address>",
    "Created Round: <number>",
    "Application Name: <name from metadata>",
    "Version: <version from metadata>",
    "Updatable: <boolean>",
    "Deletable: <boolean>"
  ],
  "source_tests": [
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Deploy new app"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "approval.teal",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Sample TEAL approval program with TMPL_UPDATABLE and TMPL_DELETABLE template variables"
    },
    {
      "target_file": "clear.teal",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Sample TEAL clear state program"
    },
    {
      "target_file": "package.json",
      "type": "config",
      "action": "generate",
      "source_path": null,
      "note": "NPM package configuration with required dependencies"
    }
  ],
  "notes": "This example demonstrates the recommended high-level API for app deployment using appDeployer. It shows how to configure deployment metadata including updatability and deletability controls.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport { getApplicationAddress } from 'algosdk'\nimport * as fs from 'fs'\nimport * as path from 'path'\n\n/**\n * This example demonstrates how to deploy a new Algorand application using the appDeployer.\n * The appDeployer is the recommended high-level API for app deployment as it handles:\n * - Idempotent deployments (won't redeploy if the app already exists)\n * - Deployment metadata tracking\n * - Updatability and deletability controls\n */\nasync function deployNewApp() {\n  // Initialize the Algorand client for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n\n  // Get a test account with funds from the LocalNet dispenser\n  const deployer = await algorand.account.localNet.dispenser()\n  \n  console.log('Deployer account:', deployer.addr)\n\n  // Read the approval and clear state programs\n  const approvalProgram = fs.readFileSync(\n    path.join(__dirname, 'approval.teal'),\n    'utf8'\n  )\n  const clearProgram = fs.readFileSync(\n    path.join(__dirname, 'clear.teal'),\n    'utf8'\n  )\n\n  // Compile the TEAL programs\n  const approvalCompiled = await algorand.client.algod.compile(approvalProgram).do()\n  const clearCompiled = await algorand.client.algod.compile(clearProgram).do()\n\n  // Define deployment metadata\n  // This metadata is used for idempotent deployments and tracking\n  const metadata = {\n    name: 'MyExampleApp',\n    version: '1.0.0',\n    updatable: true,  // Can be updated after deployment\n    deletable: true,  // Can be deleted after deployment\n  }\n\n  console.log('\\nDeploying application with metadata:', metadata)\n\n  // Create the deployment parameters\n  const deployment = {\n    sender: deployer.addr,\n    metadata,\n    createParams: {\n      approvalProgram: new Uint8Array(Buffer.from(approvalCompiled.result, 'base64')),\n      clearStateProgram: new Uint8Array(Buffer.from(clearCompiled.result, 'base64')),\n      globalNumUint: 1,\n      globalNumByteSlice: 1,\n      localNumUint: 0,\n      localNumByteSlice: 0,\n    },\n    deployTimeParams: {\n      TMPL_UPDATABLE: metadata.updatable ? 1 : 0,\n      TMPL_DELETABLE: metadata.deletable ? 1 : 0,\n    },\n  }\n\n  try {\n    // Deploy the application\n    // This will create the app on the blockchain\n    const result = await algorand.appDeployer.deploy(deployment)\n\n    console.log('\\n✅ Application deployed successfully!')\n    console.log('\\nDeployment Details:')\n    console.log('-------------------')\n    console.log('App ID:', result.appId.toString())\n    console.log('App Address:', result.appAddress)\n    console.log('Transaction ID:', result.transaction.txID())\n    console.log('Created Round:', result.createdRound.toString())\n    console.log('Updated Round:', result.updatedRound.toString())\n    console.log('\\nMetadata:')\n    console.log('Name:', result.name)\n    console.log('Version:', result.version)\n    console.log('Updatable:', result.updatable)\n    console.log('Deletable:', result.deletable)\n    console.log('Deleted:', result.deleted)\n\n    // Verify the app address matches the expected address\n    const expectedAddress = getApplicationAddress(result.appId)\n    console.log('\\nVerification:')\n    console.log('Expected Address:', expectedAddress)\n    console.log('Matches:', result.appAddress === expectedAddress ? '✓' : '✗')\n\n    return result\n  } catch (error) {\n    console.error('❌ Deployment failed:', error)\n    throw error\n  }\n}\n\n// Run the example\ndeployNewApp()\n  .then(() => {\n    console.log('\\n✅ Example completed successfully')\n    process.exit(0)\n  })\n  .catch((error) => {\n    console.error('\\n❌ Example failed:', error)\n    process.exit(1)\n  })"
}
```
