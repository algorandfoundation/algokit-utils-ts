import { AlgorandClient, microAlgos, searchTransactions } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to search for transactions using the Algorand indexer
 * with filters and pagination.
 *
 * The indexer is a powerful tool for querying historical blockchain data. It allows you to:
 * - Search transactions by type (payment, app call, asset transfer, etc.)
 * - Filter by addresses and their roles (sender, receiver)
 * - Paginate through large result sets
 * - Query specific time ranges and rounds
 *
 * This example shows:
 * 1. Sending multiple payment transactions from different accounts
 * 2. Waiting for the indexer to index the transactions
 * 3. Searching for transactions with specific filters
 * 4. Using pagination to retrieve results efficiently
 */

async function main() {
  console.log('=== Search Transactions with Filters and Pagination ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get dispenser account for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create test accounts
  const testAccount = await algorand.account.random()
  const secondAccount = await algorand.account.random()
  const receiver = await algorand.account.random()

  console.log('Setting up test accounts...')
  console.log('   Test Account 1 (main sender):', testAccount.addr.toString())
  console.log('   Test Account 2 (secondary sender):', secondAccount.addr.toString())
  console.log('   Receiver Account:', receiver.addr.toString())
  console.log()

  // Fund all test accounts (including receiver to meet minimum balance)
  console.log('Funding test accounts...')
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: testAccount.addr,
    amount: microAlgos(10_000_000), // 10 ALGO
  })

  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: secondAccount.addr,
    amount: microAlgos(10_000_000), // 10 ALGO
  })

  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: receiver.addr,
    amount: microAlgos(1_000_000), // 1 ALGO (to meet minimum balance)
  })

  console.log('   ✅ Accounts funded successfully')
  console.log()

  // Send multiple test transactions
  console.log('Sending test transactions...')

  // Transaction 1: 100,000 microAlgos (0.1 ALGO) from testAccount
  const result1 = await algorand.send.payment({
    sender: testAccount.addr,
    receiver: receiver.addr,
    amount: microAlgos(100_000),
  })
  const txId1 = result1.txIds[0]!
  console.log('   Transaction 1:', txId1)
  console.log('      From: testAccount')
  console.log('      Amount: 100,000 microAlgos')

  // Transaction 2: 200,000 microAlgos (0.2 ALGO) from testAccount
  const result2 = await algorand.send.payment({
    sender: testAccount.addr,
    receiver: receiver.addr,
    amount: microAlgos(200_000),
  })
  const txId2 = result2.txIds[0]!
  console.log('   Transaction 2:', txId2)
  console.log('      From: testAccount')
  console.log('      Amount: 200,000 microAlgos')

  // Transaction 3: 300,000 microAlgos (0.3 ALGO) from secondAccount (should be filtered out)
  const result3 = await algorand.send.payment({
    sender: secondAccount.addr,
    receiver: receiver.addr,
    amount: microAlgos(300_000),
  })
  const txId3 = result3.txIds[0]!
  console.log('   Transaction 3:', txId3)
  console.log('      From: secondAccount')
  console.log('      Amount: 300,000 microAlgos')
  console.log()

  console.log('=== Understanding Indexer Queries ===\n')

  console.log('The indexer is a separate service that:')
  console.log('  • Indexes all blockchain data for efficient searching')
  console.log('  • Provides REST API for querying historical data')
  console.log('  • Supports complex filters and pagination')
  console.log('  • May lag behind the current blockchain state')
  console.log()

  console.log('Common use cases:')
  console.log('  • Find all transactions for an account')
  console.log('  • Search for specific transaction types')
  console.log('  • Filter by date/time ranges')
  console.log('  • Track asset transfers')
  console.log('  • Audit application calls')
  console.log()

  console.log('=== Searching for Transactions ===\n')

  // Search for transactions with filters:
  // - Type: payment transactions only
  // - Address role: sender
  // - Address: testAccount (filter out secondAccount transactions)
  console.log('Search criteria:')
  console.log('   Transaction type: payment')
  console.log('   Address role: sender')
  console.log('   Address:', testAccount.addr.toString())
  console.log('   Limit: 10 results per page')
  console.log()

  console.log('Waiting for indexer to catch up and index transactions...')

  // Wait for indexer with retry logic
  let searchResults = await searchTransactions(
    algorand.client.indexer,
    (s) =>
      s
        .txType('pay') // Filter by transaction type: payment
        .addressRole('sender') // Filter by address role: sender
        .address(testAccount.addr), // Filter by specific sender address
    10 // Page size/limit
  )

  let attempts = 1
  const maxAttempts = 10

  while (attempts < maxAttempts && searchResults.transactions.length < 2) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`   Attempt ${attempts}: Found ${searchResults.transactions.length} transactions, retrying...`)

    searchResults = await searchTransactions(
      algorand.client.indexer,
      (s) =>
        s
          .txType('pay') // Filter by transaction type: payment
          .addressRole('sender') // Filter by address role: sender
          .address(testAccount.addr), // Filter by specific sender address
      10 // Page size/limit
    )

    attempts++
  }

  if (searchResults.transactions.length >= 2) {
    console.log(`   ✅ Found ${searchResults.transactions.length} transactions after ${attempts} attempt(s)`)
  } else {
    console.log(`   ⚠️  Only found ${searchResults.transactions.length} transactions after ${attempts} attempts`)
    console.log('   Note: Indexer may need more time on LocalNet')
  }
  console.log()

  console.log()
  console.log('=== Search Results ===\n')
  console.log('Indexer State:')
  console.log('   Current Round:', searchResults.currentRound)
  console.log('   Transactions Found:', searchResults.transactions.length)
  console.log()

  if (searchResults.transactions.length > 0) {
    console.log('Transaction Details:')
    searchResults.transactions.forEach((txn, index) => {
      console.log(`\n   Transaction ${index + 1}:`)
      console.log(`      ID: ${txn.id}`)
      console.log(`      Sender: ${txn.sender}`)
      console.log(`      Receiver: ${txn.paymentTransaction?.receiver}`)
      console.log(`      Amount: ${txn.paymentTransaction?.amount} microAlgos`)
      console.log(`      Round: ${txn.confirmedRound}`)
      console.log(`      Type: ${txn.txType}`)
    })
  } else {
    console.log('   No transactions found')
  }
  console.log()

  // Verify that we found the correct transactions
  const foundTxIds = searchResults.transactions.map((t) => t.id!).sort()
  const expectedTxIds = [txId1, txId2].sort()

  console.log('=== Verification ===\n')
  console.log('Expected Transactions:')
  console.log('   Transaction 1:', txId1, '(from testAccount)')
  console.log('   Transaction 2:', txId2, '(from testAccount)')
  console.log()

  console.log('Found Transactions:')
  foundTxIds.forEach((id, index) => {
    console.log(`   Transaction ${index + 1}: ${id}`)
  })
  console.log()

  console.log('Excluded Transactions:')
  console.log('   Transaction 3:', txId3, '(from secondAccount - filtered out)')
  console.log()

  const allFound = expectedTxIds.every((id) => foundTxIds.includes(id))
  const noExtras = foundTxIds.every((id) => expectedTxIds.includes(id))

  if (allFound && noExtras) {
    console.log('Results:')
    console.log('   ✅ Search filters working correctly!')
    console.log('   ✅ Found exactly the transactions from testAccount')
    console.log('   ✅ Filtered out transactions from secondAccount')
  } else {
    console.log('Results:')
    console.log('   ⚠️  Search results do not match expected transactions')
    if (!allFound) {
      console.log('   Missing expected transactions')
    }
    if (!noExtras) {
      console.log('   Found unexpected transactions')
    }
  }
  console.log()

  console.log('=== Understanding Filters ===\n')

  console.log('1. Transaction Type Filter (txType)')
  console.log('   • Filters by transaction type')
  console.log('   • Options: "pay", "keyreg", "acfg", "axfer", "afrz", "appl"')
  console.log('   • Example: .txType("pay") returns only payment transactions')
  console.log()

  console.log('2. Address Role Filter (addressRole)')
  console.log('   • Specifies how the address is involved in the transaction')
  console.log('   • Options: "sender", "receiver", "freeze-target"')
  console.log('   • Example: .addressRole("sender") filters by sender address')
  console.log()

  console.log('3. Address Filter (address)')
  console.log('   • Filters transactions involving a specific address')
  console.log('   • Combined with addressRole to specify the role')
  console.log('   • Example: .address("ABC...") returns txns with that address')
  console.log()

  console.log('4. Limit/Pagination')
  console.log('   • Controls how many results are returned per page')
  console.log('   • Default: 100 transactions')
  console.log('   • Use nextToken from results to get next page')
  console.log()

  console.log('=== Advanced Filter Examples ===\n')

  console.log('Example 1: All transactions for an account')
  console.log('   searchTransactions(indexer, (s) => s.address(accountAddr))')
  console.log()

  console.log('Example 2: Payments sent by an account')
  console.log('   searchTransactions(indexer, (s) => s')
  console.log('     .txType("pay")')
  console.log('     .addressRole("sender")')
  console.log('     .address(accountAddr)')
  console.log('   )')
  console.log()

  console.log('Example 3: Payments received by an account')
  console.log('   searchTransactions(indexer, (s) => s')
  console.log('     .txType("pay")')
  console.log('     .addressRole("receiver")')
  console.log('     .address(accountAddr)')
  console.log('   )')
  console.log()

  console.log('Example 4: Application calls')
  console.log('   searchTransactions(indexer, (s) => s')
  console.log('     .txType("appl")')
  console.log('     .applicationID(appId)')
  console.log('   )')
  console.log()

  console.log('Example 5: Round range query')
  console.log('   searchTransactions(indexer, (s) => s')
  console.log('     .minRound(1000)')
  console.log('     .maxRound(2000)')
  console.log('   )')
  console.log()

  console.log('=== Pagination Strategy ===\n')

  console.log('For large result sets, use pagination:')
  console.log()
  console.log('```typescript')
  console.log('let nextToken: string | undefined = undefined')
  console.log('const allTransactions = []')
  console.log()
  console.log('do {')
  console.log('  const results = await searchTransactions(')
  console.log('    indexer,')
  console.log('    (s) => {')
  console.log('      let query = s.address(accountAddr)')
  console.log('      if (nextToken) {')
  console.log('        query = query.nextToken(nextToken)')
  console.log('      }')
  console.log('      return query')
  console.log('    },')
  console.log('    100  // Page size')
  console.log('  )')
  console.log()
  console.log('  allTransactions.push(...results.transactions)')
  console.log('  nextToken = results.nextToken')
  console.log('} while (nextToken)')
  console.log('```')
  console.log()

  console.log('=== Best Practices ===\n')

  console.log('1. Wait for Indexer to Catch Up')
  console.log('   • Indexer may lag behind the current round')
  console.log('   • Add delay after sending transactions before querying')
  console.log('   • Check currentRound in results to verify indexer state')
  console.log()

  console.log('2. Use Specific Filters')
  console.log('   • Narrow down results with multiple filters')
  console.log('   • Reduces data transfer and improves performance')
  console.log('   • Example: Combine txType, address, and round range')
  console.log()

  console.log('3. Implement Pagination')
  console.log('   • Don\'t try to load all results at once')
  console.log('   • Use reasonable page sizes (50-100)')
  console.log('   • Store nextToken for subsequent pages')
  console.log()

  console.log('4. Handle Indexer Unavailability')
  console.log('   • Indexer may not be available on all networks')
  console.log('   • LocalNet may have limited indexer functionality')
  console.log('   • Always wrap indexer calls in try/catch')
  console.log()

  console.log('5. Optimize Round Ranges')
  console.log('   • Limit round ranges to reduce search scope')
  console.log('   • Use minRound and maxRound filters')
  console.log('   • Smaller ranges = faster queries')
  console.log()

  console.log('=== Common Use Cases ===\n')

  console.log('1. Account Transaction History')
  console.log('   • Display all transactions for a user account')
  console.log('   • Show sent and received payments separately')
  console.log('   • Calculate account balance over time')
  console.log()

  console.log('2. Payment Tracking')
  console.log('   • Monitor incoming payments to a merchant')
  console.log('   • Verify payment amounts and senders')
  console.log('   • Track payment confirmations')
  console.log()

  console.log('3. Application Analytics')
  console.log('   • Count application calls over time')
  console.log('   • Analyze user interaction patterns')
  console.log('   • Track application state changes')
  console.log()

  console.log('4. Asset Transfer Monitoring')
  console.log('   • Track ASA transfers for a specific asset')
  console.log('   • Monitor token distribution')
  console.log('   • Audit asset holder changes')
  console.log()

  console.log('5. Compliance and Auditing')
  console.log('   • Generate transaction reports')
  console.log('   • Verify transaction compliance')
  console.log('   • Track fund flows for regulatory purposes')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
