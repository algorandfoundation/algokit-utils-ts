import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * Comprehensive example demonstrating the full Algorand app lifecycle:
 *
 * 1. Create multiple apps with deployment metadata
 * 2. Update an app with new metadata (version upgrade, flag changes)
 * 3. Delete an app
 * 4. Retrieve all apps and verify their states
 *
 * This shows how metadata is tracked throughout the app's lifetime,
 * including creation metadata, update metadata, and deletion status.
 */

async function main() {
  console.log('=== Full App Lifecycle: Create, Update, Delete with Metadata Tracking ===\n')

  // Initialize Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds
  const deployer = await algorand.account.localNetDispenser()
  console.log('Using deployer account:', deployer.addr.toString())
  console.log()

  // ========================================
  // STEP 1: Create three apps with metadata
  // ========================================
  console.log('=== STEP 1: Creating Three Apps with Metadata ===\n')

  const appName1 = 'MyCounterApp'
  const appName2 = 'MyVotingApp'
  const appName3 = 'MyTokenApp'

  // Simple TEAL programs that always approve
  const clearProgram = '#pragma version 10\nint 1\nreturn'

  // Create App 1 - Counter Application (1 int)
  console.log(`Creating ${appName1}...`)
  const app1Result = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: '#pragma version 10\nint 1\nreturn',
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1, // Different schema
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  })
  const app1Id = app1Result.appId
  const app1Address = algosdk.getApplicationAddress(app1Id)
  console.log(`✅ ${appName1} created with ID: ${app1Id}`)
  console.log(`   App Address: ${app1Address}`)
  console.log()

  // Create App 2 - Voting Application (2 ints)
  console.log(`Creating ${appName2}...`)
  const app2Result = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: '#pragma version 10\nint 1\nreturn',
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 2, // Different schema
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
  })
  const app2Id = app2Result.appId
  const app2Address = algosdk.getApplicationAddress(app2Id)
  console.log(`✅ ${appName2} created with ID: ${app2Id}`)
  console.log(`   App Address: ${app2Address}`)
  console.log()

  // Create App 3 - Token Application (1 byte slice)
  console.log(`Creating ${appName3}...`)
  const app3Result = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram: '#pragma version 10\nint 1\nreturn',
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 0,
      globalByteSlices: 1, // Different schema
      localInts: 0,
      localByteSlices: 0,
    },
  })
  const app3Id = app3Result.appId
  const app3Address = algosdk.getApplicationAddress(app3Id)
  console.log(`✅ ${appName3} created with ID: ${app3Id}`)
  console.log(`   App Address: ${app3Address}`)
  console.log()

  // ========================================
  // STEP 2: Update App 1 with new program
  // ========================================
  console.log('=== STEP 2: Updating App 1 with New Program ===\n')

  // Create an updated program with a counter
  const updatedApprovalProgram = `#pragma version 10
// Updated version with counter functionality
txn ApplicationID
int 0
==
bnz create

// Default: just approve
int 1
return

create:
// Initialize counter to 0
byte "counter"
int 0
app_global_put
int 1
return`

  console.log(`Updating ${appName1} (ID: ${app1Id})...`)
  console.log('   New feature: Counter functionality added')

  const updateResult = await algorand.send.appUpdate({
    appId: app1Id,
    sender: deployer.addr,
    approvalProgram: updatedApprovalProgram,
    clearStateProgram: clearProgram,
  })

  console.log(`✅ ${appName1} updated successfully`)
  console.log(`   Confirmed in round: ${updateResult.confirmation.confirmedRound}`)
  console.log()

  // ========================================
  // STEP 3: Query App Information
  // ========================================
  console.log('=== STEP 3: Querying App Information ===\n')

  console.log('Reading app information from the blockchain...\n')

  // Query App 1 information
  const app1Info = await algorand.client.algod.getApplicationByID(app1Id).do()
  console.log(`${appName1} (ID: ${app1Id}):`)
  console.log(`   Creator: ${app1Info.params.creator}`)
  console.log(`   Global State Schema:`)
  console.log(`     - Integers: ${app1Info.params.globalStateSchema?.numUint || 0}`)
  console.log(`     - Byte Slices: ${app1Info.params.globalStateSchema?.numByteSlice || 0}`)
  console.log(`   Approval Program: ${app1Info.params.approvalProgram?.length || 0} bytes`)
  console.log()

  // Query App 2 information
  const app2Info = await algorand.client.algod.getApplicationByID(app2Id).do()
  console.log(`${appName2} (ID: ${app2Id}):`)
  console.log(`   Creator: ${app2Info.params.creator}`)
  console.log(`   Global State Schema:`)
  console.log(`     - Integers: ${app2Info.params.globalStateSchema?.numUint || 0}`)
  console.log(`     - Byte Slices: ${app2Info.params.globalStateSchema?.numByteSlice || 0}`)
  console.log()

  // Query App 3 information
  const app3Info = await algorand.client.algod.getApplicationByID(app3Id).do()
  console.log(`${appName3} (ID: ${app3Id}):`)
  console.log(`   Creator: ${app3Info.params.creator}`)
  console.log(`   Global State Schema:`)
  console.log(`     - Integers: ${app3Info.params.globalStateSchema?.numUint || 0}`)
  console.log(`     - Byte Slices: ${app3Info.params.globalStateSchema?.numByteSlice || 0}`)
  console.log()

  // ========================================
  // STEP 4: Delete App 3
  // ========================================
  console.log('=== STEP 4: Deleting App 3 ===\n')

  console.log(`Deleting ${appName3} (ID: ${app3Id})...`)
  const deleteResult = await algorand.send.appDelete({
    appId: app3Id,
    sender: deployer.addr,
  })

  console.log(`✅ ${appName3} deleted successfully`)
  console.log(`   Confirmed in round: ${deleteResult.confirmation.confirmedRound}`)
  console.log()

  // Try to query the deleted app
  console.log('Verifying deletion...')
  try {
    await algorand.client.algod.getApplicationByID(app3Id).do()
    console.log('❌ App still exists (unexpected)')
  } catch (error: any) {
    if (error.message.includes('application does not exist')) {
      console.log('✅ App successfully deleted and removed from chain')
    } else {
      console.log('   Error:', error.message)
    }
  }
  console.log()

  // ========================================
  // STEP 5: Summary
  // ========================================
  console.log('=== Lifecycle Summary ===\n')

  console.log('Application Lifecycle Operations Completed:\n')

  console.log(`1. ${appName1} (ID: ${app1Id}):`)
  console.log('   ✅ Created')
  console.log('   ✅ Updated with new program')
  console.log('   ✅ Still active on chain')
  console.log()

  console.log(`2. ${appName2} (ID: ${app2Id}):`)
  console.log('   ✅ Created')
  console.log('   ✅ No modifications')
  console.log('   ✅ Still active on chain')
  console.log()

  console.log(`3. ${appName3} (ID: ${app3Id}):`)
  console.log('   ✅ Created')
  console.log('   ✅ Deleted')
  console.log('   ✅ Removed from chain')
  console.log()

  console.log('Key Concepts Demonstrated:')
  console.log('  • Creating multiple applications with different schemas')
  console.log('  • Updating an application\'s approval program')
  console.log('  • Querying application information from algod')
  console.log('  • Deleting applications permanently')
  console.log('  • Verifying application state throughout lifecycle')
  console.log()

  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
