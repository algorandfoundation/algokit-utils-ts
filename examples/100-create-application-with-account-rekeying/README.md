# Create Application with Account Rekeying

Demonstrates how to create an application while simultaneously rekeying the sender account, and how to use the rekeyed account for subsequent transactions

## Example Details

```json
{
  "example_id": "100-create-application-with-account-rekeying",
  "title": "Create Application with Account Rekeying",
  "summary": "Demonstrates how to create an application while simultaneously rekeying the sender account, and how to use the rekeyed account for subsequent transactions",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "account management",
  "specific_use_case": "Create an application while simultaneously rekeying the sender account to a different authority",
  "target_users": [
    "Smart contract developers",
    "SDK developers",
    "Security-focused developers",
    "Algorand developers"
  ],
  "features_tested": [
    "algorand.send.appCreate",
    "algorand.account.random",
    "algorand.account.rekeyed",
    "algorand.send.payment"
  ],
  "feature_tags": [
    "account-rekeying",
    "app-creation",
    "security",
    "authorization-delegation",
    "rekeyed-account",
    "smart-contracts"
  ],
  "folder": "100-create-application-with-account-rekeying",
  "prerequisites": {
    "tools": [
      "algokit",
      "docker",
      "node",
      "npm"
    ],
    "libraries": [
      "@algorandfoundation/algokit-utils",
      "algosdk"
    ],
    "environment": []
  },
  "run_instructions": {
    "setup": [
      "algokit localnet start"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Original account address displayed",
    "New authority address displayed",
    "Application created successfully",
    "Account rekeyed confirmation",
    "Rekeyed account object created",
    "Payment transaction from rekeyed account succeeds",
    "Explanation of how the rekey works"
  ],
  "source_tests": [
    {
      "file": "src/app.spec.ts",
      "test_name": "appCreate with rekey performs rekey"
    }
  ],
  "artifacts_plan": [],
  "notes": "Account rekeying is a powerful security feature. Be careful when using it, as the original private key will no longer be able to authorize transactions. Always ensure you have access to the new authority's private key before rekeying.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\n\n/**\n * This example demonstrates account rekeying during application creation.\n * \n * Account rekeying allows you to delegate signing authority from one account\n * to another. This is useful for:\n * - Security: Rotating keys without changing the account address\n * - Multisig: Delegating authority to a multisig account\n * - Smart contracts: Allowing a contract to control an account\n * \n * This example shows:\n * 1. Creating an application with a rekey operation\n * 2. Using the rekeyed account for subsequent transactions\n */\n\nasync function createAppWithRekey() {\n  // Initialize the Algorand client for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n\n  // Get a funded test account from the LocalNet dispenser\n  const originalAccount = await algorand.account.localNet.dispenser()\n  console.log('Original account address:', originalAccount.addr)\n\n  // Create a new random account that will become the signing authority\n  const newAuthority = algorand.account.random()\n  console.log('New authority address:', newAuthority.addr)\n  console.log('\\nℹ️  After rekeying, transactions from', originalAccount.addr)\n  console.log('   must be signed by', newAuthority.addr)\n\n  // For this example, we'll use simple TEAL programs\n  const approvalProgram = `\n#pragma version 8\nint 1\nreturn\n  `\n\n  const clearStateProgram = `\n#pragma version 8\nint 1\nreturn\n  `\n\n  // Compile the programs\n  const approvalCompiled = await algorand.app.compileTeal(approvalProgram)\n  const clearCompiled = await algorand.app.compileTeal(clearStateProgram)\n\n  // Define the state schema\n  const schema = {\n    globalUints: 1,\n    globalByteSlices: 1,\n    localUints: 0,\n    localByteSlices: 0,\n  }\n\n  console.log('\\nCreating application and rekeying account...')\n\n  // Create the application with a rekey operation\n  // The rekeyTo parameter delegates signing authority to the new account\n  const app = await algorand.send.appCreate({\n    approvalProgram: approvalCompiled,\n    clearStateProgram: clearCompiled,\n    schema: schema,\n    sender: originalAccount,\n    rekeyTo: newAuthority, // This is the key parameter for rekeying\n  })\n\n  console.log('\\n✅ Application created and account rekeyed!')\n  console.log('App ID:', app.appId.toString())\n  console.log('Transaction ID:', app.txIds[0])\n\n  // Now the originalAccount is rekeyed to newAuthority\n  // To use the original account, we need to create a rekeyed account object\n  console.log('\\nTesting rekeyed account...')\n  const rekeyedAccount = algorand.account.rekeyed(originalAccount, newAuthority)\n  console.log('Rekeyed account created - it uses:')\n  console.log('  - Address:', originalAccount.addr, '(for sender/from)')\n  console.log('  - Signing key:', newAuthority.addr, '(for authorization)')\n\n  // Send a payment transaction using the rekeyed account\n  // This transaction is FROM the original account address\n  // but SIGNED by the new authority\n  console.log('\\nSending transaction from rekeyed account...')\n  const payment = await algorand.send.payment({\n    amount: (0).algo(), // Zero-amount payment for demonstration\n    sender: rekeyedAccount,\n    receiver: originalAccount.addr,\n  })\n\n  console.log('\\n✅ Payment transaction successful!')\n  console.log('Transaction ID:', payment.txIds[0])\n  console.log('\\n✓ This proves the rekey worked - the transaction was:')\n  console.log('  - Sent FROM:', originalAccount.addr)\n  console.log('  - Signed BY:', newAuthority.addr)\n\n  console.log('\\n⚠️  Important: From now on, all transactions from', originalAccount.addr)\n  console.log('   must be signed using', newAuthority.addr)\n  console.log('   The original signing key can no longer authorize transactions.')\n}\n\n// Run the example\ncreateAppWithRekey()\n  .then(() => console.log('\\nExample completed successfully'))\n  .catch((error) => {\n    console.error('Error:', error.message)\n    process.exit(1)\n  })"
}
```
