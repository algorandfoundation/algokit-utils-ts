# Smart Contract Deployment with ABI Method Call

Shows how to deploy a smart contract application using an ABI method call for initialization. This enables typed contract creation with proper method signatures.

## Example Details

```json
{
  "example_id": "130-smart-contract-deployment-with-abi-method-call",
  "title": "Smart Contract Deployment with ABI Method Call",
  "summary": "Shows how to deploy a smart contract application using an ABI method call for initialization. This enables typed contract creation with proper method signatures.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Create a new smart contract application using an ABI method call",
  "target_users": [
    "Smart contract developers",
    "dApp developers"
  ],
  "features_tested": [
    "algorand.send.appCreateMethodCall",
    "ABIContract",
    "program compilation"
  ],
  "feature_tags": [
    "app-creation",
    "abi-method-calls",
    "smart-contracts",
    "program-compilation",
    "typed-contracts",
    "app-deployment"
  ],
  "folder": "130-smart-contract-deployment-with-abi-method-call",
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
        "name": "ALICE_MNEMONIC",
        "required": true,
        "example": "your 25-word mnemonic phrase here"
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start LocalNet: algokit localnet start",
      "Place your application.json file in the same directory as main.ts"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Approval and clear state programs compiled successfully",
    "Smart contract deployed with App ID",
    "Application information including creator address and state schemas"
  ],
  "source_tests": [
    {
      "file": "src/types/algorand-client.spec.ts",
      "test_name": "methodCall create"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "application.json",
      "type": "config",
      "action": "generate",
      "source_path": null,
      "note": "Sample application specification file with ABI contract definition and TEAL source code"
    }
  ],
  "notes": "You'll need a valid application specification (application.json) with contract ABI definition and TEAL source code. The example assumes the app spec has a 'createApplication' method defined.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport algosdk from 'algosdk'\nimport * as fs from 'fs'\nimport * as path from 'path'\n\n/**\n * This example demonstrates how to deploy a smart contract application\n * using an ABI method call for initialization.\n * \n * Using ABI methods provides type safety and ensures the correct\n * arguments are passed during contract creation.\n */\nasync function deploySmartContractWithABI() {\n  // Initialize the Algorand client for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get a funded account\n  const alice = await algorand.account.fromEnvironment('ALICE')\n  \n  console.log('Loading application specification...')\n  \n  // Load the application specification (app spec)\n  // The app spec contains the ABI contract definition and TEAL source code\n  const appSpecPath = path.join(__dirname, 'application.json')\n  const appSpec = JSON.parse(fs.readFileSync(appSpecPath, 'utf-8'))\n  \n  // Create an ABI contract instance from the app spec\n  const contract = new algosdk.ABIContract(appSpec.contract)\n  \n  console.log(`\\nFound creation method: ${contract.getMethodByName('createApplication').name}`)\n  \n  // Helper function to compile TEAL programs\n  async function compileProgram(source: string): Promise<Uint8Array> {\n    const algod = algorand.client.algod\n    const result = await algod.compile(source).do()\n    return new Uint8Array(Buffer.from(result.result, 'base64'))\n  }\n  \n  console.log('\\nCompiling approval program...')\n  const approvalProgram = await compileProgram(appSpec.source.approval)\n  console.log('✓ Approval program compiled')\n  \n  console.log('Compiling clear state program...')\n  const clearStateProgram = await compileProgram(appSpec.source.clear)\n  console.log('✓ Clear state program compiled')\n  \n  console.log('\\nDeploying smart contract...')\n  \n  // Deploy the smart contract using an ABI method call\n  const result = await algorand.send.appCreateMethodCall({\n    sender: alice,\n    method: contract.getMethodByName('createApplication'),\n    approvalProgram: approvalProgram,\n    clearStateProgram: clearStateProgram,\n  })\n  \n  const appId = result.appId\n  console.log(`\\n✓ Smart contract deployed successfully!`)\n  console.log(`  App ID: ${appId}`)\n  console.log(`  Transaction ID: ${result.txIds[0]}`)\n  \n  // Get application information\n  const algod = algorand.client.algod\n  const appInfo = await algod.getApplicationByID(Number(appId)).do()\n  \n  console.log('\\nApplication Information:')\n  console.log(`  Creator: ${appInfo.params.creator}`)\n  console.log(`  Global State Schema: ${appInfo.params['global-state-schema']?.['num-uint']} uints, ${appInfo.params['global-state-schema']?.['num-byte-slice']} byte slices`)\n  console.log(`  Local State Schema: ${appInfo.params['local-state-schema']?.['num-uint']} uints, ${appInfo.params['local-state-schema']?.['num-byte-slice']} byte slices`)\n  \n  console.log('\\n✓ Smart contract deployment completed!')\n}\n\n// Run the example\ndeploySmartContractWithABI().catch(console.error)"
}
```
