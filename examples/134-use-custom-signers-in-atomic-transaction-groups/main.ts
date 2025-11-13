import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as algokit from '@algorandfoundation/algokit-utils'
import type { TransactionSigner } from 'algosdk'
// Import your generated typed client
import { YourAppClient } from './artifacts/YourAppClient'

/**
 * This example demonstrates two patterns for custom transaction signing:
 * 1. Using a custom signer to intercept and sign all transactions in a group
 * 2. Specifying different signers for individual transactions in an atomic group
 */

async function example1_customSignerForAllTransactions() {
  console.log('\n=== Example 1: Custom Signer for All Transactions ===')
  
  const algorand = AlgorandClient.defaultLocalNet()
  const sender = await algorand.account.fromEnvironment('SENDER')
  
  // Create a payment transaction
  const paymentTxn = await algorand.createTransaction.payment({
    sender: sender.addr,
    receiver: sender.addr,
    amount: algokit.microAlgo(3000),
  })
  
  // Initialize app client
  const appClient = new YourAppClient(
    {
      resolveBy: 'id',
      id: YOUR_APP_ID, // Replace with your deployed app ID
      sender,
    },
    algorand.client.algod
  )
  
  // Track which transaction indexes are signed
  let signedIndexes: number[] = []
  
  // Create a custom signer that logs which transactions it signs
  const customSigner: TransactionSigner = (transactionGroup, indexesToSign) => {
    console.log(`Custom signer called to sign transactions at indexes: ${indexesToSign}`)
    signedIndexes = indexesToSign
    
    // Delegate to the default signer after logging
    return algorand.account.getSigner(sender.addr)(transactionGroup, indexesToSign)
  }
  
  console.log('Calling ABI method with custom signer...')
  
  // Call the method with the custom signer
  await appClient.send.call({
    method: 'call_abi_txn',
    args: [paymentTxn, 'test'],
    sender: sender.addr,
    signer: customSigner,
  })
  
  console.log(`Signed transactions at indexes: ${signedIndexes}`)
  console.log('Both transactions in the atomic group were signed by the custom signer')
}

async function example2_differentSignersPerTransaction() {
  console.log('\n=== Example 2: Different Signers for Different Transactions ===')
  
  const algorand = AlgorandClient.defaultLocalNet()
  const mainAccount = await algorand.account.fromEnvironment('SENDER')
  
  // Create a second account that will sign the payment transaction
  console.log('Creating and funding a second account...')
  const secondAccount = await algorand.account.random()
  
  // Fund the second account
  await algorand.send.payment({
    sender: mainAccount.addr,
    receiver: secondAccount.addr,
    amount: algokit.algo(1),
  })
  
  console.log(`Second account created: ${secondAccount.addr}`)
  
  // Create a payment transaction from the second account
  const paymentTxn = await algorand.createTransaction.payment({
    sender: secondAccount.addr,
    receiver: secondAccount.addr,
    amount: algokit.microAlgo(2000),
  })
  
  // Initialize app client with main account as sender
  const appClient = new YourAppClient(
    {
      resolveBy: 'id',
      id: YOUR_APP_ID, // Replace with your deployed app ID
      sender: mainAccount,
    },
    algorand.client.algod
  )
  
  console.log('Calling ABI method with different signer for payment transaction...')
  
  // Call the method, specifying a different signer for the payment transaction
  // The main account will sign the app call, the second account will sign the payment
  await appClient.send.call({
    method: 'call_abi_txn',
    args: [
      {
        txn: paymentTxn,
        signer: secondAccount.signer, // Specify custom signer for this transaction
      },
      'test',
    ],
  })
  
  console.log('Success! Transactions were signed by different accounts:')
  console.log(`  - Payment transaction signed by: ${secondAccount.addr}`)
  console.log(`  - App call transaction signed by: ${mainAccount.addr}`)
}

async function main() {
  console.log('Custom Signers in Atomic Transaction Groups')
  console.log('============================================')
  
  // Run both examples
  await example1_customSignerForAllTransactions()
  await example2_differentSignersPerTransaction()
  
  console.log('\nAll examples completed successfully!')
}

main().catch(console.error)