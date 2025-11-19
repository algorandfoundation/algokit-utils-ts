import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates using custom ABI methods during app creation and deletion.
 *
 * Instead of using the default bare app call for creation/deletion, you can:
 * - Use custom ABI methods that execute initialization logic
 * - Pass arguments to these methods
 * - Capture return values from both create and delete operations
 * - Implement complex setup/teardown logic
 *
 * This is useful when your smart contract needs specific initialization
 * or cleanup logic during deployment/deletion.
 */

async function main() {
  console.log('=== Custom ABI Methods for App Creation and Deletion ===\n')

  // Initialize AlgorandClient for local development
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr)
  console.log()

  // Define approval program with custom ABI create and delete methods
  const approvalProgram = `#pragma version 10

// Check for ABI method calls FIRST (before checking ApplicationID)
txn NumAppArgs
int 0
>
bnz check_method_calls

// No app args, check if it's a bare creation
txn ApplicationID
int 0
==
bnz handle_create

// Handle regular delete
txn OnCompletion
int DeleteApplication
==
bnz handle_delete

// Default: approve
int 1
return

check_method_calls:
// Check which ABI method is being called
txn ApplicationArgs 0
method "create_abi(string)string"
==
bnz method_create_abi

txn ApplicationArgs 0
method "delete_abi(string)string"
==
bnz method_delete_abi

// Unknown method, reject
int 0
return

handle_create:
// Default bare creation (no ABI method)
byte "status"
byte "created_bare"
app_global_put
int 1
return

method_create_abi:
// Custom ABI creation method that accepts string argument
// Get the input argument (skip length prefix)
txn ApplicationArgs 1
extract 2 0

// Store it in global state
byte "init_value"
swap
app_global_put

// Store status
byte "status"
byte "created_abi"
app_global_put

// Return ABI response: prefix + "Created with: [arg]"
byte "Created successfully"
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

method_delete_abi:
// Custom ABI deletion method
// Get the input argument
txn ApplicationArgs 1
extract 2 0

// Log the cleanup message
byte "Cleanup with: "
swap
concat
log

// Return ABI response
byte "Deleted successfully"
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

handle_delete:
// Regular bare deletion
byte "Bare delete"
log
int 1
return`

  const clearProgram = `#pragma version 10
int 1
return`

  console.log('=== Step 1: Create App with Custom ABI Create Method ===')
  console.log()

  // Define the ABI method
  const createAbiMethod = new algosdk.ABIMethod({
    name: 'create_abi',
    args: [{ type: 'string', name: 'init_msg', desc: 'Initialization message' }],
    returns: { type: 'string', desc: 'Creation confirmation' },
  })

  const deleteAbiMethod = new algosdk.ABIMethod({
    name: 'delete_abi',
    args: [{ type: 'string', name: 'cleanup_msg', desc: 'Cleanup message' }],
    returns: { type: 'string', desc: 'Deletion confirmation' },
  })

  // Create app using custom ABI create method
  const createResult = await algorand
    .newGroup()
    .addAppCreateMethodCall({
      sender: deployer.addr,
      approvalProgram,
      clearStateProgram: clearProgram,
      schema: {
        globalInts: 0,
        globalByteSlices: 2, // For status and init_value
        localInts: 0,
        localByteSlices: 0,
      },
      method: createAbiMethod,
      args: ['Hello from ABI create!'],
    })
    .send()

  // Extract app ID from the transaction results
  const appId = createResult.confirmations[0].applicationIndex!
  const appAddress = algosdk.getApplicationAddress(appId)

  console.log('✅ App created using ABI method!')
  console.log('   App ID:', appId)
  console.log('   App Address:', appAddress)
  console.log()

  // Get the return value from the ABI method
  const createReturnValue = createResult.returns?.[0]?.returnValue
  console.log('ABI Method Return Value:')
  console.log('   create_abi returned:', createReturnValue)
  console.log()

  // Read the global state to see what was stored
  const appInfo = await algorand.client.algod.getApplicationByID(Number(appId)).do()
  const globalState = appInfo.params.globalState || []

  console.log('Global State after creation:')
  for (const state of globalState) {
    const key = Buffer.from(state.key as Uint8Array).toString()
    const valueType = state.value.type
    const value =
      valueType === 1
        ? Buffer.from(state.value.bytes as Uint8Array).toString()
        : state.value.uint

    console.log(`   ${key}: ${value}`)
  }
  console.log()

  console.log('=== Step 2: Delete App with Custom ABI Delete Method ===')
  console.log()

  // Delete app using custom ABI delete method
  const deleteResult = await algorand
    .newGroup()
    .addAppDeleteMethodCall({
      sender: deployer.addr,
      appId: appId,
      method: deleteAbiMethod,
      args: ['Goodbye from ABI delete!'],
    })
    .send()

  const deleteReturnValue = deleteResult.returns?.[0]?.returnValue
  console.log('✅ App deleted using ABI method!')
  console.log('   Delete transaction ID:', deleteResult.txIds[0])
  console.log()

  console.log('ABI Method Return Value:')
  console.log('   delete_abi returned:', deleteReturnValue)
  console.log()

  // Verify app was deleted
  console.log('Verifying app was deleted...')
  try {
    await algorand.client.algod.getApplicationByID(Number(appId)).do()
    console.log('   ❌ App still exists (unexpected!)')
  } catch (error: any) {
    if (error.message.includes('application does not exist')) {
      console.log('   ✅ App successfully deleted')
    }
  }
  console.log()

  console.log('=== Comparison: ABI Methods vs Bare Calls ===\n')

  console.log('Bare App Creation:')
  console.log('  • Simple: No arguments, no return values')
  console.log('  • Limited: Cannot execute initialization logic')
  console.log('  • Fast: Minimal overhead')
  console.log()

  console.log('ABI Method App Creation:')
  console.log('  ✓ Pass arguments for custom initialization')
  console.log('  ✓ Execute complex setup logic in TEAL')
  console.log('  ✓ Return values for validation/logging')
  console.log('  ✓ Type-safe parameter passing')
  console.log()

  console.log('Bare App Deletion:')
  console.log('  • Simple: Just deletes the app')
  console.log('  • No cleanup logic execution')
  console.log()

  console.log('ABI Method App Deletion:')
  console.log('  ✓ Execute cleanup logic before deletion')
  console.log('  ✓ Pass context about why deletion occurred')
  console.log('  ✓ Capture final state or metrics')
  console.log('  ✓ Log important cleanup information')
  console.log()

  console.log('=== Use Cases for Custom ABI Methods ===\n')

  console.log('1. Initialization with Configuration')
  console.log('   create_abi(admin_address, initial_supply, fee_rate)')
  console.log('   • Set admin during creation')
  console.log('   • Initialize token supply')
  console.log('   • Configure parameters\n')

  console.log('2. Cleanup with State Migration')
  console.log('   delete_abi(new_app_id, migration_complete)')
  console.log('   • Point to replacement app')
  console.log('   • Verify migration finished')
  console.log('   • Log final metrics\n')

  console.log('3. Conditional Creation')
  console.log('   create_abi(required_version, feature_flags)')
  console.log('   • Verify version compatibility')
  console.log('   • Enable/disable features')
  console.log('   • Return configuration status\n')

  console.log('4. Auditable Deletion')
  console.log('   delete_abi(reason, requester, timestamp)')
  console.log('   • Log why app was deleted')
  console.log('   • Track who initiated deletion')
  console.log('   • Record deletion time\n')

  console.log('5. Multi-Step Setup')
  console.log('   create_abi(dependencies[], initialization_data)')
  console.log('   • Validate dependencies exist')
  console.log('   • Initialize with complex data')
  console.log('   • Return setup confirmation\n')

  console.log('=== Best Practices ===\n')

  console.log('1. Always validate arguments in TEAL')
  console.log('   • Check argument types and ranges')
  console.log('   • Reject invalid inputs')
  console.log('   • Return meaningful error messages\n')

  console.log('2. Use return values for confirmation')
  console.log('   • Return success/failure status')
  console.log('   • Include relevant details')
  console.log('   • Enable off-chain validation\n')

  console.log('3. Keep initialization atomic')
  console.log('   • Complete setup in one transaction')
  console.log('   • Don\'t require follow-up calls')
  console.log('   • Store all initial state\n')

  console.log('4. Document cleanup behavior')
  console.log('   • Specify what cleanup does')
  console.log('   • List any side effects')
  console.log('   • Explain state transition\n')

  console.log('5. Consider gas costs')
  console.log('   • ABI methods cost more than bare calls')
  console.log('   • Balance flexibility vs efficiency')
  console.log('   • Use bare calls when initialization is simple\n')

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
