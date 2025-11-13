import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * Example: Look Up Transaction by ID Using Indexer
 * 
 * This example demonstrates how to:
 * 1. Send a payment transaction to the Algorand blockchain
 * 2. Wait for the indexer to catch up and index the transaction
 * 3. Look up the transaction by its ID using the indexer
 * 4. Verify the transaction details
 */

async function lookupTransactionById() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get dispenser account for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a test account
  const sender = await algorand.account.random()
  const receiver = await algorand.account.random()

  // Fund the sender account from dispenser
  console.log('Funding sender account...')
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: sender.addr,
    amount: algo(10),
  })

  console.log('Sending test transaction...')
  // Send a payment transaction
  const result = await algorand.send.payment({
    sender: sender.addr,
    receiver: receiver.addr,
    amount: algo(1),
    signer: sender,
  })
  
  const txId = result.transaction.txID()
  console.log(`Transaction sent with ID: ${txId}`)
  console.log(`First valid round: ${result.transaction.firstValid}`)

  // Wait for indexer to catch up and index the transaction
  console.log('\nWaiting for indexer to index the transaction...')
  let txnInfo
  const maxAttempts = 20
  for (let i = 0; i < maxAttempts; i++) {
    try {
      txnInfo = await algorand.client.indexer.lookupTransactionByID(txId).do()
      console.log('✓ Transaction indexed!')
      break
    } catch (error) {
      console.log(`   Waiting for indexer... (attempt ${i + 1}/${maxAttempts})`)
      await new Promise(resolve => setTimeout(resolve, 2000))
      if (i === maxAttempts - 1) {
        throw new Error('Transaction not indexed in time')
      }
    }
  }

  // Display transaction information
  console.log('\n=== Transaction Information ===')
  console.log(`Transaction ID: ${txnInfo!.transaction.id}`)
  console.log(`Current Round: ${txnInfo!.currentRound}`)
  console.log(`Sender: ${txnInfo!.transaction.sender}`)
  console.log(`Receiver: ${txnInfo!.transaction.paymentTransaction!.receiver}`)
  console.log(`Amount: ${txnInfo!.transaction.paymentTransaction!.amount} microAlgos`)
  console.log(`Round Time: ${txnInfo!.transaction.roundTime}`)
  console.log(`Confirmed Round: ${txnInfo!.transaction.confirmedRound}`)

  // Verify the transaction was found correctly
  if (txnInfo!.transaction.id === txId) {
    console.log('\n✓ Transaction successfully verified!')
  } else {
    console.log('\n✗ Transaction ID mismatch!')
  }

  // Verify the current round is at or after the first valid round
  if (txnInfo!.currentRound >= result.transaction.firstValid) {
    console.log('✓ Transaction confirmed on the blockchain')
  }
}

// Run the example
lookupTransactionById().catch(console.error)