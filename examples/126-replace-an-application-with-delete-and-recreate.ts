import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to replace an existing Algorand application
 * by deleting it and creating a new one. This is useful when you need to make
 * changes that cannot be handled by a regular update, such as:
 * - Schema-breaking changes (increasing storage)
 * - Major logic redesigns
 * - Changing immutable app parameters
 *
 * The delete-and-recreate pattern gives you a completely fresh app,
 * but comes with important trade-offs.
 */

async function main() {
  console.log('=== Replace Application with Delete and Recreate ===\n')

  // Initialize AlgorandClient for local development
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr)
  console.log()

  // Define version 1.0 of the approval program
  const approvalProgramV1 = `#pragma version 10

txn ApplicationID
int 0
==
bnz create

// Check OnCompletion first (before accessing ApplicationArgs)
txn OnCompletion
int UpdateApplication
==
bnz handle_update

txn OnCompletion
int DeleteApplication
==
bnz handle_delete

// Handle method calls
txn ApplicationArgs 0
byte "get_value"
==
bnz handle_get_value

// Default: approve
int 1
return

create:
// Store version and value during creation
byte "version"
byte "1.0"
app_global_put

byte "value"
int 100
app_global_put

int 1
return

handle_get_value:
// Return the stored value
byte "value"
app_global_get
itob
log
int 1
return

handle_update:
// Allow updates
int 1
return

handle_delete:
// Allow deletion
int 1
return`

  // Define version 2.0 of the approval program (with different logic)
  const approvalProgramV2 = `#pragma version 10

txn ApplicationID
int 0
==
bnz create

// Check OnCompletion first (before accessing ApplicationArgs)
txn OnCompletion
int UpdateApplication
==
bnz handle_update

txn OnCompletion
int DeleteApplication
==
bnz handle_delete

// Handle method calls
txn ApplicationArgs 0
byte "get_value"
==
bnz handle_get_value

txn ApplicationArgs 0
byte "get_multiplied_value"
==
bnz handle_get_multiplied_value

// Default: approve
int 1
return

create:
// Store version and value during creation
byte "version"
byte "2.0"
app_global_put

byte "value"
int 200
app_global_put

byte "multiplier"
int 3
app_global_put

int 1
return

handle_get_value:
// Return the stored value
byte "value"
app_global_get
itob
log
int 1
return

handle_get_multiplied_value:
// NEW METHOD: Return value * multiplier
byte "value"
app_global_get
byte "multiplier"
app_global_get
*
itob
log
int 1
return

handle_update:
// Allow updates
int 1
return

handle_delete:
// Allow deletion
int 1
return`

  const clearProgram = `#pragma version 10
int 1
return`

  console.log('=== Step 1: Deploy Initial App (Version 1.0) ===')
  console.log('Features:')
  console.log('  - Version: 1.0')
  console.log('  - Value: 100')
  console.log('  - Schema: 1 global uint, 1 global byte slice')
  console.log('  - Methods: get_value')
  console.log()

  // Deploy the first version
  const appResult1 = await algorand.send.appCreate({
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

  const appId1 = appResult1.appId
  const appAddress1 = algosdk.getApplicationAddress(appId1)

  console.log('✅ Version 1.0 deployed successfully!')
  console.log('   App ID:', appId1)
  console.log('   App Address:', appAddress1)
  console.log()

  // Read the global state of version 1.0
  const appInfo1 = await algorand.client.algod.getApplicationByID(Number(appId1)).do()
  const globalState1 = appInfo1.params.globalState || []

  console.log('Global State (Version 1.0):')
  for (const state of globalState1) {
    const key = Buffer.from(state.key as Uint8Array).toString()
    const valueType = state.value.type
    const value =
      valueType === 1 ? Buffer.from(state.value.bytes as Uint8Array).toString() : state.value.uint

    console.log(`   ${key}: ${value}`)
  }
  console.log()

  // Test the get_value method
  console.log('Testing get_value method on Version 1.0...')
  const callResult1 = await algorand.send.appCall({
    sender: deployer.addr,
    appId: appId1,
    args: [new TextEncoder().encode('get_value')],
  })

  const logs1 = callResult1.confirmation.logs || []
  if (logs1.length > 0) {
    const value = Buffer.from(logs1[0]).readBigUInt64BE()
    console.log('   Returned value:', value.toString())
  }
  console.log()

  console.log('=== Understanding When to Replace an App ===\n')
  console.log('Scenarios requiring delete-and-recreate:')
  console.log()
  console.log('1. Schema-Breaking Changes:')
  console.log('   ❌ Cannot increase storage via update')
  console.log('   ✅ Delete old app, create new one with larger schema')
  console.log()
  console.log('2. Major Logic Redesign:')
  console.log('   ❌ Update might leave incompatible state')
  console.log('   ✅ Fresh start ensures clean state')
  console.log()
  console.log('3. Adding New Required State:')
  console.log('   ❌ Update cannot add new global state keys retroactively')
  console.log('   ✅ New app initializes with all required state')
  console.log()
  console.log('4. Changing App Behavior Fundamentally:')
  console.log('   ❌ Users might rely on old behavior')
  console.log('   ✅ New app ID makes the change explicit')
  console.log()

  console.log('=== Step 2: Replace App (Delete V1.0, Create V2.0) ===')
  console.log('New features in Version 2.0:')
  console.log('  - Version: 2.0')
  console.log('  - Value: 200 (different default)')
  console.log('  - Schema: 2 global uints, 1 global byte slice (INCREASED)')
  console.log('  - Methods: get_value, get_multiplied_value (NEW)')
  console.log()

  console.log('Deleting Version 1.0...')
  await algorand.send.appDelete({
    sender: deployer.addr,
    appId: appId1,
  })
  console.log('   ✅ Version 1.0 deleted')
  console.log()

  // Verify deletion
  console.log('Verifying deletion...')
  try {
    await algorand.client.algod.getApplicationByID(Number(appId1)).do()
    console.log('   ❌ App still exists (unexpected!)')
  } catch (error: any) {
    if (error.message.includes('application does not exist')) {
      console.log('   ✅ Confirmed: Version 1.0 no longer exists')
    }
  }
  console.log()

  console.log('Creating Version 2.0...')
  const appResult2 = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: approvalProgramV2,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 2, // INCREASED from 1
      globalByteSlices: 1,
      localInts: 0,
      localByteSlices: 0,
    },
  })

  const appId2 = appResult2.appId
  const appAddress2 = algosdk.getApplicationAddress(appId2)

  console.log('✅ Version 2.0 deployed successfully!')
  console.log('   App ID:', appId2)
  console.log('   App Address:', appAddress2)
  console.log()

  console.log('Comparison:')
  console.log('   Old App ID:', appId1)
  console.log('   New App ID:', appId2)
  console.log('   IDs are different:', appId1 !== appId2 ? '✅ YES' : '❌ NO')
  console.log()

  // Read the global state of version 2.0
  const appInfo2 = await algorand.client.algod.getApplicationByID(Number(appId2)).do()
  const globalState2 = appInfo2.params.globalState || []

  console.log('Global State (Version 2.0):')
  for (const state of globalState2) {
    const key = Buffer.from(state.key as Uint8Array).toString()
    const valueType = state.value.type
    const value =
      valueType === 1 ? Buffer.from(state.value.bytes as Uint8Array).toString() : state.value.uint

    console.log(`   ${key}: ${value}`)
  }
  console.log()

  // Test the new get_multiplied_value method
  console.log('Testing NEW method get_multiplied_value on Version 2.0...')
  const callResult2 = await algorand.send.appCall({
    sender: deployer.addr,
    appId: appId2,
    args: [new TextEncoder().encode('get_multiplied_value')],
  })

  const logs2 = callResult2.confirmation.logs || []
  if (logs2.length > 0) {
    const value = Buffer.from(logs2[0]).readBigUInt64BE()
    console.log('   Returned value (200 * 3):', value.toString())
  }
  console.log()

  console.log('=== Trade-offs of Delete-and-Recreate ===\n')

  console.log('Consequences:')
  console.log('  ⚠️  New App ID (must update all references)')
  console.log('  ⚠️  All global state is LOST')
  console.log('  ⚠️  All local state is LOST for all users')
  console.log('  ⚠️  Users must RE-OPT-IN to the new app')
  console.log('  ⚠️  Any apps/contracts referencing old app will break')
  console.log('  ⚠️  Frontend code must use new app ID')
  console.log('  ⚠️  Asset holdings in app account are lost (transfer first!)')
  console.log()

  console.log('Benefits:')
  console.log('  ✅ Can increase storage schema')
  console.log('  ✅ Clean slate with no legacy state')
  console.log('  ✅ Can redesign state structure completely')
  console.log('  ✅ Remove technical debt')
  console.log('  ✅ Explicit versioning via new app ID')
  console.log()

  console.log('=== Best Practices ===\n')

  console.log('1. Plan Ahead for Schema Needs')
  console.log('   • Allocate extra storage space during initial creation')
  console.log('   • Example: Need 2 uints? Allocate 5 for future growth')
  console.log('   • Avoids forced replacements later')
  console.log()

  console.log('2. Transfer Assets Before Deletion')
  console.log('   • App accounts can hold ALGOs and ASAs')
  console.log('   • Transfer all assets OUT before deleting')
  console.log('   • Otherwise, assets are permanently lost')
  console.log()

  console.log('3. Coordinate with Users')
  console.log('   • Announce replacement in advance')
  console.log('   • Provide migration timeline')
  console.log('   • Guide users to opt-in to new app')
  console.log('   • Consider migration incentives')
  console.log()

  console.log('4. Migrate Critical State')
  console.log('   • Read state from old app before deletion')
  console.log('   • Write state to new app after creation')
  console.log('   • Use atomic transaction groups when possible')
  console.log('   • Document what state was preserved/lost')
  console.log()

  console.log('5. Update All References')
  console.log('   • Frontend code (hardcoded app IDs)')
  console.log('   • Backend services')
  console.log('   • Smart contracts that call this app')
  console.log('   • Documentation and API specs')
  console.log()

  console.log('6. Test on TestNet First')
  console.log('   • Validate replacement process')
  console.log('   • Test state migration scripts')
  console.log('   • Verify frontend updates work')
  console.log('   • Identify edge cases')
  console.log()

  console.log('7. Consider Using Box Storage')
  console.log('   • Box storage can grow dynamically')
  console.log('   • No schema-breaking changes needed')
  console.log('   • Good for dynamic data')
  console.log('   • Costs per box, not per app')
  console.log()

  console.log('=== Alternative Strategies ===\n')

  console.log('1. Updatable Design Pattern')
  console.log('   • Over-allocate schema from the start')
  console.log('   • Use version flags in state')
  console.log('   • Update logic without replacing app')
  console.log('   • Keeps same app ID')
  console.log()

  console.log('2. Proxy Pattern')
  console.log('   • Main app delegates to implementation app')
  console.log('   • Replace implementation, keep proxy')
  console.log('   • Proxy app ID stays constant')
  console.log('   • More complex architecture')
  console.log()

  console.log('3. Box Storage for Dynamic Data')
  console.log('   • Use global state for fixed data')
  console.log('   • Use boxes for dynamic/growing data')
  console.log('   • Avoids schema constraints')
  console.log('   • Pay per box instead of upfront')
  console.log()

  console.log('4. Multiple App Architecture')
  console.log('   • Split functionality across multiple apps')
  console.log('   • Replace individual apps as needed')
  console.log('   • Other apps continue running')
  console.log('   • More coordination overhead')
  console.log()

  console.log('=== When to Use Each Strategy ===\n')

  console.log('Use Delete-and-Recreate when:')
  console.log('  • Schema must increase (no other option)')
  console.log('  • Complete redesign is needed')
  console.log('  • Few users (easy to coordinate re-opt-in)')
  console.log('  • App is in development/testing')
  console.log('  • Legacy state is not needed')
  console.log()

  console.log('Use Update when:')
  console.log('  • Schema stays same or decreases')
  console.log('  • Logic changes are compatible')
  console.log('  • App ID must remain constant')
  console.log('  • Many users (hard to coordinate)')
  console.log('  • State must be preserved')
  console.log()

  console.log('Use Proxy Pattern when:')
  console.log('  • Frequent updates expected')
  console.log('  • App ID must be stable')
  console.log('  • Comfortable with complexity')
  console.log('  • Need versioning flexibility')
  console.log()

  console.log('Use Box Storage when:')
  console.log('  • Data size is unpredictable')
  console.log('  • Per-user storage needed')
  console.log('  • Schema rigidity is a concern')
  console.log('  • Cost of boxes is acceptable')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
