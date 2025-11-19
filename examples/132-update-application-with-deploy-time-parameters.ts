import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to update an application with different
 * deploy-time parameters by using TEAL template substitution.
 *
 * Deploy-time parameters are values that are:
 * - Substituted into the TEAL code before compilation
 * - Hard-coded into the compiled program
 * - Cannot be changed without updating the application
 * - Useful for configuration values that should be immutable per deployment
 *
 * This example shows:
 * 1. Creating an application with a deploy-time parameter (max_value = 100)
 * 2. Updating the application with a different parameter (max_value = 200)
 * 3. Verifying the parameter change by testing the new limit
 */

async function main() {
  console.log('=== Update Application with Deploy-Time Parameters ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr.toString())
  console.log()

  // Function to create TEAL with template substitution
  function createApprovalProgram(maxValue: number): string {
    return `#pragma version 10

txn ApplicationID
int 0
==
bnz create

// Handle regular app calls
txn NumAppArgs
int 0
>
bnz check_methods

// Default: approve
int 1
return

create:
// Initialize counter
byte "counter"
int 0
app_global_put

// Store the max_value (deploy-time parameter)
byte "max_value"
int ${maxValue}
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
method "get_counter()uint64"
==
bnz method_get_counter

txn ApplicationArgs 0
method "get_max_value()uint64"
==
bnz method_get_max_value

// Unknown method
int 0
return

method_increment:
// Get current counter
byte "counter"
app_global_get

// Increment it
int 1
+

// Check against max_value (deploy-time parameter)
dup
int ${maxValue}  // This is the hard-coded max value
<=
assert  // Reject if exceeds max

// Store new value
byte "counter"
dig 1
app_global_put

// Return new value
itob
byte 0x151f7c75  // ABI return prefix
swap
concat
log

int 1
return

method_get_counter:
// Return current counter
byte "counter"
app_global_get
itob
byte 0x151f7c75
swap
concat
log

int 1
return

method_get_max_value:
// Return max_value
byte "max_value"
app_global_get
itob
byte 0x151f7c75
swap
concat
log

int 1
return`
  }

  const clearProgram = `#pragma version 10
int 1
return`

  console.log('=== Step 1: Deploy Initial Application (max_value = 100) ===')
  console.log('Creating application with max_value = 100...')
  console.log()

  // Create initial application with max_value = 100
  const approvalProgramV1 = createApprovalProgram(100)

  const createResult = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: approvalProgramV1,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 2,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  })

  const appId = createResult.appId
  const appAddress = algosdk.getApplicationAddress(appId)

  console.log('✅ Application created successfully!')
  console.log('   App ID:', appId)
  console.log('   App Address:', appAddress.toString())
  console.log()

  // Read initial state
  let appInfo = await algorand.client.algod.getApplicationByID(Number(appId)).do()
  let globalState = appInfo.params.globalState || []

  console.log('Initial Global State:')
  for (const state of globalState) {
    const key = Buffer.from(state.key as Uint8Array).toString()
    const value = state.value.uint || 0
    console.log(`   ${key}: ${value}`)
  }
  console.log()

  // Define ABI methods
  const incrementMethod = new algosdk.ABIMethod({
    name: 'increment',
    args: [],
    returns: { type: 'uint64' },
  })

  const getCounterMethod = new algosdk.ABIMethod({
    name: 'get_counter',
    args: [],
    returns: { type: 'uint64' },
  })

  const getMaxValueMethod = new algosdk.ABIMethod({
    name: 'get_max_value',
    args: [],
    returns: { type: 'uint64' },
  })

  // Test v1 functionality
  console.log('=== Testing v1 (max_value = 100) ===')

  console.log('Getting max_value...')
  const maxValue1Result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: getMaxValueMethod,
      args: [],
      note: new TextEncoder().encode('get-max-v1'),
    })
    .send()

  if (maxValue1Result.returns && maxValue1Result.returns.length > 0) {
    console.log('   Max value:', maxValue1Result.returns[0].returnValue)
  }
  console.log()

  // Increment counter multiple times up to the limit
  console.log('Incrementing counter to test limit...')
  for (let i = 0; i < 5; i++) {
    const result = await algorand
      .newGroup()
      .addAppCallMethodCall({
        sender: deployer.addr,
        appId,
        method: incrementMethod,
        args: [],
        note: new TextEncoder().encode(`increment-v1-${i}`),
      })
      .send()

    if (result.returns && result.returns.length > 0) {
      console.log(`   Increment ${i + 1}: counter = ${result.returns[0].returnValue}`)
    }
  }
  console.log()

  console.log('Getting current counter...')
  const counter1Result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: getCounterMethod,
      args: [],
      note: new TextEncoder().encode('get-counter-v1'),
    })
    .send()

  if (counter1Result.returns && counter1Result.returns.length > 0) {
    console.log('   Counter:', counter1Result.returns[0].returnValue)
  }
  console.log()

  console.log('=== Step 2: Update Application (max_value = 200) ===')
  console.log('Updating to max_value = 200...')
  console.log()

  // Create updated approval program with max_value = 200
  const approvalProgramV2 = createApprovalProgram(200)

  // Update the application
  const updateResult = await algorand.send.appUpdate({
    sender: deployer.addr,
    appId,
    approvalProgram: approvalProgramV2,
    clearStateProgram: clearProgram,
  })

  console.log('✅ Application updated successfully!')
  console.log('   Transaction ID:', updateResult.txIds[0])
  console.log()

  // Verify app ID and address unchanged
  console.log('Verification:')
  console.log('   App ID unchanged:', appId)
  console.log('   App Address unchanged:', appAddress.toString())
  console.log()

  // Read updated state
  appInfo = await algorand.client.algod.getApplicationByID(Number(appId)).do()
  globalState = appInfo.params.globalState || []

  console.log('Updated Global State:')
  for (const state of globalState) {
    const key = Buffer.from(state.key as Uint8Array).toString()
    const value = state.value.uint || 0
    console.log(`   ${key}: ${value}`)
  }
  console.log()

  // Test v2 functionality
  console.log('=== Testing v2 (max_value = 200) ===')

  console.log('Getting max_value...')
  const maxValue2Result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: getMaxValueMethod,
      args: [],
      note: new TextEncoder().encode('get-max-v2'),
    })
    .send()

  if (maxValue2Result.returns && maxValue2Result.returns.length > 0) {
    console.log('   Max value:', maxValue2Result.returns[0].returnValue)
  }
  console.log()

  // Increment beyond old limit (100) but within new limit (200)
  console.log('Incrementing beyond old limit (100) to test new limit (200)...')
  const currentCounter = counter1Result.returns?.[0].returnValue as bigint || 0n
  const incrementsNeeded = 100n - currentCounter

  for (let i = 0; i < Number(incrementsNeeded) + 5; i++) {
    const result = await algorand
      .newGroup()
      .addAppCallMethodCall({
        sender: deployer.addr,
        appId,
        method: incrementMethod,
        args: [],
        note: new TextEncoder().encode(`increment-v2-${i}`),
      })
      .send()

    if (result.returns && result.returns.length > 0) {
      const newValue = result.returns[0].returnValue
      if (i === 0 || i === Number(incrementsNeeded) - 1 || i === Number(incrementsNeeded) + 4) {
        console.log(`   Increment ${i + 1}: counter = ${newValue}`)
      } else if (i === 1) {
        console.log('   ...')
      }
    }
  }
  console.log()

  console.log('Getting final counter...')
  const counter2Result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: getCounterMethod,
      args: [],
      note: new TextEncoder().encode('get-counter-v2'),
    })
    .send()

  if (counter2Result.returns && counter2Result.returns.length > 0) {
    const finalCounter = counter2Result.returns[0].returnValue
    console.log('   Counter:', finalCounter)
    console.log('   ✅ Successfully incremented beyond old limit (100)!')
    console.log('   ✅ New limit (200) is in effect!')
  }
  console.log()

  console.log('=== Understanding Deploy-Time Parameters ===\n')

  console.log('What are deploy-time parameters?')
  console.log('  • Values substituted into TEAL code before compilation')
  console.log('  • Hard-coded into the compiled bytecode')
  console.log('  • Cannot be changed without updating the application')
  console.log('  • More efficient than reading from global state')
  console.log()

  console.log('When to use deploy-time parameters:')
  console.log('  ✓ Configuration values that should be immutable')
  console.log('  ✓ Constants that don\'t need runtime flexibility')
  console.log('  ✓ Values that should be different per deployment')
  console.log('  ✓ Optimization for frequently accessed constants')
  console.log()

  console.log('When to use global state instead:')
  console.log('  ✓ Values that need to change without redeployment')
  console.log('  ✓ Values that change based on contract logic')
  console.log('  ✓ Values that need to be updated by methods')
  console.log()

  console.log('Comparison:')
  console.log('  Deploy-time: Requires update to change, more efficient')
  console.log('  Global state: Can change via methods, uses storage')
  console.log()

  console.log('Common use cases:')
  console.log('  • Maximum supply limits')
  console.log('  • Fee percentages')
  console.log('  • Admin addresses')
  console.log('  • Feature flags for different deployments')
  console.log('  • Rate limits')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
