import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * Example: Look Up Account Information Using Indexer
 *
 * This example demonstrates how to:
 * 1. Create and fund a test account
 * 2. Wait for the indexer to synchronize with the blockchain
 * 3. Look up account information by address using the indexer
 * 4. Display account details
 */

/**
 * Helper function to wait for indexer to catch up
 * Repeatedly attempts to fetch account info until successful
 */
async function waitForIndexerSync(
  indexer: algosdk.Indexer,
  address: string,
  maxAttempts: number = 20
): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await indexer.lookupAccountByID(address).do()
      console.log('✓ Indexer has caught up!')
      return
    } catch (error) {
      console.log(`   Waiting for indexer to sync... (attempt ${i + 1}/${maxAttempts})`)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  throw new Error('Indexer did not catch up in time')
}

async function lookupAccountByAddress() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get dispenser account for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a new test account
  const testAccount = await algorand.account.random()
  console.log(`Created test account: ${testAccount.addr}`)

  // Fund the test account from dispenser
  console.log('\nFunding test account...')
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: testAccount.addr,
    amount: algo(5),
  })
  console.log(`Funded account with 5 ALGO`)

  // Wait for indexer to catch up with the blockchain
  console.log('\nWaiting for indexer to synchronize...')
  await waitForIndexerSync(algorand.client.indexer, testAccount.addr.toString())

  // Look up the account information using the indexer
  console.log('\nLooking up account information...')
  const accountInfo = await algorand.client.indexer.lookupAccountByID(testAccount.addr.toString()).do()

  // Display account information
  console.log('\n=== Account Information ===')
  console.log(`Address: ${accountInfo.account.address}`)
  console.log(`Balance: ${accountInfo.account.amount} microAlgos (${algosdk.microalgosToAlgos(Number(accountInfo.account.amount))} ALGO)`)
  console.log(`Status: ${accountInfo.account.status}`)
  console.log(`Round: ${accountInfo.currentRound}`)
  console.log(`Pending Rewards: ${accountInfo.account.pendingRewards} microAlgos`)
  console.log(`Reward Base: ${accountInfo.account.rewardBase}`)
  console.log(`Total Apps Opted In: ${accountInfo.account.totalAppsOptedIn}`)
  console.log(`Total Assets Opted In: ${accountInfo.account.totalAssetsOptedIn}`)
  console.log(`Total Created Apps: ${accountInfo.account.totalCreatedApps}`)
  console.log(`Total Created Assets: ${accountInfo.account.totalCreatedAssets}`)

  // Verify the account address matches
  if (accountInfo.account.address === testAccount.addr.toString()) {
    console.log('\n✓ Account successfully verified!')
  } else {
    console.log('\n✗ Account address mismatch!')
  }
}

// Run the example
lookupAccountByAddress().catch(console.error)
