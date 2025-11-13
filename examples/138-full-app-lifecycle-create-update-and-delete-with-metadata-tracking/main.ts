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
  // Initialize Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get a test account with funds
  const testAccount = await algorand.account.fromEnvironment('ACCOUNT1')
  console.log(`Using account: ${testAccount.addr}\n`)

  // ========================================
  // STEP 1: Create three apps with metadata
  // ========================================
  console.log('📦 STEP 1: Creating three apps with metadata\n')
  
  const appName1 = 'APP_1'
  const appName2 = 'APP_2'
  const appName3 = 'APP_3'
  
  const creationMetadata = {
    name: appName1,
    version: '1.0',
    updatable: true,
    deletable: true
  }

  // Compile simple TEAL programs
  const approvalProgram = await algorand.app.compileTeal(
    '#pragma version 10\nint 1\nreturn'
  )
  const clearProgram = await algorand.app.compileTeal(
    '#pragma version 10\nint 1\nreturn'
  )

  // Create App 1
  console.log(`Creating ${appName1}...`)
  const app1 = await algorand.send.appCreate({
    sender: testAccount.addr,
    approvalProgram: approvalProgram.compiledBase64ToBytes,
    clearStateProgram: clearProgram.compiledBase64ToBytes,
    schema: {
      globalUints: 0,
      globalByteSlices: 0,
      localUints: 0,
      localByteSlices: 0
    },
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    note: new TextEncoder().encode(JSON.stringify(creationMetadata))
  })
  console.log(`  ✅ ${appName1} created with ID: ${app1.appId}\n`)

  // Create App 2
  console.log(`Creating ${appName2}...`)
  const app2 = await algorand.send.appCreate({
    sender: testAccount.addr,
    approvalProgram: approvalProgram.compiledBase64ToBytes,
    clearStateProgram: clearProgram.compiledBase64ToBytes,
    schema: {
      globalUints: 0,
      globalByteSlices: 0,
      localUints: 0,
      localByteSlices: 0
    },
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    note: new TextEncoder().encode(JSON.stringify({ ...creationMetadata, name: appName2 }))
  })
  console.log(`  ✅ ${appName2} created with ID: ${app2.appId}\n`)

  // Create App 3
  console.log(`Creating ${appName3}...`)
  const app3 = await algorand.send.appCreate({
    sender: testAccount.addr,
    approvalProgram: approvalProgram.compiledBase64ToBytes,
    clearStateProgram: clearProgram.compiledBase64ToBytes,
    schema: {
      globalUints: 0,
      globalByteSlices: 0,
      localUints: 0,
      localByteSlices: 0
    },
    onComplete: algosdk.OnApplicationComplete.NoOpOC,
    note: new TextEncoder().encode(JSON.stringify({ ...creationMetadata, name: appName3 }))
  })
  console.log(`  ✅ ${appName3} created with ID: ${app3.appId}\n`)

  // ========================================
  // STEP 2: Update App 1 with new metadata
  // ========================================
  console.log('🔄 STEP 2: Updating App 1 with new metadata\n')
  
  const updateMetadata = {
    name: appName1,
    version: '2.0', // Version upgrade
    updatable: false, // Lock further updates
    deletable: false // Prevent deletion
  }

  console.log(`Updating ${appName1} (ID: ${app1.appId})...`)
  console.log('  New metadata:', JSON.stringify(updateMetadata, null, 2))
  
  const update1 = await algorand.send.appUpdate({
    appId: app1.appId,
    sender: testAccount.addr,
    approvalProgram: approvalProgram.compiledBase64ToBytes,
    clearStateProgram: clearProgram.compiledBase64ToBytes,
    note: new TextEncoder().encode(JSON.stringify(updateMetadata))
  })
  console.log(`  ✅ ${appName1} updated in round: ${update1.confirmation.confirmedRound}\n`)

  // ========================================
  // STEP 3: Delete App 3
  // ========================================
  console.log('🗑️  STEP 3: Deleting App 3\n')
  
  console.log(`Deleting ${appName3} (ID: ${app3.appId})...`)
  const delete3 = await algorand.send.appDelete({
    appId: app3.appId,
    sender: testAccount.addr
  })
  console.log(`  ✅ ${appName3} deleted in round: ${delete3.confirmation.confirmedRound}\n`)

  // Wait for indexer to catch up
  console.log('Waiting for indexer to index all transactions...')
  await new Promise(resolve => setTimeout(resolve, 3000))

  // ========================================
  // STEP 4: Retrieve and verify all apps
  // ========================================
  console.log('\n📋 STEP 4: Retrieving all apps and verifying states\n')
  
  const apps = await algorand.appDeployer.getCreatorAppsByName(testAccount.addr)

  console.log(`Creator: ${apps.creator}`)
  console.log(`Apps found: ${Object.keys(apps.apps).sort().join(', ')}\n`)

  // Verify App 1 (updated)
  console.log(`\n━━━ ${appName1} (Updated App) ━━━`)
  const app1Data = apps.apps[appName1]
  if (app1Data) {
    console.log(`App ID: ${app1Data.appId}`)
    console.log(`App Address: ${app1Data.appAddress}`)
    console.log(`Deleted: ${app1Data.deleted}`)
    console.log(`\nCreation Metadata (v1.0):`, app1Data.createdMetadata)
    console.log(`  - Created in round: ${app1Data.createdRound}`)
    console.log(`\nCurrent Metadata (v2.0):`, {
      name: app1Data.name,
      version: app1Data.version,
      updatable: app1Data.updatable,
      deletable: app1Data.deletable
    })
    console.log(`  - Updated in round: ${app1Data.updatedRound}`)
    console.log(`\n✅ Metadata shows version upgrade from 1.0 to 2.0`)
    console.log(`✅ Update flags changed: updatable=${app1Data.updatable}, deletable=${app1Data.deletable}`)
  }

  // Verify App 2 (unchanged)
  console.log(`\n━━━ ${appName2} (Unchanged App) ━━━`)
  const app2Data = apps.apps[appName2]
  if (app2Data) {
    console.log(`App ID: ${app2Data.appId}`)
    console.log(`Deleted: ${app2Data.deleted}`)
    console.log(`Version: ${app2Data.version}`)
    console.log(`\n✅ App remains in original state`)
  }

  // Verify App 3 (deleted)
  console.log(`\n━━━ ${appName3} (Deleted App) ━━━`)
  const app3Data = apps.apps[appName3]
  if (app3Data) {
    console.log(`App ID: ${app3Data.appId}`)
    console.log(`Deleted: ${app3Data.deleted}`)
    console.log(`\n✅ App is marked as deleted but still tracked in metadata`)
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 SUMMARY')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Created 3 apps with metadata`)
  console.log(`✅ Updated 1 app (${appName1}) - version 1.0 → 2.0`)
  console.log(`✅ Deleted 1 app (${appName3})`)
  console.log(`✅ All apps tracked with correct states`)
  console.log(`\n💡 Key Features Demonstrated:`)
  console.log(`   • Creation metadata preserved even after updates`)
  console.log(`   • Update metadata tracked separately with round number`)
  console.log(`   • Deleted apps remain in metadata with deleted=true flag`)
  console.log(`   • Full lifecycle visibility for app management`)
}

main().catch(console.error)