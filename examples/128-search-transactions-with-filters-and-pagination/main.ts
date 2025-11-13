import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'
import { searchTransactions } from '@algorandfoundation/algokit-utils/types/indexer'

/**
 * Example: Search Transactions with Filters and Pagination
 * 
 * This example demonstrates how to:
 * 1. Send multiple payment transactions from different accounts
 * 2. Wait for the indexer to index the transactions
 * 3. Search for transactions with specific filters:
 *    - Transaction type (payment)
 *    - Address role (sender)
 *    - Specific sender address
 * 4. Use pagination to retrieve results
 */

async function searchTransactionsWithFilters() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get dispenser account for funding
  const dispenser = await algorand.account.dispenser()
  
  // Create test accounts
  const testAccount = await algorand.account.random()
  const secondAccount = await algorand.account.random()
  const receiver = await algorand.account.random()
  
  console.log('Setting up test accounts...')
  console.log(`Test Account 1 (main sender): ${testAccount.addr}`)
  console.log(`Test Account 2 (secondary sender): ${secondAccount.addr}`)
  console.log(`Receiver Account: ${receiver.addr}`)
  
  // Fund both sender accounts
  console.log('\nFunding test accounts...')
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: testAccount.addr,
    amount: algosdk.algosToMicroalgos(10),
  })
  
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: secondAccount.addr,
    amount: algosdk.algosToMicroalgos(10),
  })
  
  console.log('Accounts funded successfully')
  
  // Send multiple test transactions
  console.log('\nSending test transactions...')
  
  // Transaction 1: 1 microAlgo from testAccount
  const result1 = await algorand.send.payment({
    sender: testAccount.addr,
    receiver: receiver.addr,
    amount: 1n,
    signer: testAccount,
  })
  const txId1 = result1.transaction.txID()
  console.log(`Transaction 1 sent: ${txId1} (1 microAlgo from testAccount)`)
  
  // Transaction 2: 2 microAlgos from testAccount
  const result2 = await algorand.send.payment({
    sender: testAccount.addr,
    receiver: receiver.addr,
    amount: 2n,
    signer: testAccount,
  })
  const txId2 = result2.transaction.txID()
  console.log(`Transaction 2 sent: ${txId2} (2 microAlgos from testAccount)`)
  
  // Transaction 3: 1 microAlgo from secondAccount (this should be filtered out)
  const result3 = await algorand.send.payment({
    sender: secondAccount.addr,
    receiver: receiver.addr,
    amount: 1n,
    signer: secondAccount,
  })
  const txId3 = result3.transaction.txID()
  console.log(`Transaction 3 sent: ${txId3} (1 microAlgo from secondAccount)`)
  
  // Wait for indexer to catch up and index all transactions
  console.log('\nWaiting for indexer to index transactions...')
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // Search for transactions with filters:
  // - Type: payment transactions only
  // - Address role: sender
  // - Address: testAccount (filter out secondAccount transactions)
  console.log('\nSearching for payment transactions from testAccount...')
  
  const searchResults = await searchTransactions(
    algorand.client.indexer,
    (s) => s
      .txType('pay')  // Filter by transaction type: payment
      .addressRole('sender')  // Filter by address role: sender
      .address(testAccount.addr),  // Filter by specific sender address
    1  // Page size/limit
  )
  
  // Display search results
  console.log('\n=== Search Results ===')
  console.log(`Current Round: ${searchResults.currentRound}`)
  console.log(`Total Transactions Found: ${searchResults.transactions.length}`)
  
  console.log('\nTransaction Details:')
  searchResults.transactions.forEach((txn, index) => {
    console.log(`\n  Transaction ${index + 1}:`)
    console.log(`    ID: ${txn.id}`)
    console.log(`    Sender: ${txn.sender}`)
    console.log(`    Receiver: ${txn['payment-transaction']?.receiver}`)
    console.log(`    Amount: ${txn['payment-transaction']?.amount} microAlgos`)
    console.log(`    Round: ${txn['confirmed-round']}`)
    console.log(`    Type: ${txn['tx-type']}`)
  })
  
  // Verify that we found the correct transactions
  const foundTxIds = searchResults.transactions.map(t => t.id).sort()
  const expectedTxIds = [txId1, txId2].sort()
  
  console.log('\n=== Verification ===')
  console.log(`Expected transaction IDs: ${expectedTxIds.join(', ')}`)
  console.log(`Found transaction IDs: ${foundTxIds.join(', ')}`)
  
  const allFound = expectedTxIds.every(id => foundTxIds.includes(id))
  const noExtras = foundTxIds.every(id => expectedTxIds.includes(id))
  
  if (allFound && noExtras) {
    console.log('\n✓ Search filters working correctly!')
    console.log('✓ Found exactly the transactions from testAccount')
    console.log('✓ Filtered out transactions from secondAccount')
  } else {
    console.log('\n✗ Search results do not match expected transactions')
  }
}

// Run the example
searchTransactionsWithFilters().catch(console.error)