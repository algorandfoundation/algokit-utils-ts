import { AlgorandClient, microAlgos } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to simulate a transaction group before sending it.
 *
 * Transaction simulation is a powerful feature that allows you to:
 * - Test transaction logic without committing to the blockchain
 * - Preview execution results and return values
 * - Estimate costs and resource requirements (opcode budget, fees, etc.)
 * - Validate transaction logic before execution
 * - Debug smart contract behavior
 *
 * This example shows:
 * 1. Creating a simple smart contract with methods
 * 2. Building a transaction group with multiple transactions
 * 3. Simulating the group to preview results
 * 4. Sending the actual transaction group
 * 5. Comparing simulation results with actual execution
 */

async function main() {
  console.log('=== Simulate Transaction Group Before Sending ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr.toString())
  console.log()

  // Define a simple approval program with ABI methods
  const approvalProgram = `#pragma version 10

txn ApplicationID
int 0
==
bnz create

// Check for ABI method calls
txn NumAppArgs
int 0
>
bnz check_methods

// Default: approve
int 1
return

create:
// Initialize global state during creation
byte "counter"
int 0
app_global_put

byte "message"
byte "initialized"
app_global_put

int 1
return

check_methods:
// Check which ABI method is being called
txn ApplicationArgs 0
method "increment()uint64"
==
bnz method_increment

txn ApplicationArgs 0
method "get_value()uint64"
==
bnz method_get_value

txn ApplicationArgs 0
method "set_message(string)string"
==
bnz method_set_message

// Unknown method
int 0
return

method_increment:
// Increment counter and return new value
byte "counter"
app_global_get
int 1
+

// Store the new value
byte "counter"
dig 1
app_global_put

// Return the new value (still on stack)
itob
byte 0x151f7c75  // ABI return prefix for uint64
swap
concat
log

int 1
return

method_get_value:
// Return current counter value
byte "counter"
app_global_get
itob
byte 0x151f7c75  // ABI return prefix for uint64
swap
concat
log

int 1
return

method_set_message:
// Set message and return confirmation
txna ApplicationArgs 1
dup
dup

// Set in global state
byte "message"
dig 1
app_global_put

// Return success message (just return the string that was set)
len
itob
extract 6 2  // Get last 2 bytes for uint16 length
swap
concat
byte 0x151f7c75  // ABI return prefix for string
swap
concat
log

int 1
return`

  const clearProgram = `#pragma version 10
int 1
return`

  console.log('=== Step 1: Deploy Smart Contract ===')
  console.log('Contract features:')
  console.log('  - increment(): Increments counter and returns new value')
  console.log('  - get_value(): Returns current counter value')
  console.log('  - set_message(string): Sets a message and returns confirmation')
  console.log()

  const appResult = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 1,
      localInts: 0,
      localByteSlices: 0,
    },
  })

  const appId = appResult.appId
  const appAddress = algosdk.getApplicationAddress(appId)

  console.log('✅ App deployed successfully!')
  console.log('   App ID:', appId)
  console.log('   App Address:', appAddress.toString())
  console.log()

  // Fund the app account to meet minimum balance
  await algorand.send.payment({
    sender: deployer.addr,
    receiver: appAddress,
    amount: microAlgos(200_000), // 0.2 ALGO (to meet minimum balance)
  })

  console.log('✅ App account funded with 0.2 ALGO')
  console.log()

  // Read initial state
  const appInfo = await algorand.client.algod.getApplicationByID(Number(appId)).do()
  const globalState = appInfo.params.globalState || []

  console.log('Initial Global State:')
  for (const state of globalState) {
    const key = Buffer.from(state.key as Uint8Array).toString()
    const valueType = state.value.type
    const value = valueType === 1 ? Buffer.from(state.value.bytes as Uint8Array).toString() : state.value.uint

    console.log(`   ${key}: ${value}`)
  }
  console.log()

  console.log('=== Step 2: Build Transaction Group ===')
  console.log('Creating a group with 3 transactions:')
  console.log('  1. App call: increment() - Increment counter')
  console.log('  2. Payment: Send 0.001 ALGO to app address')
  console.log('  3. App call: set_message(string) - Update message')
  console.log()

  // Define ABI methods
  const incrementMethod = new algosdk.ABIMethod({
    name: 'increment',
    args: [],
    returns: { type: 'uint64' },
  })

  const setMessageMethod = new algosdk.ABIMethod({
    name: 'set_message',
    args: [{ type: 'string', name: 'message' }],
    returns: { type: 'string' },
  })

  console.log('=== Step 3: Simulate Transaction Group ===')
  console.log('Simulating without committing to blockchain...')
  console.log()

  const simulateResult = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: incrementMethod,
      args: [],
    })
    .addPayment({
      sender: deployer.addr,
      receiver: appAddress,
      amount: microAlgos(1_000), // 0.001 ALGO
    })
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: setMessageMethod,
      args: ['Hello from simulation!'],
    })
    .simulate({ allowEmptySignatures: true })

  console.log('Simulation Results:')
  console.log('   Number of transactions:', simulateResult.simulateResponse.txnGroups[0].txnResults.length)
  console.log('   Failed transactions:', simulateResult.simulateResponse.txnGroups[0].failedAt || 'None')
  console.log()

  // Extract return values from simulation
  const txnResults = simulateResult.simulateResponse.txnGroups[0].txnResults

  console.log('Transaction Results:')
  txnResults.forEach((result, index) => {
    console.log(`\n   Transaction ${index + 1}:`)

    if (result.txnResult.logs && result.txnResult.logs.length > 0) {
      console.log(`      Logs: ${result.txnResult.logs.length} log(s)`)

      // Try to decode ABI return value from the last log
      const lastLog = result.txnResult.logs[result.txnResult.logs.length - 1]
      const logBuffer = Buffer.from(lastLog)

      // Check if it's an ABI return (starts with 0x151f7c75)
      if (logBuffer.length > 4 && logBuffer.readUInt32BE(0) === 0x151f7c75) {
        const returnValue = logBuffer.subarray(4)
        console.log(`      ABI Return (raw): ${returnValue.toString('hex')}`)

        // Try to decode based on transaction index
        if (index === 0) {
          // increment() returns uint64
          if (returnValue.length === 8) {
            const value = returnValue.readBigUInt64BE(0)
            console.log(`      ABI Return (decoded): ${value} (counter value)`)
          }
        } else if (index === 2) {
          // set_message() returns string
          const strLen = returnValue.readUInt16BE(0)
          const str = returnValue.subarray(2, 2 + strLen).toString()
          console.log(`      ABI Return (decoded): "${str}"`)
        }
      }
    }
  })
  console.log()

  console.log('=== Understanding Simulation ===\n')
  console.log('What simulation does:')
  console.log('  ✓ Executes transaction logic locally')
  console.log('  ✓ Returns method results and logs')
  console.log('  ✓ Shows opcode cost and resource usage')
  console.log('  ✓ Validates transaction will succeed')
  console.log('  ✗ Does NOT modify blockchain state')
  console.log('  ✗ Does NOT consume fees or ALGO')
  console.log()

  console.log('Benefits of simulation:')
  console.log('  • Test complex transaction groups before sending')
  console.log('  • Debug smart contract logic')
  console.log('  • Estimate costs (fees, opcode budget)')
  console.log('  • Validate inputs and expected outputs')
  console.log('  • Avoid failed transactions on-chain')
  console.log()

  console.log('=== Step 4: Send Actual Transaction Group ===')
  console.log('Now sending the transaction group to the blockchain...')
  console.log()

  const sendResult = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: incrementMethod,
      args: [],
    })
    .addPayment({
      sender: deployer.addr,
      receiver: appAddress,
      amount: microAlgos(1_000), // 0.001 ALGO
    })
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: setMessageMethod,
      args: ['Hello from actual execution!'],
    })
    .send()

  console.log('✅ Transaction group sent successfully!')
  console.log('   Transaction IDs:', sendResult.txIds)
  console.log('   Number of transactions:', sendResult.txIds.length)
  console.log()

  // Extract return values from actual execution
  console.log('Actual Execution Results:')
  if (sendResult.returns) {
    sendResult.returns.forEach((returnValue, index) => {
      console.log(`   Return ${index + 1}:`, returnValue)
    })
  }
  console.log()

  // Read final state
  const finalAppInfo = await algorand.client.algod.getApplicationByID(Number(appId)).do()
  const finalGlobalState = finalAppInfo.params.globalState || []

  console.log('Final Global State (after execution):')
  for (const state of finalGlobalState) {
    const key = Buffer.from(state.key as Uint8Array).toString()
    const valueType = state.value.type
    const value = valueType === 1 ? Buffer.from(state.value.bytes as Uint8Array).toString() : state.value.uint

    console.log(`   ${key}: ${value}`)
  }
  console.log()

  console.log('=== Comparison ===\n')
  console.log('Simulation vs Actual Execution:')
  console.log('   Simulated transaction count:', txnResults.length)
  console.log('   Actual transaction count:', sendResult.txIds.length)
  console.log('   Counts match:', txnResults.length === sendResult.txIds.length ? '✅ YES' : '❌ NO')
  console.log()

  console.log('Key Differences:')
  console.log('   • Simulation: No blockchain changes, no fees consumed')
  console.log('   • Actual: Blockchain updated, fees paid, state changed')
  console.log('   • Simulation: Used for validation and testing')
  console.log('   • Actual: Used for production execution')
  console.log()

  console.log('=== Common Use Cases ===\n')

  console.log('1. Testing Complex Logic')
  console.log('   Simulate multi-step transactions to verify logic before execution')
  console.log()

  console.log('2. Cost Estimation')
  console.log('   Preview opcode budget usage and transaction fees')
  console.log()

  console.log('3. Debugging')
  console.log('   Inspect logs and return values to debug smart contracts')
  console.log()

  console.log('4. Validation')
  console.log('   Ensure transactions will succeed before committing')
  console.log()

  console.log('5. User Experience')
  console.log('   Show users expected results before they confirm transactions')
  console.log()

  console.log('=== Best Practices ===\n')

  console.log('1. Always Simulate Complex Groups')
  console.log('   • Multi-transaction atomic groups')
  console.log('   • App calls with side effects')
  console.log('   • Transactions with variable outcomes')
  console.log()

  console.log('2. Use allowEmptySignatures for Preview')
  console.log('   • Set allowEmptySignatures: true to skip signing')
  console.log('   • Faster simulation without private keys')
  console.log('   • Good for read-only previews')
  console.log()

  console.log('3. Check Simulation Results')
  console.log('   • Verify no failedAt errors')
  console.log('   • Inspect logs for expected output')
  console.log('   • Validate return values match expectations')
  console.log()

  console.log('4. Don\'t Rely on Simulation for Production Logic')
  console.log('   • Simulation != actual execution')
  console.log('   • Blockchain state may change between simulation and send')
  console.log('   • Use simulation for validation, not as a substitute for sending')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
