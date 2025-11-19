import { AlgorandClient, microAlgos } from '@algorandfoundation/algokit-utils'
import type { TransactionSigner } from 'algosdk'
import algosdk from 'algosdk'

/**
 * This example demonstrates two patterns for custom transaction signing:
 * 1. Using a custom signer to intercept and sign all transactions in a group
 * 2. Specifying different signers for individual transactions in an atomic group
 *
 * These patterns are useful for:
 * - Wallet integrations where you need custom signing logic
 * - Multi-party atomic transactions (different accounts sign different txns)
 * - Logging and auditing transaction signing
 * - Testing and mocking signing behavior
 */

async function main() {
  console.log('=== Use Custom Signers in Atomic Transaction Groups ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr.toString())
  console.log()

  // First, deploy a simple smart contract that accepts a payment transaction
  console.log('=== Deploying Smart Contract ===')

  const approvalProgram = `#pragma version 10

txn ApplicationID
int 0
==
bnz create

// Handle app calls
txn NumAppArgs
int 0
>
bnz check_methods

// Default: approve
int 1
return

create:
// Initialize state
byte "count"
int 0
app_global_put

int 1
return

check_methods:
// Check which ABI method is being called
txn ApplicationArgs 0
method "accept_payment(pay,string)void"
==
bnz method_accept_payment

// Unknown method
int 0
return

method_accept_payment:
// Verify we received a payment transaction in the group
gtxn 0 TypeEnum
int 1  // Payment
==
assert

// Increment counter
byte "count"
byte "count"
app_global_get
int 1
+
app_global_put

int 1
return`

  const clearProgram = `#pragma version 10
int 1
return`

  const createResult = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  })

  const appId = createResult.appId

  console.log('✅ Smart contract deployed!')
  console.log('   App ID:', appId)
  console.log()

  // Define the ABI method
  const acceptPaymentMethod = new algosdk.ABIMethod({
    name: 'accept_payment',
    args: [
      { type: 'pay', name: 'payment' },
      { type: 'string', name: 'note' },
    ],
    returns: { type: 'void' },
  })

  // ========================================================================
  // Example 1: Custom Signer for All Transactions
  // ========================================================================

  console.log('=== Example 1: Custom Signer for All Transactions ===\n')

  console.log('Scenario: You want to intercept and log all signing operations')
  console.log('Use case: Wallet integration, auditing, testing\n')

  // Track which transaction indexes are signed
  let signedIndexes: number[] = []

  // Create a custom signer that logs which transactions it signs
  const loggingSigner: TransactionSigner = (transactionGroup, indexesToSign) => {
    console.log('🔐 Custom signer called!')
    console.log(`   Transaction group size: ${transactionGroup.length}`)
    console.log(`   Indexes to sign: ${indexesToSign.join(', ')}`)

    signedIndexes = indexesToSign

    // Log transaction types
    indexesToSign.forEach((idx) => {
      const txn = transactionGroup[idx]
      console.log(`   Transaction ${idx}: ${txn.type}`)
    })

    // After logging, delegate to the actual signer
    // In a real wallet, this is where you'd show a UI prompt
    return deployer.signer(transactionGroup, indexesToSign)
  }

  console.log('Creating atomic transaction group with custom signer...\n')

  // Create a payment transaction
  const payment1 = await algorand.createTransaction.payment({
    sender: deployer.addr,
    receiver: deployer.addr,
    amount: microAlgos(3000),
  })

  // Call the app method with the payment
  // The custom signer will sign BOTH the payment and app call
  const result1 = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: acceptPaymentMethod,
      args: [payment1, 'test-note'],
      signer: loggingSigner,  // Custom signer for the whole group
    })
    .send()

  console.log('\n✅ Transaction group sent successfully!')
  console.log(`   Signed ${signedIndexes.length} transactions`)
  console.log(`   Transaction IDs: ${result1.txIds.join(', ')}`)
  console.log('   Both transactions were signed by the custom signer\n')

  // ========================================================================
  // Example 2: Different Signers for Different Transactions
  // ========================================================================

  console.log('=== Example 2: Different Signers for Different Transactions ===\n')

  console.log('Scenario: Multi-party atomic transaction')
  console.log('Use case: Different accounts sign different parts of the group\n')

  // Create a second account
  console.log('Creating and funding a second account...')
  const secondAccount = algorand.account.random()

  // Fund the second account
  await algorand.send.payment({
    sender: deployer.addr,
    receiver: secondAccount.addr,
    amount: microAlgos(500_000),
  })

  console.log(`✅ Second account created: ${secondAccount.addr.toString()}`)
  console.log()

  console.log('Creating atomic group with different signers:')
  console.log(`   Payment transaction 1: signed by ${deployer.addr.toString().substring(0, 10)}...`)
  console.log(`   Payment transaction 2: signed by ${secondAccount.addr.toString().substring(0, 10)}...`)
  console.log()

  // Build an atomic group with transactions from different accounts
  // Each transaction will be signed by its respective account's signer
  const result2 = await algorand
    .newGroup()
    .addPayment({
      sender: deployer.addr,
      receiver: secondAccount.addr,
      amount: microAlgos(1000),
      // No signer specified - uses deployer's default signer
    })
    .addPayment({
      sender: secondAccount.addr,
      receiver: deployer.addr,
      amount: microAlgos(500),
      signer: secondAccount.signer,  // Explicitly specify second account's signer
    })
    .send()

  console.log('✅ Multi-party transaction group sent successfully!')
  console.log(`   Transaction IDs: ${result2.txIds.join(', ')}`)
  console.log('   Different accounts signed different transactions!\n')

  // ========================================================================
  // Example 3: Custom Signer with Conditional Logic
  // ========================================================================

  console.log('=== Example 3: Custom Signer with Conditional Logic ===\n')

  console.log('Scenario: Apply different logic based on transaction type')
  console.log('Use case: Risk assessment, approval workflows\n')

  // Track approved transactions
  const approvedTransactions: string[] = []

  // Create a signer with conditional logic
  const conditionalSigner: TransactionSigner = (transactionGroup, indexesToSign) => {
    console.log('🔐 Conditional signer analyzing transactions...')

    indexesToSign.forEach((idx) => {
      const txn = transactionGroup[idx]

      if (txn.type === 'pay') {
        const payTxn = txn as algosdk.Transaction
        const amount = payTxn.payment?.amount || 0

        console.log(`   Payment transaction: ${amount} microAlgos`)

        if (amount > 10000) {
          console.log('   ⚠️  High-value payment - requiring additional approval')
          // In a real app, you might show a confirmation dialog here
        } else {
          console.log('   ✓ Low-value payment - auto-approved')
        }
      } else if (txn.type === 'appl') {
        console.log('   Application call - verifying...')
        console.log('   ✓ App call approved')
      }

      approvedTransactions.push(`Transaction ${idx} (${txn.type})`)
    })

    // Delegate to actual signer
    return deployer.signer(transactionGroup, indexesToSign)
  }

  // Create a high-value payment
  const payment3 = await algorand.createTransaction.payment({
    sender: deployer.addr,
    receiver: deployer.addr,
    amount: microAlgos(15000),  // High value
  })

  const result3 = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: acceptPaymentMethod,
      args: [payment3, 'high-value-test'],
      signer: conditionalSigner,
    })
    .send()

  console.log('\n✅ Conditional signing completed!')
  console.log(`   Approved transactions: ${approvedTransactions.join(', ')}`)
  console.log(`   Transaction IDs: ${result3.txIds.join(', ')}\n`)

  // ========================================================================
  // Example 4: Logging Signer for Debugging
  // ========================================================================

  console.log('=== Example 4: Logging Signer for Debugging ===\n')

  console.log('Scenario: Debug transaction signing issues')
  console.log('Use case: Development, troubleshooting\n')

  // Create a detailed logging signer
  const debugSigner: TransactionSigner = (transactionGroup, indexesToSign) => {
    console.log('🔍 Debug Signer - Transaction Details:')
    console.log(`   Group ID: ${transactionGroup[0].group ? algosdk.encodeAddress(transactionGroup[0].group) : 'none'}`)
    console.log(`   Group size: ${transactionGroup.length}`)
    console.log(`   Signing indexes: ${indexesToSign.join(', ')}\n`)

    transactionGroup.forEach((txn, idx) => {
      const isSigning = indexesToSign.includes(idx)
      console.log(`   Transaction ${idx}:`)
      console.log(`     Type: ${txn.type}`)

      // Handle different ways sender can be represented
      const sender = txn.sender
      if (sender) {
        const senderAddr = typeof sender === 'string' ? sender : algosdk.encodeAddress(sender.publicKey)
        console.log(`     Sender: ${senderAddr}`)
      }

      console.log(`     Fee: ${txn.fee} microAlgos`)
      console.log(`     Signing: ${isSigning ? 'YES' : 'NO'}`)

      if (txn.type === 'pay' && txn.payment) {
        console.log(`     Receiver: ${typeof txn.payment.receiver === 'string' ? txn.payment.receiver : algosdk.encodeAddress(txn.payment.receiver.publicKey)}`)
        console.log(`     Amount: ${txn.payment.amount} microAlgos`)
      } else if (txn.type === 'appl') {
        // App ID is on the applicationCall.appIndex property
        const appCallTxn = txn as algosdk.Transaction
        console.log(`     App Index: ${appCallTxn.applicationCall?.appIndex || 'N/A'}`)
        console.log(`     App Args: ${appCallTxn.applicationCall?.appArgs?.length || 0}`)
      }
      console.log()
    })

    // Delegate to actual signer
    return deployer.signer(transactionGroup, indexesToSign)
  }

  const payment4 = await algorand.createTransaction.payment({
    sender: deployer.addr,
    receiver: deployer.addr,
    amount: microAlgos(4000),
  })

  const result4 = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: acceptPaymentMethod,
      args: [payment4, 'debug-test'],
      signer: debugSigner,
    })
    .send()

  console.log('✅ Debug signing completed!')
  console.log(`   Transaction IDs: ${result4.txIds.join(', ')}\n`)

  // ========================================================================
  // Summary
  // ========================================================================

  console.log('=== Understanding Custom Signers ===\n')

  console.log('What is a TransactionSigner?')
  console.log('  • A function that takes a transaction group and signs specific transactions')
  console.log('  • Signature: (txnGroup: Transaction[], indexesToSign: number[]) => Promise<Uint8Array[]>')
  console.log('  • Returns an array of signed transaction bytes\n')

  console.log('Common use cases:')
  console.log('  ✓ Wallet integrations - custom UI for approval')
  console.log('  ✓ Multi-party transactions - different signers per transaction')
  console.log('  ✓ Logging and auditing - track all signing operations')
  console.log('  ✓ Conditional signing - apply rules based on transaction content')
  console.log('  ✓ Testing and mocking - simulate different signing scenarios')
  console.log('  ✓ Hardware wallets - delegate to external signing devices\n')

  console.log('Key concepts:')
  console.log('  • Custom signers can wrap default signers for logging/validation')
  console.log('  • Different transactions in a group can have different signers')
  console.log('  • Signers receive the full group context for validation')
  console.log('  • All transactions in a group must be signed for the group to be valid\n')

  console.log('✨ All examples completed successfully!')
}

main().catch(console.error)
