import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * This example demonstrates how to call an ABI method that accepts a transaction
 * as one of its arguments. This enables powerful transaction composition patterns
 * where the smart contract can verify and react to other transactions in the same
 * atomic group.
 *
 * The TestingApp contract has a method `call_abi_txn(pay,string)string` that:
 * - Accepts a payment transaction as the first argument
 * - Accepts a string message as the second argument
 * - Returns a string describing the payment amount and message
 */

async function callABIMethodWithTransactionArgument() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser account for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create test accounts
  const alice = algorand.account.random()
  await algorand.account.ensureFunded(alice, dispenser, (5).algos())

  const bob = algorand.account.random()
  await algorand.account.ensureFunded(bob, dispenser, (1).algos())

  console.log('Alice address:', alice.addr)
  console.log('Bob address:', bob.addr)
  console.log()

  // Step 1: Deploy the app
  console.log('Deploying app...')
  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: alice.addr,
  })

  const { appClient, result: createResult } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 123,
    },
  })

  const appId = BigInt(createResult.appId)
  console.log('App deployed with ID:', appId)
  console.log()

  // Step 2: Create a payment transaction to pass as an argument
  const paymentAmount = (0.5).algos()
  console.log(`Creating payment transaction for ${paymentAmount.microAlgo} microAlgos (${paymentAmount.algos} ALGOs)`)
  console.log(`Payment: Alice → Bob`)
  console.log()

  const paymentTxn = await algorand.createTransaction.payment({
    sender: alice.addr,
    receiver: bob.addr,
    amount: paymentAmount,
  })

  // Step 3: Call the ABI method with the transaction as an argument
  console.log('Calling ABI method with transaction argument...')
  console.log('Method: call_abi_txn(pay, string)')
  console.log()

  /**
   * When you pass a transaction as a method argument, AlgoKit Utils will:
   * 1. Accept the pre-created payment transaction
   * 2. Create the app call transaction with the ABI method
   * 3. Automatically group them together atomically
   * 4. Handle the ABI encoding for the transaction reference
   * 5. Sign and send both transactions as a group
   */
  const result = await appClient.send.callAbiTxn({
    args: {
      txn: { txn: paymentTxn, signer: alice.signer },
      value: 'Hello from transaction argument!',
    },
  })

  // Step 4: Process the results
  console.log('✅ Transaction group sent successfully!')
  console.log('Transaction ID:', result.transaction.txID())
  console.log('Group ID:', result.groupId)
  console.log()

  // Step 5: Display the ABI return value
  console.log('Return value:', result.return)
  console.log()

  console.log('The app call transaction received the payment transaction as an argument.')
  console.log(`Payment of ${paymentAmount.microAlgo} microAlgos was processed in the same atomic group.`)
  console.log()

  console.log('✅ Example completed successfully!')
}

// Run the example
callABIMethodWithTransactionArgument().catch(console.error)
