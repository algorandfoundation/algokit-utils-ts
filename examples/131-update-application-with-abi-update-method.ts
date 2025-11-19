import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to update an existing smart contract application
 * using an ABI method call during the update transaction.
 *
 * Application updates allow you to:
 * - Replace the approval and clear state programs with new versions
 * - Optionally call an ABI method during the update for validation or migration
 * - Maintain the same app ID and app address
 * - Preserve existing global and local state
 *
 * This example shows:
 * 1. Creating a smart contract with an initial version
 * 2. Updating the contract with new logic
 * 3. Using an ABI method during update to validate the upgrade
 * 4. Verifying the update maintained the app ID
 */

async function main() {
  console.log('=== Update Application with ABI Update Method ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr.toString())
  console.log()

  // Define initial approval program (v1.0)
  const approvalProgramV1 = `#pragma version 10

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
byte "1.0"
app_global_put

// Initialize value
byte "value"
int 100
app_global_put

// Store creator
byte "creator"
txn Sender
app_global_put

int 1
return

handle_update:
// Check if this is an ABI method call update
txn NumAppArgs
int 0
>
bnz abi_update

// Bare update (no ABI method)
int 1
return

abi_update:
// Verify the ABI method selector
txn ApplicationArgs 0
method "update_version(string)string"
==
bnz method_update_version

// Unknown update method
int 0
return

method_update_version:
// Extract new version from arguments
// ApplicationArgs[1]: ABI-encoded string (2-byte length + string)
txna ApplicationArgs 1
extract 2 0  // Skip length prefix

// Update version in global state
byte "version"
swap
app_global_put

// Return success message
byte "Successfully updated to version: "
txna ApplicationArgs 1
extract 2 0
concat
dup
len
itob
extract 6 2
swap
concat
byte 0x151f7c75  // ABI return prefix
swap
concat
log

int 1
return

check_methods:
// Check which ABI method is being called
txn ApplicationArgs 0
method "get_version()string"
==
bnz method_get_version

txn ApplicationArgs 0
method "get_value()uint64"
==
bnz method_get_value

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

method_get_value:
// Return current value
byte "value"
app_global_get
itob
byte 0x151f7c75
swap
concat
log

int 1
return`

  // Define updated approval program (v2.0)
  const approvalProgramV2 = `#pragma version 10

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
byte "2.0"
app_global_put

// Initialize value
byte "value"
int 200
app_global_put

// Store creator
byte "creator"
txn Sender
app_global_put

int 1
return

handle_update:
// Check if this is an ABI method call update
txn NumAppArgs
int 0
>
bnz abi_update

// Bare update (no ABI method)
int 1
return

abi_update:
// Verify the ABI method selector
txn ApplicationArgs 0
method "update_version(string)string"
==
bnz method_update_version

// Unknown update method
int 0
return

method_update_version:
// Extract new version from arguments
// ApplicationArgs[1]: ABI-encoded string (2-byte length + string)
txna ApplicationArgs 1
extract 2 0  // Skip length prefix

// Update version in global state
byte "version"
swap
app_global_put

// Return success message
byte "Successfully updated to version: "
txna ApplicationArgs 1
extract 2 0
concat
dup
len
itob
extract 6 2
swap
concat
byte 0x151f7c75  // ABI return prefix
swap
concat
log

int 1
return

check_methods:
// Check which ABI method is being called
txn ApplicationArgs 0
method "get_version()string"
==
bnz method_get_version

txn ApplicationArgs 0
method "get_value()uint64"
==
bnz method_get_value

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

method_get_value:
// Return current value
byte "value"
app_global_get
itob
byte 0x151f7c75
swap
concat
log

int 1
return

method_increment:
// NEW METHOD IN V2: Increment value
byte "value"
app_global_get
int 1
+

// Store the new value
byte "value"
dig 1
app_global_put

// Return the new value
itob
byte 0x151f7c75
swap
concat
log

int 1
return`

  const clearProgram = `#pragma version 10
int 1
return`

  console.log('=== Step 1: Deploy Initial Application (v1.0) ===')
  console.log('Creating application with version 1.0...')
  console.log()

  // Create the initial application
  const createResult = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: approvalProgramV1,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 2,
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
    const valueType = state.value.type

    if (valueType === 1) {
      const valueBytes = state.value.bytes as Uint8Array
      if (valueBytes.length === 32) {
        const address = algosdk.encodeAddress(valueBytes)
        console.log(`   ${key}: ${address}`)
      } else {
        const value = Buffer.from(valueBytes).toString()
        console.log(`   ${key}: "${value}"`)
      }
    } else {
      const value = state.value.uint
      console.log(`   ${key}: ${value}`)
    }
  }
  console.log()

  // Call get_version method to verify v1.0
  const getVersionMethod = new algosdk.ABIMethod({
    name: 'get_version',
    args: [],
    returns: { type: 'string' },
  })

  const getValueMethod = new algosdk.ABIMethod({
    name: 'get_value',
    args: [],
    returns: { type: 'uint64' },
  })

  console.log('Calling get_version() on v1.0...')
  const version1Result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: getVersionMethod,
      args: [],
    })
    .send()

  if (version1Result.returns && version1Result.returns.length > 0) {
    console.log('   Version:', version1Result.returns[0].returnValue)
  }
  console.log()

  console.log('Calling get_value() on v1.0...')
  const value1Result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: getValueMethod,
      args: [],
    })
    .send()

  if (value1Result.returns && value1Result.returns.length > 0) {
    console.log('   Value:', value1Result.returns[0].returnValue)
  }
  console.log()

  console.log('=== Step 2: Update Application with ABI Method (v1.0 → v2.0) ===')
  console.log('Updating to version 2.0 using update_version() ABI method...')
  console.log()

  // Define the update method
  const updateVersionMethod = new algosdk.ABIMethod({
    name: 'update_version',
    args: [{ type: 'string', name: 'new_version' }],
    returns: { type: 'string' },
  })

  // Update the application with ABI method call
  const updateResult = await algorand
    .newGroup()
    .addAppUpdateMethodCall({
      sender: deployer.addr,
      appId,
      approvalProgram: approvalProgramV2,
      clearStateProgram: clearProgram,
      method: updateVersionMethod,
      args: ['2.0'],
    })
    .send()

  console.log('✅ Application updated successfully!')
  console.log('   Transaction IDs:', updateResult.txIds)
  console.log()

  // Extract return value from update method
  if (updateResult.returns && updateResult.returns.length > 0) {
    const returnValue = updateResult.returns[0]
    console.log('Return value from update_version() method:')
    console.log('   Type:', typeof returnValue.returnValue)
    console.log('   Value:', returnValue.returnValue)
  }
  console.log()

  console.log('=== Step 3: Verify Application Was Updated ===')

  // Read updated state
  appInfo = await algorand.client.algod.getApplicationByID(Number(appId)).do()
  globalState = appInfo.params.globalState || []

  console.log('Updated Global State:')
  for (const state of globalState) {
    const key = Buffer.from(state.key as Uint8Array).toString()
    const valueType = state.value.type

    if (valueType === 1) {
      const valueBytes = state.value.bytes as Uint8Array
      if (valueBytes.length === 32) {
        const address = algosdk.encodeAddress(valueBytes)
        console.log(`   ${key}: ${address}`)
      } else {
        const value = Buffer.from(valueBytes).toString()
        console.log(`   ${key}: "${value}"`)
      }
    } else {
      const value = state.value.uint
      console.log(`   ${key}: ${value}`)
    }
  }
  console.log()

  // Verify app ID didn't change
  console.log('Verification:')
  console.log('   App ID unchanged:', appId)
  console.log('   App Address unchanged:', appAddress.toString())
  console.log()

  // Call get_version to verify it's now v2.0
  console.log('Calling get_version() on v2.0...')
  const version2Result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: getVersionMethod,
      args: [],
      note: new TextEncoder().encode('check-version-v2'),
    })
    .send()

  if (version2Result.returns && version2Result.returns.length > 0) {
    console.log('   Version:', version2Result.returns[0].returnValue)
  }
  console.log()

  // Call get_value to verify value is still there
  console.log('Calling get_value() on v2.0...')
  const value2Result = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: getValueMethod,
      args: [],
      note: new TextEncoder().encode('check-value-v2'),
    })
    .send()

  if (value2Result.returns && value2Result.returns.length > 0) {
    console.log('   Value:', value2Result.returns[0].returnValue)
  }
  console.log()

  // Test new method only available in v2.0
  console.log('=== Step 4: Test New Method Added in v2.0 ===')
  console.log('Calling increment() method (new in v2.0)...')

  const incrementMethod = new algosdk.ABIMethod({
    name: 'increment',
    args: [],
    returns: { type: 'uint64' },
  })

  const incrementResult = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: incrementMethod,
      args: [],
      note: new TextEncoder().encode('test-increment-v2'),
    })
    .send()

  if (incrementResult.returns && incrementResult.returns.length > 0) {
    console.log('   New value after increment:', incrementResult.returns[0].returnValue)
  }
  console.log()

  console.log('=== Understanding Application Updates ===\n')

  console.log('What happens during an update:')
  console.log('  1. New approval and clear programs replace the old ones')
  console.log('  2. App ID and app address remain the same')
  console.log('  3. Global and local state is preserved')
  console.log('  4. Optional ABI method can be called for validation/migration')
  console.log('  5. Only the creator can update (unless rekey logic is implemented)')
  console.log()

  console.log('Benefits of ABI update methods:')
  console.log('  ✓ Validate the update before it completes')
  console.log('  ✓ Perform state migration or cleanup')
  console.log('  ✓ Log update events for auditing')
  console.log('  ✓ Type-safe arguments during update')
  console.log('  ✓ Return confirmation or migration results')
  console.log()

  console.log('Key differences between create and update:')
  console.log('  Create: App ID is generated, state starts fresh')
  console.log('  Update: App ID stays same, state is preserved')
  console.log('  Create: OnCompletion can be NoOp or OptIn')
  console.log('  Update: OnCompletion must be UpdateApplication')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
