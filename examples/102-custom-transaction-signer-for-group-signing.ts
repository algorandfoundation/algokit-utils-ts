import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TransactionSigner } from 'algosdk'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * This example demonstrates how to implement a custom TransactionSigner
 * to control signing logic for transaction groups.
 *
 * Custom signers are useful for:
 * - Wallet integrations with custom signing workflows
 * - Tracking which transactions are being signed
 * - Implementing conditional signing logic
 * - Adding logging or auditing around transaction signing
 * - Testing and development purposes
 *
 * Key concepts:
 * - TransactionSigner interface from algosdk
 * - Transaction groups and atomic transfers
 * - Delegating to default signers
 * - Tracking signed transaction indexes
 */

async function customTransactionSignerExample() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser account for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create test accounts
  const alice = algorand.account.random()
  const bob = algorand.account.random()

  await algorand.account.ensureFunded(alice, dispenser, (5).algos())
  await algorand.account.ensureFunded(bob, dispenser, (2).algos())

  console.log('Alice address:', alice.addr.toString())
  console.log('Bob address:', bob.addr.toString())
  console.log()

  // Deploy the testing app
  console.log('=== Deploying Application ===')
  console.log()

  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: alice.addr,
  })

  const { appClient } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 100,
    },
  })

  console.log('✅ App deployed successfully!')
  console.log('App ID:', appClient.appId)
  console.log()

  // Create a payment transaction to pass as an argument to the ABI method
  console.log('=== Creating Payment Transaction ===')
  console.log()

  const paymentAmount = (0.5).algos()
  console.log(`Payment amount: ${paymentAmount.algos} ALGOs (${paymentAmount.microAlgo} microAlgos)`)
  console.log(`From: Alice → To: Bob`)
  console.log()

  const paymentTxn = await algorand.createTransaction.payment({
    sender: alice.addr,
    receiver: bob.addr,
    amount: paymentAmount,
  })

  // Track which transaction indexes are being signed
  let signedIndexes: number[] = []
  let signerCallCount = 0

  // Implement a custom TransactionSigner
  // This wraps the default signer to add custom logic
  const customSigner: TransactionSigner = (txnGroup, indexesToSign) => {
    signerCallCount++
    console.log(`📝 Custom signer called (call #${signerCallCount})`)
    console.log(`   Transaction group size: ${txnGroup.length}`)
    console.log(`   Indexes to sign: [${indexesToSign.join(', ')}]`)
    console.log()

    // Store the indexes for tracking
    signedIndexes = indexesToSign

    // In a real implementation, you might:
    // 1. Show a wallet UI prompt
    // 2. Apply signing policies (amount limits, address whitelists, etc.)
    // 3. Log to an audit system
    // 4. Add rate limiting
    // 5. Require additional authentication

    // Delegate to the default signer for actual signing
    // getSenderTransactionSigner returns the standard signing function
    return alice.signer(txnGroup, indexesToSign)
  }

  console.log('=== Calling ABI Method with Custom Signer ===')
  console.log()
  console.log('Method: callAbiTxn(txn: PayTxn, value: string)')
  console.log('This will create a transaction group:')
  console.log('  [0] Payment transaction (passed as argument)')
  console.log('  [1] App call transaction (ABI method call)')
  console.log()

  // Call the ABI method with the transaction argument
  // Use the custom signer by passing it as part of the sender parameter
  const result = await appClient.send.callAbiTxn({
    args: {
      txn: { txn: paymentTxn, signer: customSigner },
      value: 'Signed with custom signer!',
    },
  })

  console.log('✅ Transaction group signed and sent successfully!')
  console.log()

  console.log('=== Transaction Group Details ===')
  console.log()
  console.log(`Group ID: ${result.groupId}`)
  console.log(`Total transactions in group: ${result.transactions.length}`)
  console.log()

  // Display each transaction in the group
  result.transactions.forEach((tx, index) => {
    console.log(`Transaction ${index}:`)
    console.log(`  Transaction ID: ${tx.txID()}`)
    if (index === 0) {
      console.log(`  Type: Payment`)
      console.log(`  Details: Payment of ${paymentAmount.algos} ALGOs from Alice to Bob`)
    } else {
      console.log(`  Type: Application Call`)
      console.log(`  Details: App call to method 'callAbiTxn'`)
    }
    console.log()
  })

  console.log('=== Custom Signer Results ===')
  console.log()
  console.log(`Signer was called: ${signerCallCount} time(s)`)
  console.log(`Signed transaction indexes: [${signedIndexes.join(', ')}]`)
  console.log()

  console.log('💡 Key Takeaways:')
  console.log('  • The custom signer was invoked to sign the transaction group')
  console.log('  • It tracked which transactions needed signing')
  console.log('  • It delegated to the default signer for actual signing')
  console.log('  • All transactions were atomically grouped and submitted')
  console.log()

  console.log('✅ Example completed successfully!')
}

// Run the example
customTransactionSignerExample().catch(console.error)
