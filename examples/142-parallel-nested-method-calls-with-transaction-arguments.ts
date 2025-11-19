import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppCallMethodCall } from '@algorandfoundation/algokit-utils/types/composer'
import algosdk from 'algosdk'

/**
 * Parallel Nested Method Calls with Transaction Arguments
 *
 * This example demonstrates how to compose a method with multiple nested method
 * calls in parallel, each with their own transaction arguments.
 *
 * Scenario:
 * Call doubleNestedTxnArg(pay, appl, pay, appl) which accepts:
 * - Two payment transaction arguments
 * - Two method call arguments (each method call also takes a payment transaction)
 *
 * Structure:
 * doubleNestedTxnArg
 *   ├─ payment1 (direct argument)
 *   ├─ methodCall1: txnArg(payment2)
 *   ├─ payment3 (direct argument)
 *   └─ methodCall2: txnArg(payment4)
 *
 * Topics covered:
 * - Parallel method composition
 * - Multiple nested method calls in one parent method
 * - Each nested call with its own transaction argument
 * - Transaction group composition for complex parallel operations
 */

async function main() {
  console.log('=== Parallel Nested Method Calls with Transaction Arguments ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr.toString())
  console.log()

  // ========================================
  // STEP 1: Deploy Test Contract
  // ========================================
  console.log('=== STEP 1: Deploying Test Contract ===\n')

  // This TEAL contract implements:
  // - txnArg(pay)address: Takes a payment transaction, returns sender address
  // - doubleNestedTxnArg(pay,appl,pay,appl)uint64: Takes 2 payments and 2 app calls, returns app ID

  const approvalProgram = `#pragma version 10

txn ApplicationID
int 0
==
bnz create

// Check if this is an ABI call
txn NumAppArgs
int 0
>
bnz check_methods

// Bare call - just approve
int 1
return

create:
// Allow bare app creation
int 1
return

check_methods:
txn ApplicationArgs 0

method "txnArg(pay)address"
==
bnz abi_route_txnArg

txn ApplicationArgs 0
method "doubleNestedTxnArg(pay,appl,pay,appl)uint64"
==
bnz abi_route_doubleNestedTxnArg

// Unknown method
int 0
return

abi_route_txnArg:
byte 0x151f7c75
txn GroupIndex
int 1
-
dup
gtxns TypeEnum
int pay
==
assert
callsub txnArg
concat
log
int 1
return

txnArg:
proto 1 1
frame_dig -1
gtxns Sender
retsub

abi_route_doubleNestedTxnArg:
byte 0x151f7c75
txn GroupIndex
int 1
-
dup
gtxns TypeEnum
int appl
==
assert
txn GroupIndex
int 2
-
dup
gtxns TypeEnum
int pay
==
assert
txn GroupIndex
int 3
-
dup
gtxns TypeEnum
int appl
==
assert
txn GroupIndex
int 4
-
dup
gtxns TypeEnum
int pay
==
assert
callsub doubleNestedTxnArg
itob
concat
log
int 1
return

doubleNestedTxnArg:
proto 4 1
frame_dig -2
gtxns ApplicationID
retsub`

  const clearProgram = '#pragma version 10\nint 1\nreturn'

  console.log('Deploying test contract...')
  const appResult = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 0,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  })

  const appId = appResult.appId
  console.log('✅ Test contract deployed with ID:', appId)
  console.log()

  // ========================================
  // STEP 2: Define ABI Methods
  // ========================================
  console.log('=== STEP 2: Defining ABI Methods ===\n')

  const txnArgMethod = new algosdk.ABIMethod({
    name: 'txnArg',
    args: [{ type: 'pay', name: 'txn' }],
    returns: { type: 'address' },
  })

  const doubleNestedTxnArgMethod = new algosdk.ABIMethod({
    name: 'doubleNestedTxnArg',
    args: [
      { type: 'pay', name: 'txn0' },
      { type: 'appl', name: 'call1' },
      { type: 'pay', name: 'txn2' },
      { type: 'appl', name: 'call3' },
    ],
    returns: { type: 'uint64' },
  })

  console.log('ABI Methods defined:')
  console.log('  - txnArg(pay)address: Takes a payment transaction, returns sender')
  console.log('  - doubleNestedTxnArg(pay,appl,pay,appl)uint64:')
  console.log('    Takes 2 payment transactions and 2 app calls, returns app ID')
  console.log()

  // ========================================
  // STEP 3: Create First Nested Method Call
  // ========================================
  console.log('=== STEP 3: Creating First Nested Method Call ===\n')

  console.log('Creating first nested call: txnArg with payment of 0 microAlgos')
  console.log('This will be passed as the 2nd argument (call1) to doubleNestedTxnArg')
  console.log()

  const firstTxnCall: AppCallMethodCall = {
    sender: deployer.addr,
    appId: appId,
    method: txnArgMethod,
    args: [
      algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: deployer.addr,
        amount: (0).microAlgo(),
      }),
    ],
  }

  console.log('✅ First nested call configured:')
  console.log('   Method: txnArg(pay)address')
  console.log('   Payment amount: 0 microAlgos')
  console.log()

  // ========================================
  // STEP 4: Create Second Nested Method Call
  // ========================================
  console.log('=== STEP 4: Creating Second Nested Method Call ===\n')

  console.log('Creating second nested call: txnArg with payment of 1 microAlgo')
  console.log('This will be passed as the 4th argument (call3) to doubleNestedTxnArg')
  console.log('Adding a note to differentiate from the first call')
  console.log()

  const secondTxnCall: AppCallMethodCall = {
    sender: deployer.addr,
    appId: appId,
    method: txnArgMethod,
    args: [
      algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: deployer.addr,
        amount: (1).microAlgo(),
      }),
    ],
    note: new Uint8Array([1]), // Differentiate from first call
  }

  console.log('✅ Second nested call configured:')
  console.log('   Method: txnArg(pay)address')
  console.log('   Payment amount: 1 microAlgo')
  console.log('   Note: [1] (to differentiate)')
  console.log()

  // ========================================
  // STEP 5: Call Parent Method with Both Nested Calls
  // ========================================
  console.log('=== STEP 5: Calling Parent Method with Parallel Nested Calls ===\n')

  console.log('Calling doubleNestedTxnArg with:')
  console.log('  - Argument 1: undefined (placeholder for payment from firstTxnCall)')
  console.log('  - Argument 2: firstTxnCall (app call with payment)')
  console.log('  - Argument 3: undefined (placeholder for payment from secondTxnCall)')
  console.log('  - Argument 4: secondTxnCall (app call with payment)')
  console.log()

  console.log('The composer will build a transaction group with:')
  console.log('  1. Payment (0 µA) for firstTxnCall')
  console.log('  2. App call to txnArg (firstTxnCall)')
  console.log('  3. Payment (1 µA) for secondTxnCall')
  console.log('  4. App call to txnArg (secondTxnCall)')
  console.log('  5. App call to doubleNestedTxnArg (parent)')
  console.log()

  const doubleNestedResult = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: appId,
      method: doubleNestedTxnArgMethod,
      // undefined = placeholder for payments that come from nested calls
      args: [undefined, firstTxnCall, undefined, secondTxnCall],
    })
    .send()

  console.log('✅ Transaction group sent successfully!')
  console.log()
  console.log('Transaction IDs:', doubleNestedResult.txIds)
  console.log()

  console.log('Return values from the transaction group:')
  if (doubleNestedResult.returns && doubleNestedResult.returns.length >= 3) {
    const firstReturn = doubleNestedResult.returns[0].returnValue?.valueOf()
    const secondReturn = doubleNestedResult.returns[1].returnValue?.valueOf()
    const thirdReturn = doubleNestedResult.returns[2].returnValue?.valueOf()

    console.log(`  1. First txnArg call returned: ${firstReturn}`)
    console.log(`     (sender address from first payment)`)
    console.log()
    console.log(`  2. Second txnArg call returned: ${secondReturn}`)
    console.log(`     (sender address from second payment)`)
    console.log()
    console.log(`  3. doubleNestedTxnArg call returned: ${thirdReturn}`)
    console.log(`     (app ID from call1)`)
  }
  console.log()

  // ========================================
  // STEP 6: Verify Transaction Group Structure
  // ========================================
  console.log('=== STEP 6: Transaction Group Analysis ===\n')

  console.log('Transaction group structure:')
  console.log(`  Total transactions: ${doubleNestedResult.txIds.length}`)
  console.log('  Order of execution:')
  console.log('    [0] Payment (0 µA) - txn0 for call1')
  console.log('    [1] App call txnArg - call1 (uses txn [0])')
  console.log('    [2] Payment (1 µA) - txn2 for call3')
  console.log('    [3] App call txnArg - call3 (uses txn [2])')
  console.log('    [4] App call doubleNestedTxnArg - parent (uses all previous txns)')
  console.log()

  console.log('Key observations:')
  console.log('  • All 5 transactions execute atomically')
  console.log('  • Each nested call has its own payment transaction')
  console.log('  • The parent method references all 4 preceding transactions')
  console.log('  • Transaction order is depth-first (innermost transactions first)')
  console.log()

  // ========================================
  // Summary
  // ========================================
  console.log('=== Summary ===\n')

  console.log('Key Concepts Demonstrated:')
  console.log('  ✅ Parallel method composition - multiple nested calls in one method')
  console.log('  ✅ Each nested call has its own transaction argument')
  console.log('  ✅ Parent method accepts multiple method call arguments')
  console.log('  ✅ Automatic transaction group composition by AlgoKit Utils')
  console.log('  ✅ Atomic execution of all transactions in the group')
  console.log()

  console.log('Transaction Group Pattern:')
  console.log('  • Methods can accept multiple method call arguments')
  console.log('  • Each nested method call can have transaction arguments')
  console.log('  • All transactions are composed into a single atomic group')
  console.log('  • The composer handles transaction ordering automatically')
  console.log('  • Use undefined for transaction placeholders in parent call')
  console.log()

  console.log('Use Cases:')
  console.log('  • Multi-party transactions requiring parallel verification')
  console.log('  • Batch operations with multiple payment validations')
  console.log('  • Complex DeFi protocols with parallel collateral checks')
  console.log('  • Cross-contract calls requiring multiple proofs')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
