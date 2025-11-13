# Rekey Account During Application Opt-In

Demonstrates how to rekey an account during an application opt-in operation and use the rekeyed account for subsequent transactions.

## Example Details

```json
{
  "example_id": "123-rekey-account-during-application-opt-in",
  "title": "Rekey Account During Application Opt-In",
  "summary": "Demonstrates how to rekey an account during an application opt-in operation and use the rekeyed account for subsequent transactions.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "medium",
  "use_case_category": "account management",
  "specific_use_case": "Rekey an account during an application opt-in operation",
  "target_users": [
    "SDK developers",
    "Security engineers"
  ],
  "features_tested": [
    "client.optIn",
    "rekeyTo parameter",
    "algorand.account.rekeyed",
    "rekeyed account transactions"
  ],
  "feature_tags": [
    "account-rekeying",
    "app-client",
    "opt-in",
    "security",
    "account-management",
    "rekeyed-transactions"
  ],
  "folder": "123-rekey-account-during-application-opt-in",
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
        "name": "ALGOD_TOKEN",
        "required": false,
        "example": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
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
      "Start LocalNet: algokit localnet start"
    ],
    "install": [
      "npm install"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Original and rekey target addresses displayed",
    "Application created successfully",
    "Opt-in successful and account rekeyed",
    "Payment transaction successful with transaction ID",
    "Confirmation that the account has been rekeyed"
  ],
  "source_tests": [
    {
      "file": "src/types/app-client.spec.ts",
      "test_name": "Call app with rekey"
    }
  ],
  "artifacts_plan": [
    {
      "target_file": "app-spec.ts",
      "type": "contract",
      "action": "generate",
      "source_path": null,
      "note": "App specification with opt_in method that supports rekeying"
    }
  ],
  "notes": "Demonstrates advanced security pattern of rekeying accounts. The rekeyed account maintains the original address but requires the new key for signing. This is useful for key rotation, multi-sig setups, and other security patterns.",
  "generated_code": "import * as algokit from '@algorandfoundation/algokit-utils'\nimport algosdk from 'algosdk'\nimport { appSpec } from './app-spec' // Import your app specification\n\n/**\n * This example demonstrates how to rekey an account during an application opt-in.\n * Rekeying allows you to change the spending authority of an account to a different key,\n * which is useful for security patterns like key rotation and multi-sig setups.\n */\n\nasync function rekeyAccountDuringOptIn() {\n  // Initialize AlgoKit and get localnet context\n  const localnet = algokit.Config.getConfigFromEnvOrDefaults()\n  const algod = algokit.getAlgoClient({\n    server: localnet.algodServer,\n    token: localnet.algodToken,\n    port: localnet.algodPort,\n  })\n  \n  // Get an algorand client for easier account and transaction management\n  const algorand = algokit.AlgorandClient.fromClients({ algod })\n  \n  // Get a test account with funds\n  const testAccount = await algokit.getDispenserAccount(algod)\n  \n  // Create a random account to rekey to\n  const rekeyTo = algorand.account.random()\n  \n  console.log('Original account address:', testAccount.addr)\n  console.log('Rekey target address:', rekeyTo.addr)\n  \n  // Create an app client\n  const client = algokit.getAppClient(\n    {\n      resolveBy: 'id',\n      app: appSpec,\n      sender: testAccount,\n      id: 0,\n    },\n    algod,\n  )\n  \n  // Create the application\n  console.log('\\nCreating application...')\n  await client.create({\n    deployTimeParams: {\n      UPDATABLE: 0,\n      DELETABLE: 0,\n      VALUE: 1,\n    },\n  })\n  console.log('Application created successfully')\n  \n  // Opt-in to the application and rekey the account in the same transaction\n  console.log('\\nOpting in to application and rekeying account...')\n  await client.optIn({\n    method: 'opt_in',\n    methodArgs: [],\n    rekeyTo, // This parameter rekeys the account to the new address\n  })\n  console.log('Opt-in successful and account rekeyed')\n  \n  // Create a rekeyed account object that can be used for transactions\n  // This combines the original address with the new signing authority\n  const rekeyedAccount = algorand.account.rekeyed(testAccount, rekeyTo)\n  \n  console.log('\\nTesting rekeyed account by sending a payment...')\n  \n  // Send a payment using the rekeyed account\n  // The transaction is sent from testAccount.addr but signed with rekeyTo's key\n  const txn = await algorand.send.payment({\n    amount: algokit.microAlgos(0), // 0 ALGO payment for testing\n    sender: rekeyedAccount,\n    receiver: testAccount.addr,\n  })\n  \n  console.log('Payment transaction successful!')\n  console.log('Transaction ID:', txn.txId)\n  console.log('\\nThe account has been successfully rekeyed.')\n  console.log('Future transactions from', testAccount.addr, 'must be signed by', rekeyTo.addr)\n}\n\n// Run the example\nrekeyAccountDuringOptIn().catch(console.error)"
}
```
