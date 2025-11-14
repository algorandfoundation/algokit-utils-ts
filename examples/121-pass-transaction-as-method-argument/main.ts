import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to pass a transaction as an argument to a smart contract method
 * within a transaction group. This differs from example 120 in that we're adding multiple
 * transactions to the group, including one that's passed as a method argument.
 *
 * This pattern is useful when your contract needs to verify or process transaction details
 * while also performing other operations in the same atomic group.
 */

async function transactionAsArgumentExample() {
  console.log('=== Pass Transaction as Method Argument ===')
  console.log()
  console.log('This example shows how to pass a transaction as an argument')
  console.log('to an ABI method within a multi-transaction group.')
  console.log()

  // Initialize AlgorandClient - connects to your Algorand node
  const algorand = AlgorandClient.defaultLocalNet()

  // Get account from LocalNet
  const sender = (await algorand.account.localNetDispenser()).account

  console.log('Account:', sender.addr.toString())
  console.log()

  // Deploy a smart contract with a method that accepts a transaction argument
  console.log('Deploying smart contract...')

  const approvalProgram = `#pragma version 10
// This contract has a method that accepts a transaction reference as an argument

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

// txnArg(txn)address
// This method accepts a transaction reference and returns the sender address
txn ApplicationArgs 0
method "txnArg(txn)address"
==
bnz txn_arg

int 0
return

txn_arg:
// Verify we're in a group with at least 3 transactions
global GroupSize
int 3
>=
assert

// When a transaction is passed as an ABI argument with type 'txn',
// the SDK automatically adds that transaction to the group before the app call
// and encodes its index in the ApplicationArgs
// The transaction reference should be at index 0 in the group (first added payment)
gtxn 0 Sender

// Return the sender address (prepend ABI return prefix)
byte 0x151f7c75 // ABI return prefix for address
swap
concat

log
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
    sender: sender.addr,
    metadata: {
      name: 'TxnArgApp',
      version: '1.0',
      updatable: false,
      deletable: false,
    },
    createParams: {
      sender: sender.addr,
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
      sender: sender.addr,
    },
    deleteParams: {
      sender: sender.addr,
    },
  }

  const appResult = await algorand.appDeployer.deploy(deployment)
  console.log('✅ Application deployed')
  console.log('   App ID:', appResult.appId.toString())
  console.log('   App Address:', appResult.appAddress.toString())
  console.log()

  // Wait for indexer to catch up
  await new Promise((resolve) => setTimeout(resolve, 2000))

  console.log('=== Creating Transaction Group ===')
  console.log()

  // Define the ABI method
  const txnArgMethod = new algosdk.ABIMethod({
    name: 'txnArg',
    args: [{ type: 'txn', name: 'payment', desc: 'Transaction reference to process' }],
    returns: { type: 'address', desc: 'Sender address from the transaction' },
  })

  // Create the payment transaction that will be passed as an argument
  const paymentTxn = await algorand.createTransaction.payment({
    sender: sender.addr,
    receiver: sender.addr,
    amount: (0).microAlgo(),
    note: new TextEncoder().encode('Payment as arg'),
  })

  console.log('Creating a transaction group with:')
  console.log('  [0] Payment transaction (will be referenced by app call)')
  console.log('  [1] Another payment transaction (part of the group)')
  console.log('  [2] App call with transaction reference as argument')
  console.log()

  // Create a transaction group where:
  // 1. First payment transaction (will be referenced as an argument)
  // 2. Second payment transaction (just part of the group)
  // 3. App call method that references the first payment transaction
  const result = await algorand
    .newGroup()
    // Add a payment transaction to the group (this will be transaction 0)
    .addPayment({
      sender: sender.addr,
      receiver: sender.addr,
      amount: (0).microAlgo(),
      note: new TextEncoder().encode('First payment'),
    })
    // Add another payment to the group (this will be transaction 1)
    .addPayment({
      sender: sender.addr,
      receiver: sender.addr,
      amount: (0).microAlgo(),
      note: new TextEncoder().encode('Second payment'),
    })
    // Add an app call that references a transaction as an argument (this will be transaction 2)
    .addAppCallMethodCall({
      sender: sender.addr,
      appId: appResult.appId,
      method: txnArgMethod,
      // Pass the payment transaction as an argument
      args: [paymentTxn],
    })
    .send()

  console.log('✅ Transaction group executed successfully!')
  console.log()
  console.log('   Transaction IDs:')
  console.log(`     [0] ${result.txIds[0]} (Payment - referenced by app call)`)
  console.log(`     [1] ${result.txIds[1]} (Payment - just in group)`)
  console.log(`     [2] ${result.txIds[2]} (App Call with txn arg)`)
  console.log('   Group ID:', result.groupId)
  console.log('   Confirmed in round:', result.confirmations[0]!.confirmedRound!.toString())
  console.log()

  // Access the return value from the method call
  const returnValue = result.returns?.[0]?.returnValue
  if (returnValue) {
    const returnedAddress = returnValue.toString()
    console.log('   Method Return Value:', returnedAddress)
    console.log('   Expected:', sender.addr.toString())
    console.log('   Match:', returnedAddress === sender.addr.toString() ? '✅' : '❌')
  }
  console.log()

  console.log('=== What Happened ===')
  console.log()
  console.log('1. We created a group of 3 transactions')
  console.log('2. The first payment transaction was referenced as an argument to the app call')
  console.log('3. The second payment transaction was just part of the group')
  console.log('4. The app call method received a reference to transaction [0]')
  console.log('5. The smart contract extracted the sender address using gtxn 0 Sender')
  console.log('6. All three transactions executed atomically')
  console.log()

  console.log('=== Key Differences from Example 120 ===')
  console.log()
  console.log('Example 120:')
  console.log('  • Passes a transaction directly as an argument')
  console.log('  • Group has 2 transactions: [payment, app call]')
  console.log('  • Payment is both an argument AND in the group')
  console.log()
  console.log('Example 121:')
  console.log('  • Passes a transaction reference within a larger group')
  console.log('  • Group has 3+ transactions: [payment, other txns, app call]')
  console.log('  • Shows how to combine transaction arguments with other operations')
  console.log()

  console.log('=== Key Takeaways ===')
  console.log()
  console.log('✓ Transactions can be passed as arguments to ABI method calls')
  console.log('✓ Use algorand.createTransaction to create transaction objects for arguments')
  console.log('✓ Transaction arguments are references to other transactions in the group')
  console.log('✓ You can combine transaction arguments with other group operations')
  console.log('✓ The smart contract uses gtxn opcodes to access the referenced transaction')
  console.log('✓ All transactions in the group execute atomically')
  console.log()

  console.log('=== Common Use Cases ===')
  console.log()
  console.log('1. Multi-Step Workflows: Payment → Processing → Confirmation')
  console.log('2. Escrow Validation: Multiple parties contribute, contract validates all')
  console.log('3. Payment Verification: Verify payment before granting access')
  console.log('4. Complex DApp Logic: Chain multiple operations with validation')
  console.log('5. Atomic Swaps: Multiple transfers with validation in single group')
  console.log()

  console.log('✨ Example completed successfully!')
}

// Run the example
transactionAsArgumentExample().catch(console.error)
