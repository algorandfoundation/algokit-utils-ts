import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppCallMethodCall } from '@algorandfoundation/algokit-utils/types/composer'
import algosdk from 'algosdk'

/**
 * Nested Method Calls with Transaction Arguments
 *
 * This example demonstrates how to compose method calls where a method takes
 * another method call as an argument, and that nested method call itself takes
 * a transaction as an argument.
 *
 * Scenario:
 * 1. Deploy a smart contract with methods that accept transaction arguments
 * 2. Create a method call that takes a payment transaction as an argument
 * 3. Pass that method call as an argument to another method
 * 4. Execute the nested composition atomically
 *
 * Topics covered:
 * - Creating ABI methods that accept transaction arguments
 * - Composing nested method calls
 * - Using AppCallMethodCall type for nested calls
 * - Transaction group composition for complex interactions
 */

async function main() {
  console.log('=== Nested Method Calls with Transaction Arguments ===\n')

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
  // - helloWorld()string: Returns "Hello, World!"
  // - methodArg(appl)uint64: Takes an app call, returns app ID
  // - nestedTxnArg(pay,appl)uint64: Takes payment and app call, returns app ID

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
method "helloWorld()string"
==
bnz abi_route_helloWorld

txn ApplicationArgs 0
method "methodArg(appl)uint64"
==
bnz abi_route_methodArg

txn ApplicationArgs 0
method "nestedTxnArg(pay,appl)uint64"
==
bnz abi_route_nestedTxnArg

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

abi_route_helloWorld:
byte 0x151f7c75
callsub helloWorld
dup
len
itob
extract 6 2
swap
concat
concat
log
int 1
return

helloWorld:
proto 0 1
byte "Hello, World!"
retsub

abi_route_methodArg:
byte 0x151f7c75
txn GroupIndex
int 1
-
dup
gtxns TypeEnum
int appl
==
assert
callsub methodArg
itob
concat
log
int 1
return

methodArg:
proto 1 1
frame_dig -1
gtxns ApplicationID
retsub

abi_route_nestedTxnArg:
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
callsub nestedTxnArg
itob
concat
log
int 1
return

nestedTxnArg:
proto 2 1
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

  const helloWorldMethod = new algosdk.ABIMethod({
    name: 'helloWorld',
    args: [],
    returns: { type: 'string' },
  })

  const methodArgMethod = new algosdk.ABIMethod({
    name: 'methodArg',
    args: [{ type: 'appl', name: 'call' }],
    returns: { type: 'uint64' },
  })

  const nestedTxnArgMethod = new algosdk.ABIMethod({
    name: 'nestedTxnArg',
    args: [
      { type: 'pay', name: 'txn' },
      { type: 'appl', name: 'call' },
    ],
    returns: { type: 'uint64' },
  })

  console.log('ABI Methods defined:')
  console.log('  - txnArg(pay)address: Takes a payment transaction, returns sender')
  console.log('  - helloWorld()string: Returns "Hello, World!"')
  console.log('  - methodArg(appl)uint64: Takes an app call, returns app ID')
  console.log('  - nestedTxnArg(pay,appl)uint64: Takes payment and app call, returns app ID')
  console.log()

  // ========================================
  // STEP 3: Simple Method with Transaction Argument
  // ========================================
  console.log('=== STEP 3: Method with Transaction Argument ===\n')

  console.log('Calling txnArg method with a payment transaction...')
  console.log('This method takes a payment transaction and returns the sender address')
  console.log()

  const txnRes = await algorand
    .newGroup()
    .addAppCallMethodCall({
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
    })
    .send()

  console.log('✅ Transaction successful!')
  console.log(`   Returned address: ${txnRes.returns?.[0].returnValue?.valueOf()}`)
  console.log(`   Expected: ${deployer.addr.toString()}`)
  console.log()

  // ========================================
  // STEP 4: Simple Method Call as Argument
  // ========================================
  console.log('=== STEP 4: Method Call as Argument ===\n')

  console.log('Step 4.1: Define a method call (helloWorld) to pass as an argument')
  console.log()

  // Define the inner method call
  const helloWorldCall: AppCallMethodCall = {
    sender: deployer.addr,
    appId: appId,
    method: helloWorldMethod,
  }

  console.log('Step 4.2: Pass that method call to methodArg')
  console.log('This demonstrates passing a method call as an argument')
  console.log()

  const methodArgRes = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: appId,
      method: methodArgMethod,
      args: [helloWorldCall],
    })
    .send()

  console.log('✅ Nested method call successful!')
  console.log(`   First return (helloWorld): ${methodArgRes.returns?.[0].returnValue?.valueOf()}`)
  console.log(`   Second return (app ID): ${methodArgRes.returns?.[1].returnValue?.valueOf()}`)
  console.log()

  // ========================================
  // STEP 5: Nested Method Call with Transaction Argument
  // ========================================
  console.log('=== STEP 5: Nested Method Call with Transaction Argument ===\n')

  console.log('This is the advanced pattern:')
  console.log('  1. Create a method call (txnArg) that takes a payment transaction')
  console.log('  2. Pass that method call to another method (nestedTxnArg)')
  console.log('  3. Execute everything atomically in one group')
  console.log()

  console.log('Step 5.1: Create the inner method call (txnArg) with payment transaction')
  console.log()

  // Define the inner method call that takes a transaction as an argument
  const txnArgCall: AppCallMethodCall = {
    sender: deployer.addr,
    appId: appId,
    method: txnArgMethod,
    // The payment transaction is passed as an argument to the method
    args: [
      algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: deployer.addr,
        amount: (0).microAlgo(),
      }),
    ],
  }

  console.log('Inner method call configured:')
  console.log('  - Method: txnArg(pay)address')
  console.log('  - Argument: Payment transaction (0 microAlgos)')
  console.log()

  console.log('Step 5.2: Create the outer method call (nestedTxnArg)')
  console.log('This method takes a payment and an app call as arguments')
  console.log()

  // Build and send the transaction group with nested method calls
  const nestedTxnArgRes = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId: appId,
      method: nestedTxnArgMethod,
      // First arg: undefined (placeholder payment, will be inserted by composer)
      // Second arg: the nested method call
      args: [undefined, txnArgCall],
    })
    .send()

  console.log('✅ Nested transaction argument call successful!')
  console.log()
  console.log('Transaction group contained:')
  console.log('  1. Payment transaction (for txnArg)')
  console.log('  2. App call to txnArg method')
  console.log('  3. App call to nestedTxnArg method')
  console.log()

  console.log('Return values:')
  console.log(`  - First return (sender address from txnArg): ${nestedTxnArgRes.returns?.[0].returnValue?.valueOf()}`)
  console.log(`  - Second return (app ID from nestedTxnArg): ${nestedTxnArgRes.returns?.[1].returnValue?.valueOf()}`)
  console.log()

  // ========================================
  // Summary
  // ========================================
  console.log('=== Summary ===\n')

  console.log('Key Concepts Demonstrated:')
  console.log('  ✅ Methods can accept transaction arguments')
  console.log('  ✅ Methods can accept other method calls as arguments')
  console.log('  ✅ Method calls can have transaction arguments and be passed to other methods')
  console.log('  ✅ All nested calls execute atomically in a transaction group')
  console.log()

  console.log('Transaction Group Composition:')
  console.log('  • When you pass a method call with a transaction argument to another method')
  console.log('  • The composer automatically builds a group with all transactions')
  console.log('  • Order matters: transactions are referenced by their position in the group')
  console.log('  • Everything succeeds or fails atomically')
  console.log()

  console.log('Use Cases:')
  console.log('  • Complex DeFi operations requiring multiple steps')
  console.log('  • Protocols with payment verification in smart contracts')
  console.log('  • Multi-contract interactions with payment flows')
  console.log('  • Composable dApp architectures')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
