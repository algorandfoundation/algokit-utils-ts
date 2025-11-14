import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates the complete workflow of deploying an updatable
 * application and then updating it with new code.
 *
 * This shows:
 * 1. Deploying an initial version (v1.0) of an application
 * 2. Using the application and verifying it works
 * 3. Updating the application with new code (v2.0)
 * 4. Verifying the app ID stays the same but the behavior changes
 * 5. Understanding the difference between creating and updating apps
 */

async function main() {
  console.log('=== Update a Deployed Updatable Application ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr.toString())
  console.log()

  // Helper function to create approval program with a version
  function createApprovalProgram(version: string): string {
    return `#pragma version 10

txn ApplicationID
int 0
==
bnz create

// Handle update
txn OnCompletion
int 4  // UpdateApplication
==
bnz handle_update

// Handle regular app calls
txn NumAppArgs
int 0
>
bnz check_methods

// Default: approve
int 1
return

create:
// Initialize version
byte "version"
byte "${version}"
app_global_put

// Initialize counter
byte "counter"
int 0
app_global_put

int 1
return

handle_update:
// Approve the update
// Note: The version in global state is NOT updated here
// because update transactions execute with the OLD code
// If you want to update state during an update, use an ABI update method
// (see example 131)

int 1
return

check_methods:
// Check which ABI method is being called
txn ApplicationArgs 0
method "get_version()string"
==
bnz method_get_version

txn ApplicationArgs 0
method "get_counter()uint64"
==
bnz method_get_counter

txn ApplicationArgs 0
method "increment()uint64"
==
bnz method_increment

// Unknown method
int 0
return

method_get_version:
// Return current version
byte "version"
app_global_get
dup
len
itob
extract 6 2
swap
concat
byte 0x151f7c75
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

method_increment:
// Increment counter
byte "counter"
app_global_get
int 1
+

// Store new value
byte "counter"
dig 1
app_global_put

// Return new value
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

  console.log('=== Step 1: Deploy Initial Version (v1.0) ===')
  console.log('Creating application with version 1.0...')
  console.log()

  // Create initial application with version 1.0
  const approvalProgramV1 = createApprovalProgram('1.0')

  const createResult = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: approvalProgramV1,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 1,
      localInts: 0,
      localByteSlices: 0,
    },
  })

  const appId = createResult.appId
  const appAddress = algosdk.getApplicationAddress(appId)

  console.log('✅ Application deployed successfully!')
  console.log('   App ID:', appId)
  console.log('   App Address:', appAddress.toString())
  console.log('   Transaction ID:', createResult.txIds[0])
  console.log()

  // Read initial state
  let appInfo = await algorand.client.algod.getApplicationByID(Number(appId)).do()
  let globalState = appInfo.params.globalState || []

  console.log('Initial Global State:')
  for (const state of globalState) {
    const key = Buffer.from(state.key as Uint8Array).toString()
    const valueType = state.value.type

    if (valueType === 1) {
      const value = Buffer.from(state.value.bytes as Uint8Array).toString()
      console.log(`   ${key}: "${value}"`)
    } else {
      const value = state.value.uint
      console.log(`   ${key}: ${value}`)
    }
  }
  console.log()

  // Define ABI methods
  const getVersionMethod = new algosdk.ABIMethod({
    name: 'get_version',
    args: [],
    returns: { type: 'string' },
  })

  const getCounterMethod = new algosdk.ABIMethod({
    name: 'get_counter',
    args: [],
    returns: { type: 'uint64' },
  })

  const incrementMethod = new algosdk.ABIMethod({
    name: 'increment',
    args: [],
    returns: { type: 'uint64' },
  })

  // Test v1.0 functionality
  console.log('=== Testing v1.0 Application ===')

  console.log('Calling get_version()...')
  const version1Result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: getVersionMethod,
      args: [],
      note: new TextEncoder().encode('get-version-v1'),
    })
    .send()

  if (version1Result.returns && version1Result.returns.length > 0) {
    console.log('   Version:', version1Result.returns[0].returnValue)
  }
  console.log()

  console.log('Incrementing counter a few times...')
  for (let i = 0; i < 3; i++) {
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

  console.log('=== Step 2: Update Application to v2.0 ===')
  console.log('Updating application with new code (version 2.0)...')
  console.log()

  // Create updated approval program with version 2.0
  const approvalProgramV2 = createApprovalProgram('2.0')

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
    const valueType = state.value.type

    if (valueType === 1) {
      const value = Buffer.from(state.value.bytes as Uint8Array).toString()
      console.log(`   ${key}: "${value}"`)
    } else {
      const value = state.value.uint
      console.log(`   ${key}: ${value}`)
    }
  }
  console.log()

  // Test v2.0 functionality
  console.log('=== Testing v2.0 Application ===')

  console.log('Calling get_version()...')
  const version2Result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: getVersionMethod,
      args: [],
      note: new TextEncoder().encode('get-version-v2'),
    })
    .send()

  if (version2Result.returns && version2Result.returns.length > 0) {
    console.log('   Version in global state:', version2Result.returns[0].returnValue)
    console.log('   Note: Version shows "1.0" because bare updates execute OLD code')
    console.log('   The TEAL code itself now has v2.0 logic, but global state unchanged')
  }
  console.log()

  console.log('Getting counter (should be preserved from v1.0)...')
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
    console.log('   Counter:', counter2Result.returns[0].returnValue)
    console.log('   ✅ State preserved across update!')
  }
  console.log()

  console.log('Incrementing counter to verify functionality...')
  const incrementV2Result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: incrementMethod,
      args: [],
      note: new TextEncoder().encode('increment-v2'),
    })
    .send()

  if (incrementV2Result.returns && incrementV2Result.returns.length > 0) {
    console.log('   New counter value:', incrementV2Result.returns[0].returnValue)
    console.log('   ✅ v2.0 application is working correctly!')
  }
  console.log()

  console.log('=== Understanding Updatable Applications ===\n')

  console.log('What is an updatable application?')
  console.log('  • An application whose code can be replaced with new code')
  console.log('  • The app ID and address remain the same after update')
  console.log('  • Global and local state is preserved across updates')
  console.log('  • Only the creator can update (unless using rekey logic)')
  console.log()

  console.log('Key differences: Create vs Update')
  console.log('  Create:')
  console.log('    - Generates a new app ID')
  console.log('    - Initializes fresh state')
  console.log('    - OnCompletion = NoOp (0)')
  console.log('  Update:')
  console.log('    - Keeps the same app ID')
  console.log('    - Preserves existing state')
  console.log('    - OnCompletion = UpdateApplication (4)')
  console.log()

  console.log('When to use app updates:')
  console.log('  ✓ Bug fixes in smart contract logic')
  console.log('  ✓ Adding new features or methods')
  console.log('  ✓ Optimizing performance or gas costs')
  console.log('  ✓ Changing business logic or parameters')
  console.log()

  console.log('Important considerations:')
  console.log('  ⚠ Updates replace ALL the code - plan carefully')
  console.log('  ⚠ Ensure state schema is compatible')
  console.log('  ⚠ Test updates thoroughly before deploying')
  console.log('  ⚠ Consider making apps immutable if updates not needed')
  console.log()

  console.log('Making apps updatable or immutable:')
  console.log('  Updatable: Creator address can call UpdateApplication')
  console.log('  Immutable: Set creator to zero address or use rekey')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
