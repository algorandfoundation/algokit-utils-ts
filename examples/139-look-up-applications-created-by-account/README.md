# Look Up Applications Created By Account

Demonstrates how to retrieve all applications created by a specific account using the Algorand indexer with pagination support.

## Example Details

```json
{
  "example_id": "139-look-up-applications-created-by-account",
  "title": "Look Up Applications Created By Account",
  "summary": "Demonstrates how to retrieve all applications created by a specific account using the Algorand indexer with pagination support.",
  "language": "typescript",
  "complexity": "complex",
  "example_potential": "high",
  "use_case_category": "app deployment",
  "specific_use_case": "Look up all applications created by a specific account using the indexer with pagination support",
  "target_users": [
    "SDK developers",
    "Smart contract developers",
    "Application developers",
    "DevOps engineers"
  ],
  "features_tested": [
    "indexer.lookupAccountCreatedApplicationByAddress",
    "algorand.client.getAppFactory",
    "factory.send.bare.create"
  ],
  "feature_tags": [
    "indexer",
    "application-lookup",
    "pagination",
    "app-factory",
    "application-deployment",
    "creator-filtering"
  ],
  "folder": "139-look-up-applications-created-by-account",
  "prerequisites": {
    "tools": [
      "algokit",
      "node",
      "npm"
    ],
    "libraries": [
      "@algorandfoundation/algokit-utils",
      "algosdk"
    ],
    "environment": [
      {
        "name": "ALGOD_SERVER",
        "required": true,
        "example": "http://localhost"
      },
      {
        "name": "ALGOD_PORT",
        "required": true,
        "example": "4001"
      },
      {
        "name": "ALGOD_TOKEN",
        "required": true,
        "example": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      {
        "name": "INDEXER_SERVER",
        "required": true,
        "example": "http://localhost"
      },
      {
        "name": "INDEXER_PORT",
        "required": true,
        "example": "8980"
      },
      {
        "name": "INDEXER_TOKEN",
        "required": true,
        "example": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      },
      {
        "name": "CREATOR_ACCOUNT_MNEMONIC",
        "required": true,
        "example": "your 25 word mnemonic here..."
      },
      {
        "name": "SECOND_ACCOUNT_MNEMONIC",
        "required": true,
        "example": "another 25 word mnemonic here..."
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start LocalNet: algokit localnet start",
      "Ensure indexer is running and synced"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Creator and second account addresses displayed",
    "Three applications deployed with their IDs logged",
    "Indexer lookup returns only apps created by the creator account (not the second account)",
    "List of application IDs created by the specified account"
  ],
  "source_tests": [
    {
      "file": "src/indexer-lookup.spec.ts",
      "test_name": "Application create transactions are found by creator with pagination"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "contract.json",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "Users need to provide their own app spec JSON for the application they want to deploy"
    }
  ],
  "notes": "This example requires a LocalNet or TestNet environment with indexer enabled. The indexer has eventual consistency, so there's a delay between transaction confirmation and indexer availability. The pagination parameter allows control over how many results are returned per page.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport { lookupAccountCreatedApplicationByAddress } from '@algorandfoundation/algokit-utils/types/indexer-lookup'\nimport * as algokit from '@algorandfoundation/algokit-utils'\n\n/**\n * This example demonstrates how to look up all applications created by a specific account\n * using the Algorand indexer with pagination support.\n * \n * Use case: Discover and manage applications deployed by users or manage multi-app deployments.\n */\n\nasync function main() {\n  // Initialize the AlgorandClient for LocalNet\n  const algorand = AlgorandClient.testNet() // or AlgorandClient.mainNet() for production\n  \n  // Get the creator account (the account that will deploy apps)\n  const testAccount = await algorand.account.fromEnvironment('CREATOR_ACCOUNT')\n  \n  // Create a second account for comparison\n  const secondAccount = await algorand.account.fromEnvironment('SECOND_ACCOUNT')\n  \n  console.log('Creator account:', testAccount.addr)\n  console.log('Second account:', secondAccount.addr)\n  \n  // Load your application spec (replace with your actual app spec)\n  // For this example, assume you have a contract with deploy-time parameters\n  const appSpec = {\n    // Your app spec JSON here\n    // This would typically be loaded from a JSON file:\n    // const appSpec = JSON.parse(fs.readFileSync('path/to/app-spec.json', 'utf-8'))\n  }\n  \n  // Create an app factory with deploy-time parameters\n  const factory = algorand.client.getAppFactory({\n    appSpec: appSpec,\n    defaultSender: testAccount,\n    deletable: false,\n    updatable: false,\n    deployTimeParams: { VALUE: 1 },\n  })\n  \n  console.log('\\nDeploying applications...')\n  \n  // Deploy first application with default deploy-time parameters\n  const { result: app1 } = await factory.send.bare.create()\n  console.log('App 1 created with ID:', app1.appId)\n  \n  // Deploy second application with different deploy-time parameters\n  const { result: app2 } = await factory.send.bare.create({ \n    deployTimeParams: { VALUE: 2 } \n  })\n  console.log('App 2 created with ID:', app2.appId)\n  \n  // Deploy a third application from a different account (for comparison)\n  await factory.send.bare.create({ sender: secondAccount })\n  console.log('App 3 created from second account')\n  \n  // Wait for indexer to catch up (indexer has eventual consistency)\n  console.log('\\nWaiting for indexer to index the transactions...')\n  await new Promise(resolve => setTimeout(resolve, 3000))\n  \n  // Look up all applications created by the test account with pagination\n  console.log('\\nLooking up applications created by:', testAccount.addr)\n  const apps = await lookupAccountCreatedApplicationByAddress(\n    algorand.client.indexer,\n    testAccount.addr,\n    true, // includeAll: include deleted apps\n    1     // paginationLimit: number of results per page\n  )\n  \n  // Display the results\n  console.log('\\nApplications created by test account:')\n  const appIds = apps.map((a) => BigInt(a.id)).sort()\n  appIds.forEach((id) => {\n    console.log(`  - App ID: ${id}`)\n  })\n  \n  console.log('\\nExpected app IDs:', [app1.appId, app2.appId].sort())\n  console.log('Retrieved app IDs:', appIds)\n  console.log('\\nNote: The third app created by secondAccount should not appear in this list.')\n}\n\nmain().catch(console.error)"
}
```
