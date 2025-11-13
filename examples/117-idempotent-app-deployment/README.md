# Idempotent App Deployment

Demonstrates the idempotent nature of the app deployer - deploying the same app twice with identical parameters results in no operation on the second deployment, avoiding unnecessary transactions and costs.

## Example Details

```json
{
  "example_id": "117-idempotent-app-deployment",
  "title": "Idempotent App Deployment",
  "summary": "Demonstrates the idempotent nature of the app deployer - deploying the same app twice with identical parameters results in no operation on the second deployment, avoiding unnecessary transactions and costs.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Deploy an app twice with identical parameters and verify the second deployment performs no operation",
  "target_users": [
    "SDK developers",
    "DevOps engineers",
    "Infrastructure engineers"
  ],
  "features_tested": [
    "algorand.appDeployer.deploy",
    "idempotent deployment",
    "deployment optimization"
  ],
  "feature_tags": [
    "app-deployment",
    "idempotency",
    "optimization",
    "ci-cd",
    "deployment-best-practices"
  ],
  "folder": "117-idempotent-app-deployment",
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
    "First deployment creates a new app with transaction details",
    "Second deployment detects no changes and returns existing app details",
    "No transaction is created on the second deployment",
    "Both deployments return the same app ID and metadata",
    "Console output clearly shows the optimization"
  ],
  "source_tests": [
    {
      "file": "src/app-deploy.spec.ts",
      "test_name": "Do nothing if deploying app with no changes"
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
  "notes": "This example is particularly valuable for CI/CD pipelines where deployments may run multiple times. The idempotent behavior ensures efficiency and cost savings.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport { Config } from '@algorandfoundation/algokit-utils/types/config'\nimport algosdk from 'algosdk'\n\n/**\n * This example demonstrates the idempotent nature of the app deployer.\n * \n * When you deploy an app with identical parameters multiple times, the deployer\n * intelligently detects that nothing has changed and skips the deployment,\n * avoiding unnecessary transactions and costs.\n * \n * This is especially useful for:\n * - CI/CD pipelines that may run multiple times\n * - Development workflows with frequent deployments\n * - Infrastructure-as-code scenarios where you want declarative deployments\n */\n\nasync function main() {\n  // Configure AlgoKit\n  Config.configure({ debug: true })\n\n  // Initialize AlgorandClient for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get a test account with funds\n  const account = await algorand.account.fromEnvironment('DEPLOYER')\n  console.log('Using account:', account.addr)\n  console.log('Initial balance:', algosdk.microalgosToAlgos(await algorand.client.algod.accountInformation(account.addr).do().then(info => info.amount)), 'ALGO')\n\n  // Define simple TEAL programs\n  const approvalProgram = `#pragma version 8\n// Simple approval program\nint 1\nreturn`\n\n  const clearProgram = `#pragma version 8\n// Simple clear state program\nint 1\nreturn`\n\n  // Define deployment parameters\n  const metadata = {\n    name: 'IdempotentApp',\n    version: '1.0.0',\n    deletable: true,\n    updatable: true,\n  }\n\n  const deploymentParams = {\n    sender: account,\n    approvalProgram: approvalProgram,\n    clearStateProgram: clearProgram,\n    schema: {\n      globalUints: 1,\n      globalByteSlices: 1,\n      localUints: 0,\n      localByteSlices: 0,\n    },\n    metadata: metadata,\n  }\n\n  // Step 1: Initial deployment\n  console.log('\\n=== FIRST DEPLOYMENT ===')\n  console.log('Deploying app with:')\n  console.log('  - Name:', metadata.name)\n  console.log('  - Version:', metadata.version)\n  console.log('  - Schema: globalUints=1, globalByteSlices=1')\n  \n  const initialDeployment = await algorand.appDeployer.deploy(deploymentParams)\n  \n  console.log('\\n✅ Initial deployment completed')\n  console.log('   Transaction created:', 'transaction' in initialDeployment ? 'Yes' : 'No')\n  if ('transaction' in initialDeployment) {\n    console.log('   Transaction ID:', initialDeployment.transaction.txID())\n  }\n  console.log('   App ID:', initialDeployment.appId)\n  console.log('   App Address:', initialDeployment.appAddress)\n  console.log('   Created Round:', initialDeployment.createdRound)\n  console.log('   Updated Round:', initialDeployment.updatedRound)\n  console.log('   Version:', initialDeployment.version)\n  console.log('   Deletable:', initialDeployment.deletable)\n  console.log('   Updatable:', initialDeployment.updatable)\n\n  // Wait for indexer to catch up\n  await new Promise(resolve => setTimeout(resolve, 2000))\n\n  // Get balance after first deployment\n  const balanceAfterFirst = algosdk.microalgosToAlgos(\n    await algorand.client.algod.accountInformation(account.addr).do().then(info => info.amount)\n  )\n  console.log('\\n   Balance after first deployment:', balanceAfterFirst, 'ALGO')\n\n  // Step 2: Second deployment with identical parameters\n  console.log('\\n=== SECOND DEPLOYMENT (IDENTICAL PARAMETERS) ===')\n  console.log('Deploying the exact same app again...')\n  \n  const secondDeployment = await algorand.appDeployer.deploy(deploymentParams)\n  \n  console.log('\\n✅ Second deployment completed')\n  console.log('   Transaction created:', 'transaction' in secondDeployment ? 'Yes' : 'No')\n  console.log('   App ID:', secondDeployment.appId)\n  console.log('   App Address:', secondDeployment.appAddress)\n  console.log('   Created Round:', secondDeployment.createdRound)\n  console.log('   Updated Round:', secondDeployment.updatedRound)\n  console.log('   Version:', secondDeployment.version)\n  console.log('   Deletable:', secondDeployment.deletable)\n  console.log('   Updatable:', secondDeployment.updatable)\n\n  // Get balance after second deployment\n  const balanceAfterSecond = algosdk.microalgosToAlgos(\n    await algorand.client.algod.accountInformation(account.addr).do().then(info => info.amount)\n  )\n  console.log('\\n   Balance after second deployment:', balanceAfterSecond, 'ALGO')\n\n  // Step 3: Analysis\n  console.log('\\n=== IDEMPOTENCY ANALYSIS ===')\n  \n  const hasTransaction = 'transaction' in secondDeployment\n  console.log('\\n📊 Comparison:')\n  console.log('   Same App ID:', initialDeployment.appId === secondDeployment.appId ? '✅' : '❌')\n  console.log('   Same App Address:', initialDeployment.appAddress === secondDeployment.appAddress ? '✅' : '❌')\n  console.log('   Same Version:', initialDeployment.version === secondDeployment.version ? '✅' : '❌')\n  console.log('   Created Round:', initialDeployment.createdRound === secondDeployment.createdRound ? '✅ Same' : '❌ Different')\n  console.log('   Updated Round:', initialDeployment.updatedRound === secondDeployment.updatedRound ? '✅ Same (no update)' : '❌ Different')\n  console.log('   Transaction Created:', hasTransaction ? '❌ Yes (unexpected)' : '✅ No (optimized!)')\n  console.log('   Balance Changed:', balanceAfterFirst === balanceAfterSecond ? '✅ No (no fees)' : '❌ Yes')\n\n  console.log('\\n💡 Key Insights:')\n  console.log('   1. The deployer detected no changes between deployments')\n  console.log('   2. No transaction was created (saving time and fees)')\n  console.log('   3. The same app information was returned')\n  console.log('   4. This behavior is called \"idempotency\"')\n  \n  console.log('\\n🎯 Benefits:')\n  console.log('   ✅ Safe to run deployment scripts multiple times')\n  console.log('   ✅ No unnecessary blockchain transactions')\n  console.log('   ✅ Cost savings (no transaction fees)')\n  console.log('   ✅ Faster deployment cycles')\n  console.log('   ✅ Perfect for CI/CD automation')\n  \n  console.log('\\n🔧 When Updates Occur:')\n  console.log('   - When approval or clear program changes')\n  console.log('   - When schema changes (within allowed bounds)')\n  console.log('   - When version number changes')\n  console.log('   - When metadata changes')\n}\n\nmain().catch(console.error)"
}
```
