import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to deploy a smart contract using an ABI method call
 * for initialization during creation.
 *
 * Using ABI methods during creation provides:
 * - Type-safe initialization with validated arguments
 * - Clear contract interface definition
 * - Automatic argument encoding/decoding
 * - Better developer experience and error messages
 *
 * This example shows:
 * 1. Creating a smart contract with an ABI creation method
 * 2. Passing typed arguments during contract creation
 * 3. Receiving return values from the creation method
 * 4. Verifying the initialized state
 */

async function main() {
  console.log('=== Smart Contract Deployment with ABI Method Call ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr.toString())
  console.log()

  // Define approval program with an ABI creation method
  const approvalProgram = `#pragma version 10

txn ApplicationID
int 0
==
bnz handle_creation

// Handle regular app calls
txn NumAppArgs
int 0
>
bnz check_methods

// Default: approve
int 1
return

handle_creation:
// Check if this is an ABI method call creation
txn NumAppArgs
int 0
>
bnz abi_create

// Bare creation (no ABI method)
int 1
return

abi_create:
// Verify the ABI method selector
txn ApplicationArgs 0
method "create(string,uint64)string"
==
bnz method_create

// Unknown creation method
int 0
return

method_create:
// Extract arguments:
// - ApplicationArgs[1]: ABI-encoded string name (2-byte length + string)
// - ApplicationArgs[2]: ABI-encoded uint64 initial_value (8 bytes)

// Decode and store the name in global state
// ABI string format: 2-byte length prefix + string data
txna ApplicationArgs 1
extract 2 0  // Skip first 2 bytes (length prefix), get rest
dup
byte "name"
swap
app_global_put

// Store the initial value in global state
byte "value"
txna ApplicationArgs 2
btoi
app_global_put

// Store the creator address
byte "creator"
txn Sender
app_global_put

// Return success message with the name (already on stack from earlier dup)
byte "Contract '"
swap
concat
byte "' initialized successfully"
concat
dup
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
return

check_methods:
// Check which ABI method is being called
txn ApplicationArgs 0
method "get_value()uint64"
==
bnz method_get_value

txn ApplicationArgs 0
method "increment()uint64"
==
bnz method_increment

txn ApplicationArgs 0
method "get_name()string"
==
bnz method_get_name

// Unknown method
int 0
return

method_get_value:
// Return current value
byte "value"
app_global_get
itob
byte 0x151f7c75  // ABI return prefix for uint64
swap
concat
log

int 1
return

method_increment:
// Increment value and return new value
byte "value"
app_global_get
int 1
+

// Store the new value
byte "value"
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

method_get_name:
// Return the name
byte "name"
app_global_get
dup
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

  console.log('=== Step 1: Deploy Smart Contract with ABI Creation Method ===')
  console.log('Creation method signature: create(string,uint64)string')
  console.log('Arguments:')
  console.log('  - name: "MyContract" (string)')
  console.log('  - initial_value: 100 (uint64)')
  console.log()

  // Define the ABI creation method
  const createMethod = new algosdk.ABIMethod({
    name: 'create',
    args: [
      { type: 'string', name: 'name' },
      { type: 'uint64', name: 'initial_value' },
    ],
    returns: { type: 'string' },
  })

  console.log('Deploying contract...')

  // Deploy the smart contract using ABI method call
  const createResult = await algorand
    .newGroup()
    .addAppCreateMethodCall({
      sender: deployer.addr,
      approvalProgram,
      clearStateProgram: clearProgram,
      schema: {
        globalInts: 1,
        globalByteSlices: 2,
        localInts: 0,
        localByteSlices: 0,
      },
      method: createMethod,
      args: ['MyContract', 100],
    })
    .send()

  const appId = createResult.confirmations[0].applicationIndex!
  const appAddress = algosdk.getApplicationAddress(appId)

  console.log('✅ Contract deployed successfully!')
  console.log('   App ID:', appId)
  console.log('   App Address:', appAddress.toString())
  console.log()

  // Extract the return value from the creation method
  if (createResult.returns && createResult.returns.length > 0) {
    const returnValue = createResult.returns[0]
    console.log('Return value from creation method:')
    console.log('   Type:', typeof returnValue.returnValue)
    console.log('   Value:', returnValue.returnValue)
  }
  console.log()

  console.log('=== Step 2: Verify Initialized State ===')

  // Read the global state to verify initialization
  const appInfo = await algorand.client.algod.getApplicationByID(Number(appId)).do()
  const globalState = appInfo.params.globalState || []

  console.log('Global State:')
  for (const state of globalState) {
    const key = Buffer.from(state.key as Uint8Array).toString()
    const valueType = state.value.type

    if (valueType === 1) {
      // Byte slice
      const valueBytes = state.value.bytes as Uint8Array

      // Check if it's an address (32 bytes)
      if (valueBytes.length === 32) {
        const address = algosdk.encodeAddress(valueBytes)
        console.log(`   ${key}: ${address}`)
      } else {
        // It's a string
        const value = Buffer.from(valueBytes).toString()
        console.log(`   ${key}: "${value}"`)
      }
    } else {
      // Uint64
      const value = state.value.uint
      console.log(`   ${key}: ${value}`)
    }
  }
  console.log()

  console.log('=== Understanding ABI Creation Methods ===\n')

  console.log('Benefits of ABI Creation Methods:')
  console.log('  ✓ Type-safe argument passing')
  console.log('  ✓ Automatic encoding/decoding')
  console.log('  ✓ Return values from creation')
  console.log('  ✓ Clear contract interface')
  console.log('  ✓ Better error messages')
  console.log()

  console.log('What happens during ABI creation:')
  console.log('  1. Method selector is computed from signature')
  console.log('  2. Arguments are ABI-encoded')
  console.log('  3. Creation transaction is sent with encoded args')
  console.log('  4. Contract verifies method selector')
  console.log('  5. Contract decodes and processes arguments')
  console.log('  6. Contract returns ABI-encoded result')
  console.log()

  console.log('=== Step 3: Call Methods on Deployed Contract ===')

  // Define other ABI methods
  const getValueMethod = new algosdk.ABIMethod({
    name: 'get_value',
    args: [],
    returns: { type: 'uint64' },
  })

  const incrementMethod = new algosdk.ABIMethod({
    name: 'increment',
    args: [],
    returns: { type: 'uint64' },
  })

  const getNameMethod = new algosdk.ABIMethod({
    name: 'get_name',
    args: [],
    returns: { type: 'string' },
  })

  console.log('Calling get_value() method...')
  const getValueResult = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: getValueMethod,
      args: [],
    })
    .send()

  if (getValueResult.returns && getValueResult.returns.length > 0) {
    console.log('   Current value:', getValueResult.returns[0].returnValue)
  }
  console.log()

  console.log('Calling increment() method...')
  const incrementResult = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: incrementMethod,
      args: [],
    })
    .send()

  if (incrementResult.returns && incrementResult.returns.length > 0) {
    console.log('   New value after increment:', incrementResult.returns[0].returnValue)
  }
  console.log()

  console.log('Calling get_name() method...')
  const getNameResult = await algorand
    .newGroup()
    .addAppCallMethodCall({
      sender: deployer.addr,
      appId,
      method: getNameMethod,
      args: [],
    })
    .send()

  if (getNameResult.returns && getNameResult.returns.length > 0) {
    console.log('   Contract name:', getNameResult.returns[0].returnValue)
  }
  console.log()

  console.log('=== Common ABI Creation Patterns ===\n')

  console.log('1. Simple Initialization')
  console.log('   • Pass configuration values during creation')
  console.log('   • Example: create(uint64 max_supply)')
  console.log()

  console.log('2. Named Initialization')
  console.log('   • Give the contract a name during creation')
  console.log('   • Example: create(string name, string symbol)')
  console.log()

  console.log('3. Access Control Setup')
  console.log('   • Set admin/owner during creation')
  console.log('   • Example: create(address admin)')
  console.log()

  console.log('4. Configuration with Validation')
  console.log('   • Validate and store configuration')
  console.log('   • Example: create(uint64 min, uint64 max) returns success message')
  console.log()

  console.log('5. Multi-Parameter Setup')
  console.log('   • Complex initialization with multiple parameters')
  console.log('   • Example: create(string name, uint64 value, address admin, bool paused)')
  console.log()

  console.log('=== Best Practices ===\n')

  console.log('1. Use Descriptive Method Names')
  console.log('   ✅ create(string name, uint64 initial_value)string')
  console.log('   ❌ c(string,uint64)string')
  console.log()

  console.log('2. Return Meaningful Values')
  console.log('   ✅ Return success messages, IDs, or computed values')
  console.log('   ❌ Return void when you could return useful information')
  console.log()

  console.log('3. Validate Arguments')
  console.log('   • Check argument ranges and validity')
  console.log('   • Reject invalid inputs early')
  console.log('   • Provide clear error messages')
  console.log()

  console.log('4. Document Method Signatures')
  console.log('   • Use clear parameter names')
  console.log('   • Document expected ranges')
  console.log('   • Specify return value meaning')
  console.log()

  console.log('5. Initialize All State')
  console.log('   • Set all required global state during creation')
  console.log('   • Don\'t leave state uninitialized')
  console.log('   • Use sensible defaults')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
