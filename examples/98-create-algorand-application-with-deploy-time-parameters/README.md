# Create Algorand Application with Deploy-Time Parameters

Demonstrates how to create a new Algorand application using AppClient with deploy-time parameters and verify the creation result

## Example Details

```json
{
  "example_id": "98-create-algorand-application-with-deploy-time-parameters",
  "title": "Create Algorand Application with Deploy-Time Parameters",
  "summary": "Demonstrates how to create a new Algorand application using AppClient with deploy-time parameters and verify the creation result",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Create a new application with deploy-time parameters and verify creation",
  "target_users": [
    "SDK developers",
    "Smart contract developers"
  ],
  "features_tested": [
    "algokit.getAppClient",
    "client.create",
    "getApplicationAddress",
    "constructor deployTimeParams"
  ],
  "feature_tags": [
    "app-deployment",
    "app-creation",
    "deploy-time-parameters",
    "app-client",
    "smart-contracts"
  ],
  "folder": "98-create-algorand-application-with-deploy-time-parameters",
  "prerequisites": {
    "tools": [
      "AlgoKit",
      "Docker (for LocalNet)",
      "Node.js"
    ],
    "libraries": [
      "@algorandfoundation/algokit-utils",
      "algosdk",
      "typescript"
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
        "name": "INDEXER_SERVER",
        "required": false,
        "example": "http://localhost"
      },
      {
        "name": "INDEXER_PORT",
        "required": false,
        "example": "8980"
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start AlgoKit LocalNet: algokit localnet start"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk typescript ts-node"
    ],
    "execute": [
      "npx ts-node main.ts"
    ]
  },
  "expected_output": [
    "=== Approach 1: Deploy-time parameters in create() method ===",
    "App created successfully!",
    "- App ID: <positive integer>",
    "- App Address: <58-character address>",
    "- Expected Address: <matching address>",
    "- Application Index: <matching app ID>",
    "- Compiled Approval Program: Present",
    "",
    "=== Approach 2: Deploy-time parameters in constructor ===",
    "App created with constructor params!",
    "- App ID: <positive integer>",
    "- App Address: <58-character address>",
    "",
    "=== Summary ===",
    "Both approaches successfully created apps with deploy-time parameters."
  ],
  "source_tests": [
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "Create app"
    },
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "Create app with constructor deployTimeParams"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.json",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Sample app spec file for demonstration purposes. Replace with your actual compiled smart contract specification."
    }
  ],
  "notes": "This example combines two related test cases that demonstrate different ways to pass deploy-time parameters. Users will need to replace the appSpec with their actual compiled smart contract specification. Deploy-time parameters are template variables that get substituted into the TEAL code during compilation, allowing for customization of immutable contract parameters.",
  "generated_code": "import * as algokit from '@algorandfoundation/algokit-utils'\nimport { getApplicationAddress } from 'algosdk'\n\n/**\n * Demonstrates creating an Algorand application with deploy-time parameters.\n * \n * This example shows two approaches:\n * 1. Passing deploy-time parameters in the create() method\n * 2. Passing deploy-time parameters in the client constructor\n */\nasync function main() {\n  // Initialize AlgoKit with LocalNet\n  const localnet = await algokit.getLocalNetDispenserAccount(\n    algokit.getAlgoClient(),\n    algokit.getAlgoIndexerClient()\n  )\n  const algod = algokit.getAlgoClient()\n  const indexer = algokit.getAlgoIndexerClient()\n  const testAccount = localnet\n\n  // Load your app spec (replace with your actual app spec)\n  // This should be imported from your contract's artifacts\n  const appSpec = {\n    // Your app specification here\n    // Typically generated from your smart contract\n  } as algokit.AppSpec\n\n  console.log('\\n=== Approach 1: Deploy-time parameters in create() method ===')\n  \n  // Create an app client that resolves by creator and name\n  const client1 = algokit.getAppClient(\n    {\n      resolveBy: 'creatorAndName',\n      app: appSpec,\n      sender: testAccount,\n      creatorAddress: testAccount.addr,\n      findExistingUsing: indexer,\n    },\n    algod,\n  )\n\n  // Create the app with deploy-time parameters\n  // Deploy-time parameters are template variables that get substituted during compilation\n  const app1 = await client1.create({\n    deployTimeParams: {\n      // The TMPL_ prefix is automatically stripped\n      TMPL_UPDATABLE: 0,  // Set if the app can be updated\n      DELETABLE: 0,       // Set if the app can be deleted\n      VALUE: 1,           // Custom app parameter\n    },\n  })\n\n  console.log('App created successfully!')\n  console.log('- App ID:', app1.appId)\n  console.log('- App Address:', app1.appAddress)\n  console.log('- Expected Address:', getApplicationAddress(app1.appId).toString())\n  console.log('- Application Index:', app1.confirmation?.applicationIndex?.toString())\n  console.log('- Compiled Approval Program:', app1.compiledApproval ? 'Present' : 'Missing')\n\n  console.log('\\n=== Approach 2: Deploy-time parameters in constructor ===')\n  \n  // Alternative approach: set deploy-time params in the constructor\n  const client2 = algokit.getAppClient(\n    {\n      resolveBy: 'id',\n      app: appSpec,\n      sender: testAccount,\n      id: 0,  // 0 means create a new app\n      deployTimeParams: {\n        UPDATABLE: 0,\n        DELETABLE: 0,\n        VALUE: 1,\n      },\n    },\n    algod,\n  )\n\n  // Create the app without needing to pass params again\n  const app2 = await client2.create()\n\n  console.log('App created with constructor params!')\n  console.log('- App ID:', app2.appId)\n  console.log('- App Address:', app2.appAddress)\n\n  console.log('\\n=== Summary ===')\n  console.log('Both approaches successfully created apps with deploy-time parameters.')\n  console.log('Choose the approach that best fits your application architecture:')\n  console.log('- Method params: Better for dynamic parameters')\n  console.log('- Constructor params: Better for consistent parameters across operations')\n}\n\nmain().catch(console.error)"
}
```
