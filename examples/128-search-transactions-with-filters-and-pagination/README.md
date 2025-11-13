# Search Transactions with Filters and Pagination

Demonstrates how to search for transactions using the Algorand Indexer with filters (transaction type, address role) and pagination support.

## Example Details

```json
{
  "example_id": "128-search-transactions-with-filters-and-pagination",
  "title": "Search Transactions with Filters and Pagination",
  "summary": "Demonstrates how to search for transactions using the Algorand Indexer with filters (transaction type, address role) and pagination support.",
  "language": "typescript",
  "complexity": "moderate",
  "example_potential": "high",
  "use_case_category": "transaction management",
  "specific_use_case": "Search for transactions with specific criteria (payment transactions from a specific sender) using pagination",
  "target_users": [
    "SDK developers",
    "Application developers",
    "Transaction monitoring systems",
    "Analytics platforms"
  ],
  "features_tested": [
    "indexer.searchTransactions",
    "transaction filtering",
    "pagination",
    "filtering by transaction type",
    "filtering by address role"
  ],
  "feature_tags": [
    "indexer",
    "transaction-search",
    "pagination",
    "filtering",
    "payment-transaction",
    "address-role",
    "localnet"
  ],
  "folder": "128-search-transactions-with-filters-and-pagination",
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
      },
      {
        "name": "INDEXER_TOKEN",
        "required": false,
        "example": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
      }
    ]
  },
  "run_instructions": {
    "setup": [
      "Start LocalNet: algokit localnet start"
    ],
    "install": [
      "npm install @algorandfoundation/algokit-utils algosdk"
    ],
    "execute": [
      "npx tsx main.ts"
    ]
  },
  "expected_output": [
    "Transaction 1 sent: <tx_id> (1 microAlgo from testAccount)",
    "Transaction 2 sent: <tx_id> (2 microAlgos from testAccount)",
    "Transaction 3 sent: <tx_id> (1 microAlgo from secondAccount)",
    "Total Transactions Found: 2",
    "Search filters working correctly!",
    "Found exactly the transactions from testAccount",
    "Filtered out transactions from secondAccount"
  ],
  "source_tests": [
    {
      "file": "src/indexer-lookup.spec.ts",
      "test_name": "Transactions are searched with pagination"
    }
  ],
  "artifacts_plan": [],
  "notes": "This example showcases the power of the Algorand Indexer for filtering and searching transactions. The search capability supports multiple filters including transaction type, address role (sender/receiver), specific addresses, and pagination for handling large result sets. This is essential for building transaction monitoring systems, analytics platforms, and wallet applications.",
  "generated_code": "import { AlgorandClient } from '@algorandfoundation/algokit-utils'\nimport algosdk from 'algosdk'\nimport { searchTransactions } from '@algorandfoundation/algokit-utils/types/indexer'\n\n/**\n * Example: Search Transactions with Filters and Pagination\n * \n * This example demonstrates how to:\n * 1. Send multiple payment transactions from different accounts\n * 2. Wait for the indexer to index the transactions\n * 3. Search for transactions with specific filters:\n *    - Transaction type (payment)\n *    - Address role (sender)\n *    - Specific sender address\n * 4. Use pagination to retrieve results\n */\n\nasync function searchTransactionsWithFilters() {\n  // Initialize AlgorandClient for LocalNet\n  const algorand = AlgorandClient.defaultLocalNet()\n  \n  // Get dispenser account for funding\n  const dispenser = await algorand.account.dispenser()\n  \n  // Create test accounts\n  const testAccount = await algorand.account.random()\n  const secondAccount = await algorand.account.random()\n  const receiver = await algorand.account.random()\n  \n  console.log('Setting up test accounts...')\n  console.log(`Test Account 1 (main sender): ${testAccount.addr}`)\n  console.log(`Test Account 2 (secondary sender): ${secondAccount.addr}`)\n  console.log(`Receiver Account: ${receiver.addr}`)\n  \n  // Fund both sender accounts\n  console.log('\\nFunding test accounts...')\n  await algorand.send.payment({\n    sender: dispenser.addr,\n    receiver: testAccount.addr,\n    amount: algosdk.algosToMicroalgos(10),\n  })\n  \n  await algorand.send.payment({\n    sender: dispenser.addr,\n    receiver: secondAccount.addr,\n    amount: algosdk.algosToMicroalgos(10),\n  })\n  \n  console.log('Accounts funded successfully')\n  \n  // Send multiple test transactions\n  console.log('\\nSending test transactions...')\n  \n  // Transaction 1: 1 microAlgo from testAccount\n  const result1 = await algorand.send.payment({\n    sender: testAccount.addr,\n    receiver: receiver.addr,\n    amount: 1n,\n    signer: testAccount,\n  })\n  const txId1 = result1.transaction.txID()\n  console.log(`Transaction 1 sent: ${txId1} (1 microAlgo from testAccount)`)\n  \n  // Transaction 2: 2 microAlgos from testAccount\n  const result2 = await algorand.send.payment({\n    sender: testAccount.addr,\n    receiver: receiver.addr,\n    amount: 2n,\n    signer: testAccount,\n  })\n  const txId2 = result2.transaction.txID()\n  console.log(`Transaction 2 sent: ${txId2} (2 microAlgos from testAccount)`)\n  \n  // Transaction 3: 1 microAlgo from secondAccount (this should be filtered out)\n  const result3 = await algorand.send.payment({\n    sender: secondAccount.addr,\n    receiver: receiver.addr,\n    amount: 1n,\n    signer: secondAccount,\n  })\n  const txId3 = result3.transaction.txID()\n  console.log(`Transaction 3 sent: ${txId3} (1 microAlgo from secondAccount)`)\n  \n  // Wait for indexer to catch up and index all transactions\n  console.log('\\nWaiting for indexer to index transactions...')\n  await new Promise(resolve => setTimeout(resolve, 3000))\n  \n  // Search for transactions with filters:\n  // - Type: payment transactions only\n  // - Address role: sender\n  // - Address: testAccount (filter out secondAccount transactions)\n  console.log('\\nSearching for payment transactions from testAccount...')\n  \n  const searchResults = await searchTransactions(\n    algorand.client.indexer,\n    (s) => s\n      .txType('pay')  // Filter by transaction type: payment\n      .addressRole('sender')  // Filter by address role: sender\n      .address(testAccount.addr),  // Filter by specific sender address\n    1  // Page size/limit\n  )\n  \n  // Display search results\n  console.log('\\n=== Search Results ===')\n  console.log(`Current Round: ${searchResults.currentRound}`)\n  console.log(`Total Transactions Found: ${searchResults.transactions.length}`)\n  \n  console.log('\\nTransaction Details:')\n  searchResults.transactions.forEach((txn, index) => {\n    console.log(`\\n  Transaction ${index + 1}:`)\n    console.log(`    ID: ${txn.id}`)\n    console.log(`    Sender: ${txn.sender}`)\n    console.log(`    Receiver: ${txn['payment-transaction']?.receiver}`)\n    console.log(`    Amount: ${txn['payment-transaction']?.amount} microAlgos`)\n    console.log(`    Round: ${txn['confirmed-round']}`)\n    console.log(`    Type: ${txn['tx-type']}`)\n  })\n  \n  // Verify that we found the correct transactions\n  const foundTxIds = searchResults.transactions.map(t => t.id).sort()\n  const expectedTxIds = [txId1, txId2].sort()\n  \n  console.log('\\n=== Verification ===')\n  console.log(`Expected transaction IDs: ${expectedTxIds.join(', ')}`)\n  console.log(`Found transaction IDs: ${foundTxIds.join(', ')}`)\n  \n  const allFound = expectedTxIds.every(id => foundTxIds.includes(id))\n  const noExtras = foundTxIds.every(id => expectedTxIds.includes(id))\n  \n  if (allFound && noExtras) {\n    console.log('\\n✓ Search filters working correctly!')\n    console.log('✓ Found exactly the transactions from testAccount')\n    console.log('✓ Filtered out transactions from secondAccount')\n  } else {\n    console.log('\\n✗ Search results do not match expected transactions')\n  }\n}\n\n// Run the example\nsearchTransactionsWithFilters().catch(console.error)"
}
```
