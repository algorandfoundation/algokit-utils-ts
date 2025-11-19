import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to compose transaction groups where different
 * transactions are signed by different accounts. This is essential for:
 * - Multi-party operations (escrow, atomic swaps, etc.)
 * - Complex DApp workflows involving multiple users
 * - Smart contracts that require transactions from specific accounts
 */

async function multiAccountTransactionGroupExample() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create the main deployer account
  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

  console.log('=== Multi-Account Transaction Groups ===')
  console.log('Deployer account:', deployer.addr.toString())
  console.log()

  // Create and fund a second account that will sign a transaction in the group
  console.log('Creating and funding second signer account...')
  const secondSigner = algorand.account.random()
  await algorand.account.ensureFunded(secondSigner, dispenser, (1).algos())

  console.log('Second signer account:', secondSigner.addr.toString())
  console.log()

  // Deploy a simple application
  console.log('Deploying application...')

  const approvalProgram = `#pragma version 10
// This app accepts any transaction in a transaction group
// It validates that a payment transaction is present before the app call

txn ApplicationID
int 0
==
bnz create

// Handle UpdateApplication
txn OnCompletion
int UpdateApplication
==
bnz handle_update

// Handle DeleteApplication
txn OnCompletion
int DeleteApplication
==
bnz handle_delete

// Verify we're in a group with at least 2 transactions
global GroupSize
int 2
>=
assert

// Verify the previous transaction (txn 0) is a payment
gtxn 0 TypeEnum
int pay
==
assert

// Verify the payment amount is at least 5000 microALGOs
gtxn 0 Amount
int 5000
>=
assert

int 1
return

handle_update:
int TMPL_UPDATABLE
return

handle_delete:
int TMPL_DELETABLE
return

create:
int 1
return`

  const clearProgram = `#pragma version 10
int 1`

  const deployment = {
    sender: deployer.addr,
    metadata: {
      name: 'MultiSignerApp',
      version: '1.0',
      updatable: false,
      deletable: false,
    },
    createParams: {
      sender: deployer.addr,
      approvalProgram: approvalProgram,
      clearStateProgram: clearProgram,
      schema: {
        globalInts: 0,
        globalByteSlices: 0,
        localInts: 0,
        localByteSlices: 0,
      },
    },
    updateParams: {
      sender: deployer.addr,
    },
    deleteParams: {
      sender: deployer.addr,
    },
  }

  const appResult = await algorand.appDeployer.deploy(deployment)
  console.log('✅ Application deployed')
  console.log('   App ID:', appResult.appId.toString())
  console.log('   App Address:', appResult.appAddress.toString())
  console.log()

  // Wait for indexer to catch up
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Create a payment transaction from the second signer
  // This transaction will be included in the group but signed by the second account
  console.log('Creating transaction group with multiple signers...')
  console.log()

  // Create payment transaction from second signer (will be txn 0 in group)
  const paymentTxn = await algorand.createTransaction.payment({
    sender: secondSigner.addr,
    receiver: deployer.addr,
    amount: (0.005).algos(), // 5000 microALGOs
  })

  // Create app call transaction from deployer (will be txn 1 in group)
  const appCallTxn = await algorand.createTransaction.appCall({
    sender: deployer.addr,
    appId: appResult.appId,
  })

  console.log('Transaction group composition:')
  console.log('  [0] Payment: ', secondSigner.addr.toString().slice(0, 10), '... → ', deployer.addr.toString().slice(0, 10), '... (signed by secondSigner)')
  console.log('  [1] App Call: ', deployer.addr.toString().slice(0, 10), '... → App', appResult.appId.toString(), '(signed by deployer)')
  console.log()

  // Send the transaction group with different signers
  console.log('Sending transaction group...')
  const result = await algorand
    .newGroup()
    .addTransaction(paymentTxn, secondSigner.signer)
    .addTransaction(appCallTxn, deployer.signer)
    .send()

  console.log()
  console.log('✅ Transaction group successfully sent!')
  // The result contains the transaction IDs and confirmation information
  console.log('   Transaction IDs:')
  console.log(`     [0] ${result.txIds[0]}`)
  console.log(`     [1] ${result.txIds[1]}`)
  console.log('   Group ID:', result.groupId)
  console.log('   Confirmed in round:', result.confirmations[0]!.confirmedRound!.toString())
  console.log()

  console.log('=== Key Takeaways ===')
  console.log('✅ Different transactions in the group were signed by different accounts')
  console.log('✅ Transaction 0 (payment): Signed by second signer')
  console.log('✅ Transaction 1 (app call): Signed by deployer')
  console.log('✅ The app validated that the payment came before the app call')
  console.log('✅ All transactions were atomic - they either all succeeded or all failed')
  console.log()

  console.log('✨ Example completed successfully!')
}

// Run the example
multiAccountTransactionGroupExample().catch(console.error)
