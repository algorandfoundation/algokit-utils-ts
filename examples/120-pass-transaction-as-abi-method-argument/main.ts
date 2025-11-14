import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to pass a transaction as an argument to an ABI method.
 * When you pass a transaction as an ABI argument, the SDK automatically creates an
 * atomic transaction group, ensuring both transactions execute together or not at all.
 *
 * This is a powerful pattern for scenarios where a smart contract needs to validate
 * or process a transaction (like a payment) as part of its logic.
 */

async function passTransactionAsAbiArgumentExample() {
  console.log('=== Pass Transaction as ABI Method Argument ===')
  console.log()
  console.log('This example demonstrates how to pass a transaction (like a payment)')
  console.log('as an argument to an ABI method, creating an atomic transaction group.')
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
// This contract has a method that accepts a payment transaction as an argument
// and returns a string describing the payment

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

// call_abi_txn(pay,string)string
// This method accepts a payment transaction and a string, and returns a description
txn ApplicationArgs 0
method "call_abi_txn(pay,string)string"
==
bnz call_abi_txn

int 0
return

call_abi_txn:
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

// Get the payment amount from transaction 0
gtxn 0 Amount
itob

// Prepend "Sent " to the amount
byte "Sent "
swap
concat

// Append ". " to the result
byte ". "
concat

// Get the string argument (it's the second app arg, after the method selector)
txn ApplicationArgs 1
extract 2 0 // Skip the ABI uint16 length prefix
concat

// Store the result
byte 0x151f7c75 // ABI return prefix
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
      name: 'TransactionArgApp',
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

  console.log('=== Creating Transaction to Pass as Argument ===')
  console.log()

  // Create a payment transaction that will be passed as an argument
  const paymentAmount = (0.005).algos() // 5000 microAlgos
  const paymentTxn = await algorand.createTransaction.payment({
    sender: sender.addr,
    receiver: sender.addr,
    amount: paymentAmount,
  })

  console.log('Payment transaction created:')
  console.log('  From:', sender.addr.toString().slice(0, 15), '...')
  console.log('  To:', sender.addr.toString().slice(0, 15), '...')
  console.log('  Amount:', paymentAmount.microAlgos, 'microALGOs')
  console.log()

  console.log('=== Calling ABI Method with Transaction Argument ===')
  console.log()

  // Define the ABI method
  const callAbiTxnMethod = new algosdk.ABIMethod({
    name: 'call_abi_txn',
    args: [
      { type: 'pay', name: 'txn', desc: 'Payment transaction to process' },
      { type: 'string', name: 'value', desc: 'Additional string value' },
    ],
    returns: { type: 'string', desc: 'Description of the payment' },
  })

  // Call the method with the payment transaction as the first argument
  const result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: sender.addr,
      appId: appResult.appId,
      method: callAbiTxnMethod,
      args: [paymentTxn, 'test'], // Pass the transaction as an argument
    })
    .send()

  console.log('✅ Transaction group executed successfully!')
  console.log()
  console.log('   Transaction IDs:')
  console.log(`     [0] ${result.txIds[0]} (Payment)`)
  console.log(`     [1] ${result.txIds[1]} (App Call)`)
  console.log('   Group ID:', result.groupId)
  console.log('   Confirmed in round:', result.confirmations[0]!.confirmedRound!.toString())
  console.log()

  // Extract the return value
  const returnValue = result.returns?.[0]?.returnValue
  if (returnValue) {
    console.log('   Method Return Value:', returnValue.toString())
  }
  console.log()

  console.log('=== What Happened ===')
  console.log()
  console.log('1. We created a payment transaction')
  console.log('2. We passed it as an argument to an ABI method')
  console.log('3. The SDK automatically created an atomic transaction group:')
  console.log('   • Transaction [0]: The payment transaction')
  console.log('   • Transaction [1]: The app call that references transaction [0]')
  console.log('4. The smart contract accessed the payment amount using gtxn 0')
  console.log('5. Both transactions executed atomically (all or nothing)')
  console.log()

  console.log('=== Key Takeaways ===')
  console.log()
  console.log('✓ Transactions can be passed as ABI method arguments')
  console.log('✓ The SDK automatically creates atomic transaction groups')
  console.log('✓ Smart contracts use gtxn opcodes to access transaction details')
  console.log('✓ Common transaction types: pay, axfer, appl, afrz, acfg, keyreg')
  console.log('✓ Use cases: Payment validation, asset transfer verification, multi-step protocols')
  console.log()

  console.log('=== Common Use Cases ===')
  console.log()
  console.log('1. Payment Verification: Validate payment amount/receiver before processing')
  console.log('2. Asset Transfer Validation: Verify correct asset and amount transferred')
  console.log('3. Fee Delegation: One account pays fees while another performs action')
  console.log('4. Conditional Logic: Execute different logic based on transaction type')
  console.log('5. Multi-Step Protocols: Chain multiple operations atomically')
  console.log()

  console.log('✨ Example completed successfully!')
}

// Run the example
passTransactionAsAbiArgumentExample().catch(console.error)
