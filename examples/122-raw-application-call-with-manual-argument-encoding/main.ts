import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to make a raw application call with manually encoded arguments.
 * This approach gives you fine-grained control over the call parameters and is useful when you need
 * to work directly with the low-level ABI encoding, bypassing the high-level ABI method call API.
 *
 * Use cases:
 * - Testing low-level protocol behavior
 * - Debugging ABI encoding issues
 * - Building custom tools that need direct control
 * - Working with non-standard or custom encoding schemes
 */

async function rawAppCallExample() {
  console.log('=== Raw Application Call with Manual Argument Encoding ===')
  console.log()
  console.log('This example demonstrates making a raw app call with manually')
  console.log('encoded arguments, giving you full control over the encoding.')
  console.log()

  // Initialize AlgorandClient - connects to your Algorand node
  const algorand = AlgorandClient.defaultLocalNet()

  // Get account from LocalNet
  const sender = (await algorand.account.localNetDispenser()).account

  console.log('Account:', sender.addr.toString())
  console.log()

  // Deploy a smart contract with a doMath method
  console.log('Deploying smart contract...')

  const approvalProgram = `#pragma version 10
// This contract has a doMath method that takes two uint64s and a string operation

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

// doMath(uint64,uint64,string)uint64
txn ApplicationArgs 0
method "doMath(uint64,uint64,string)uint64"
==
bnz do_math

int 0
return

do_math:
// Get the two numbers (args 1 and 2)
txn ApplicationArgs 1
btoi
txn ApplicationArgs 2
btoi

// Get the operation (arg 3) - ABI encoded string
// ABI string format: 2-byte length prefix + string bytes
txn ApplicationArgs 3
extract 2 0  // Skip the 2-byte length prefix to get raw string
byte "sum"
==
bnz operation_sum

// If not sum, just return 0 for this example
int 0
b encode_result

operation_sum:
// Add the two numbers
+

encode_result:
// Encode the result as ABI uint64
itob

// Prepend ABI return prefix
byte 0x151f7c75 // ABI return prefix for uint64
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
      name: 'MathApp',
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

  console.log('=== Method Selector Calculation ===')
  console.log()

  // Get the ABI method and its selector
  const doMathMethod = new algosdk.ABIMethod({
    name: 'doMath',
    args: [
      { type: 'uint64', name: 'a', desc: 'First number' },
      { type: 'uint64', name: 'b', desc: 'Second number' },
      { type: 'string', name: 'op', desc: 'Operation' },
    ],
    returns: { type: 'uint64', desc: 'Result' },
  })

  const methodSelector = doMathMethod.getSelector()
  console.log('Method signature:', doMathMethod.getSignature())
  console.log('Method selector (hex):', Buffer.from(methodSelector).toString('hex'))
  console.log('Method selector (bytes):', Array.from(methodSelector))
  console.log()

  console.log('=== Manual Argument Encoding ===')
  console.log()

  // Manually encode the arguments
  const arg1 = algosdk.encodeUint64(5)
  const arg2 = algosdk.encodeUint64(3)
  const arg3 = Uint8Array.from(Buffer.from('AANzdW0=', 'base64')) // "sum" encoded

  console.log('Argument 1 (uint64: 5):', Array.from(arg1))
  console.log('Argument 2 (uint64: 3):', Array.from(arg2))
  console.log('Argument 3 (string: "sum"):', Array.from(arg3))
  console.log()

  console.log('=== Making Raw Application Call ===')
  console.log()

  // Get balance before
  const balanceBefore = await algorand.account.getInformation(sender.addr)
  console.log('Balance before:', balanceBefore.balance.algos.toFixed(6), 'ALGO')
  console.log()

  // Create a transaction group with:
  // 1. A payment transaction
  // 2. A raw app call with manually encoded arguments
  const result = await algorand
    .newGroup()
    // Add a payment transaction (just to demonstrate atomic groups)
    .addPayment({
      sender: sender.addr,
      receiver: sender.addr,
      amount: (0).microAlgo(),
      note: new TextEncoder().encode('Payment in group'),
    })
    // Add a raw app call with manually encoded arguments
    .addAppCall({
      sender: sender.addr,
      appId: appResult.appId,
      args: [
        methodSelector, // Method selector (first 4 bytes of method signature hash)
        arg1, // First argument: uint64 value 5
        arg2, // Second argument: uint64 value 3
        arg3, // Third argument: operation ("sum")
      ],
      note: new TextEncoder().encode('Raw app call'),
    })
    .execute()

  console.log('✅ Transaction group executed successfully!')
  console.log()
  console.log('   Transaction IDs:')
  console.log(`     [0] ${result.txIds[0]} (Payment)`)
  console.log(`     [1] ${result.txIds[1]} (Raw App Call)`)
  console.log('   Group ID:', result.groupId)
  console.log('   Confirmed in round:', result.confirmations[0]!.confirmedRound!.toString())
  console.log()

  // Get balance after
  const balanceAfter = await algorand.account.getInformation(sender.addr)
  console.log('   Balance after:', balanceAfter.balance.algos.toFixed(6), 'ALGO')
  console.log('   Fees paid:', (balanceBefore.balance.microAlgos - balanceAfter.balance.microAlgos).toString(), 'microALGOs')
  console.log()

  // Check if there are logs from the app call
  console.log('=== Application Call Result ===')
  console.log()

  if (result.confirmations[1].logs && result.confirmations[1].logs.length > 0) {
    const logData = Buffer.from(result.confirmations[1].logs[0])
    console.log('App call log output (hex):', logData.toString('hex'))

    // Decode the result
    // The log should contain: ABI return prefix (4 bytes) + uint64 result (8 bytes)
    if (logData.length >= 12) {
      const returnPrefix = logData.subarray(0, 4).toString('hex')
      const resultBytes = logData.subarray(4, 12)
      const resultValue = algosdk.decodeUint64(resultBytes, 'safe')

      console.log('   Return prefix:', returnPrefix)
      console.log('   Result value:', resultValue.toString())
      console.log('   Expected: 8 (5 + 3)')
      console.log('   Match:', resultValue === 8 ? '✅' : '❌')
    }
  }
  console.log()

  console.log('=== What Happened ===')
  console.log()
  console.log('1. We calculated the method selector from the signature')
  console.log('2. We manually encoded each argument using algosdk functions')
  console.log('3. We created a raw app call with the encoded arguments')
  console.log('4. The app processed the arguments and returned the result')
  console.log('5. We decoded the result from the logs')
  console.log()

  console.log('=== Comparison: ABI Method Call vs Raw Call ===')
  console.log()
  console.log('High-level ABI method call:')
  console.log('  await algorand.newGroup().addAppCallMethodCall({')
  console.log('    method: doMathMethod,')
  console.log('    args: [5, 3, "sum"], // Automatically encoded')
  console.log('  }).send()')
  console.log()
  console.log('Low-level raw call (this example):')
  console.log('  await algorand.newGroup().addAppCall({')
  console.log('    args: [')
  console.log('      methodSelector,        // Must provide selector')
  console.log('      algosdk.encodeUint64(5), // Manual encoding')
  console.log('      algosdk.encodeUint64(3), // Manual encoding')
  console.log('      encodedString("sum"),  // Manual encoding')
  console.log('    ]')
  console.log('  }).execute()')
  console.log()

  console.log('=== Key Takeaways ===')
  console.log()
  console.log('✓ Raw app calls require manual argument encoding')
  console.log('✓ Method selectors are the first 4 bytes of keccak256(signature)')
  console.log('✓ Use algosdk.encodeUint64(), encodeAddress(), etc. for encoding')
  console.log('✓ Results must be manually decoded from logs')
  console.log('✓ Use .execute() instead of .send() for raw calls')
  console.log('✓ Useful for debugging, testing, and custom encoding scenarios')
  console.log()

  console.log('=== When to Use Raw Calls ===')
  console.log()
  console.log('Prefer ABI method calls (.addAppCallMethodCall) unless you need:')
  console.log('  • Direct control over encoding (debugging, testing)')
  console.log('  • Custom encoding not supported by ABI')
  console.log('  • Low-level protocol testing')
  console.log('  • Building tools that need fine-grained control')
  console.log()

  console.log('✨ Example completed successfully!')
}

// Run the example
rawAppCallExample().catch(console.error)
