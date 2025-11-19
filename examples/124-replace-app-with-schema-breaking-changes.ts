import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to handle schema-breaking changes in Algorand apps.
 *
 * When you need to change the storage schema (global/local state) of an app,
 * you often cannot update it in place because Algorand doesn't allow certain
 * schema modifications. The typical solution is to delete the old app and
 * create a new one with the updated schema.
 *
 * This example shows:
 * 1. Deploying an app with an initial schema
 * 2. Understanding what schema-breaking changes are
 * 3. Deleting the old app
 * 4. Creating a new app with increased storage
 */

async function main() {
  console.log('=== Replace App with Schema-Breaking Changes ===\n')

  // Initialize AlgorandClient for local development
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr)
  console.log()

  // Define approval and clear programs
  const approvalProgram = `#pragma version 10

txn ApplicationID
int 0
==
bnz create

// On update
txn OnCompletion
int UpdateApplication
==
bnz handle_update

// On delete
txn OnCompletion
int DeleteApplication
==
bnz handle_delete

// Default: approve
int 1
return

create:
// Store version in global state
byte "version"
byte "1.0"
app_global_put
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

  console.log('=== Deploying Initial App with Original Schema ===')
  console.log('Schema:')
  console.log('  - Global: 2 uints, 1 byte slice')
  console.log('  - Local: 1 uint, 0 byte slices')
  console.log()

  // Deploy the first version with initial schema
  const appResult1 = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 2, // Initial: 2 global uint values
      globalByteSlices: 1, // Initial: 1 global byte slice
      localInts: 1, // Initial: 1 local uint value
      localByteSlices: 0, // Initial: 0 local byte slices
    },
  })

  const appId1 = appResult1.appId
  const appAddress1 = algosdk.getApplicationAddress(appId1)
  console.log('✅ Initial deployment successful!')
  console.log('   App ID:', appId1)
  console.log('   App Address:', appAddress1)
  console.log('   Schema (Global): 2 uints, 1 byte slice')
  console.log('   Schema (Local): 1 uint, 0 byte slices')
  console.log()

  // Fetch and display the app info
  const appInfo1 = await algorand.client.algod.getApplicationByID(Number(appId1)).do()
  console.log('App details:')
  console.log('   Global state schema:', appInfo1.params.globalStateSchema)
  console.log('   Local state schema:', appInfo1.params.localStateSchema)
  console.log()

  // Wait a moment for the transaction to be processed
  await new Promise((resolve) => setTimeout(resolve, 1000))

  console.log('=== Attempting Schema-Breaking Changes ===')
  console.log('Desired schema changes:')
  console.log('  - Global uints: 2 → 3 (adding storage) ⚠️  BREAKING')
  console.log('  - Global byte slices: 1 → 1 (no change)')
  console.log('  - Local uints: 1 → 1 (no change)')
  console.log('  - Local byte slices: 0 → 2 (adding storage) ⚠️  BREAKING')
  console.log()
  console.log('These changes BREAK the schema because we are INCREASING storage.')
  console.log('Algorand does NOT allow updating an app to increase storage!')
  console.log()

  console.log('Demonstrating that update fails with schema increase...')
  try {
    await algorand.send.appUpdate({
      sender: deployer.addr,
      appId: appId1,
      approvalProgram,
      clearStateProgram: clearProgram,
    })
    console.log('   ❌ Unexpected: Update succeeded (should have failed!)')
  } catch (error: any) {
    console.log('   ✅ Update rejected as expected')
    console.log('   Error:', error.message.split('\n')[0])
  }
  console.log()

  console.log('=== Solution: Delete Old App and Create New One ===')
  console.log('Step 1: Delete the old app...')

  await algorand.send.appDelete({
    sender: deployer.addr,
    appId: appId1,
  })

  console.log('   ✅ Old app deleted successfully')
  console.log()

  // Verify deletion
  console.log('Step 2: Verify old app no longer exists...')
  try {
    await algorand.client.algod.getApplicationByID(Number(appId1)).do()
    console.log('   ❌ Old app still exists (unexpected!)')
  } catch (error: any) {
    if (error.message.includes('application does not exist')) {
      console.log('   ✅ Old app confirmed deleted')
    }
  }
  console.log()

  // Update approval program with new version
  const approvalProgramV2 = `#pragma version 10

txn ApplicationID
int 0
==
bnz create

// On update
txn OnCompletion
int UpdateApplication
==
bnz handle_update

// On delete
txn OnCompletion
int DeleteApplication
==
bnz handle_delete

// Default: approve
int 1
return

create:
// Store version in global state
byte "version"
byte "2.0"
app_global_put
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

  console.log('Step 3: Create new app with increased schema...')

  // Deploy with increased schema
  const appResult2 = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: approvalProgramV2,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 3, // Changed: 2 → 3 (was breaking, but now fresh app!)
      globalByteSlices: 1, // Unchanged
      localInts: 1, // Unchanged
      localByteSlices: 2, // Changed: 0 → 2 (was breaking, but now fresh app!)
    },
  })

  const appId2 = appResult2.appId
  const appAddress2 = algosdk.getApplicationAddress(appId2)
  console.log('   ✅ New app created successfully!')
  console.log('   New App ID:', appId2)
  console.log('   Old App ID:', appId1)
  console.log('   App IDs are different:', appId2 !== appId1 ? '✅ YES' : '❌ NO')
  console.log('   New App Address:', appAddress2)
  console.log('   Schema (Global): 3 uints, 1 byte slice')
  console.log('   Schema (Local): 1 uint, 2 byte slices')
  console.log()

  // Fetch and display the new app info
  const appInfo2 = await algorand.client.algod.getApplicationByID(Number(appId2)).do()
  console.log('New app details:')
  console.log('   Global state schema:', appInfo2.params.globalStateSchema)
  console.log('   Local state schema:', appInfo2.params.localStateSchema)
  console.log()

  console.log('=== Understanding Schema-Breaking Changes ===\n')
  console.log('What is a schema-breaking change?')
  console.log('  A change that INCREASES the storage requirements of an app.\n')

  console.log('Schema-breaking changes occur when you:')
  console.log('  ❌ Increase the number of global uints')
  console.log('  ❌ Increase the number of global byte slices')
  console.log('  ❌ Increase the number of local uints')
  console.log('  ❌ Increase the number of local byte slices\n')

  console.log('Non-breaking changes (allowed during update):')
  console.log('  ✅ Decrease storage (reduce uints or byte slices)')
  console.log('  ✅ Keep storage the same')
  console.log('  ✅ Change the TEAL logic')
  console.log('  ✅ Change program version\n')

  console.log('Why does Algorand restrict this?')
  console.log('  • Each account that opts into an app allocates storage')
  console.log('  • Increasing storage would require all opted-in accounts to pay more')
  console.log('  • This could happen without their consent')
  console.log('  • Algorand prevents this by blocking storage increases\n')

  console.log('Solution: Delete and Recreate')
  console.log('  1. Delete old app (requires deletable: true in TEAL)')
  console.log('  2. Create new app with increased schema')
  console.log('  3. Migrate global state if needed')
  console.log('  4. Notify users to opt-in to new app')
  console.log('  5. Update references to use new app ID\n')

  console.log('=== Important Trade-offs of Replacement ===\n')
  console.log('Consequences:')
  console.log('  ⚠️  All global state is LOST (reset to empty)')
  console.log('  ⚠️  Users must RE-OPT-IN to the new app')
  console.log('  ⚠️  All local state is LOST for all users')
  console.log('  ⚠️  The app gets a NEW ID (update all references!)')
  console.log('  ⚠️  Smart contracts referencing old app will break')
  console.log('  ⚠️  Frontend code needs to use new app ID\n')

  console.log('Benefits:')
  console.log('  ✅ You get the new schema you need')
  console.log('  ✅ Fresh start with clean state')
  console.log('  ✅ Can redesign state structure')
  console.log('  ✅ Remove technical debt\n')

  console.log('=== Best Practices ===\n')
  console.log('1. Plan schema with buffer space')
  console.log('   Example: Need 2 uints? Allocate 5 for future growth\n')

  console.log('2. Use box storage for dynamic data')
  console.log('   Box storage can grow without schema changes\n')

  console.log('3. Version your state keys')
  console.log('   Example: "balance_v1", "balance_v2" for easier migration\n')

  console.log('4. Test schema changes on TestNet first')
  console.log('   Validate your migration strategy before MainNet\n')

  console.log('5. Document schema requirements')
  console.log('   Maintain documentation of current and planned schema needs\n')

  console.log('6. Make apps deletable during development')
  console.log('   Allows easier iteration on schema design\n')

  console.log('7. Consider immutability for production')
  console.log('   Once schema is finalized, make app non-deletable for security\n')

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
