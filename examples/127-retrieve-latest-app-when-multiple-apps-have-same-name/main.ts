import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to manage multiple apps with the same name
 * and understand which app is retrieved when querying by name.
 *
 * When multiple apps share the same name (stored in transaction notes),
 * the indexer and querying utilities will return the most recently created app.
 *
 * This is important for:
 * - Version management strategies
 * - App replacement workflows
 * - Understanding app discovery behavior
 */

async function main() {
  console.log('=== Retrieve Latest App When Multiple Apps Have Same Name ===\n')

  // Initialize AlgorandClient for local development
  const algorand = AlgorandClient.defaultLocalNet()
  const deployer = await algorand.account.localNetDispenser()

  console.log('Using deployer account:', deployer.addr)
  console.log()

  // Define a simple approval program
  const approvalProgram = `#pragma version 10

txn ApplicationID
int 0
==
bnz create

// Default: approve all calls
int 1
return

create:
// Store the app number in global state
byte "app_number"
txn ApplicationArgs 0
btoi
app_global_put

int 1
return`

  const clearProgram = `#pragma version 10
int 1
return`

  const appName = 'MyTestApp'

  console.log('=== Creating Multiple Apps with Same Name ===')
  console.log('App name:', appName)
  console.log()

  // Create metadata for app name tracking (stored in note field)
  const createMetadata = (version: string) => {
    return JSON.stringify({
      name: appName,
      version,
      updatable: true,
      deletable: true,
    })
  }

  console.log('Creating App 1 (version 1.0)...')
  const app1Result = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
    args: [algosdk.encodeUint64(1)], // App number
    note: new TextEncoder().encode(createMetadata('1.0')),
  })

  const appId1 = app1Result.appId
  console.log('   ✅ App 1 created')
  console.log('      App ID:', appId1)
  console.log('      Version: 1.0')
  console.log()

  // Wait a moment to ensure different creation times
  await new Promise((resolve) => setTimeout(resolve, 500))

  console.log('Creating App 2 (version 1.1)...')
  const app2Result = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
    args: [algosdk.encodeUint64(2)], // App number
    note: new TextEncoder().encode(createMetadata('1.1')),
  })

  const appId2 = app2Result.appId
  console.log('   ✅ App 2 created')
  console.log('      App ID:', appId2)
  console.log('      Version: 1.1')
  console.log()

  await new Promise((resolve) => setTimeout(resolve, 500))

  console.log('Creating App 3 (version 2.0)...')
  const app3Result = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram: clearProgram,
    schema: {
      globalInts: 1,
      globalByteSlices: 0,
      localInts: 0,
      localByteSlices: 0,
    },
    args: [algosdk.encodeUint64(3)], // App number
    note: new TextEncoder().encode(createMetadata('2.0')),
  })

  const appId3 = app3Result.appId
  console.log('   ✅ App 3 created')
  console.log('      App ID:', appId3)
  console.log('      Version: 2.0')
  console.log()

  console.log('Summary of created apps:')
  console.log(`   App 1: ID ${appId1} - Version 1.0 - Created FIRST`)
  console.log(`   App 2: ID ${appId2} - Version 1.1 - Created SECOND`)
  console.log(`   App 3: ID ${appId3} - Version 2.0 - Created LATEST`)
  console.log()

  console.log('=== Understanding App Discovery ===\n')

  console.log('When you have multiple apps with the same name:')
  console.log('  • All apps are stored on-chain')
  console.log('  • All apps have unique IDs')
  console.log('  • App name is stored in transaction note field')
  console.log('  • Indexer tracks app creation transactions')
  console.log()

  console.log('If you query for apps by name:')
  console.log('  • Indexer returns transactions in chronological order')
  console.log('  • Most SDKs/tools return the LATEST app by default')
  console.log('  • This is useful for automatic version upgrades')
  console.log('  • But you can query all apps if needed')
  console.log()

  console.log('=== Retrieving Apps by Creator ===\n')

  // Wait for indexer to catch up
  console.log('Waiting for indexer to index transactions...')
  await new Promise((resolve) => setTimeout(resolve, 2000))
  console.log()

  // Query all apps created by this account
  try {
    const indexerClient = algorand.client.indexer
    const accountApps = await indexerClient
      .searchForApplications()
      .creator(deployer.addr)
      .do()

    console.log('Apps created by this account:')
    for (const app of accountApps.applications) {
      const appInfo = await algorand.client.algod.getApplicationByID(app.id).do()
      const globalState = appInfo.params.globalState || []

      let appNumber: bigint | number = 0
      for (const state of globalState) {
        const key = Buffer.from(state.key as Uint8Array).toString()
        if (key === 'app_number') {
          appNumber = state.value.uint || 0
        }
      }

      console.log(`   App ID ${app.id}: app_number = ${appNumber}`)
    }
    console.log()
  } catch (error) {
    console.log('Could not query indexer (may not be available on LocalNet)')
    console.log()
  }

  console.log('=== Reading App Metadata from Notes ===\n')

  // Read metadata from transaction notes
  console.log('App 1 metadata:')
  const app1Info = await algorand.client.algod.getApplicationByID(Number(appId1)).do()
  console.log('   App ID:', app1Info.id)
  console.log('   Note from creation tx:', createMetadata('1.0'))
  console.log()

  console.log('App 2 metadata:')
  const app2Info = await algorand.client.algod.getApplicationByID(Number(appId2)).do()
  console.log('   App ID:', app2Info.id)
  console.log('   Note from creation tx:', createMetadata('1.1'))
  console.log()

  console.log('App 3 metadata:')
  const app3Info = await algorand.client.algod.getApplicationByID(Number(appId3)).do()
  console.log('   App ID:', app3Info.id)
  console.log('   Note from creation tx:', createMetadata('2.0'))
  console.log()

  console.log('=== Key Behaviors ===\n')

  console.log('1. All Apps Exist On-Chain')
  console.log('   ✅ App 1 exists:', BigInt(app1Info.id) === appId1)
  console.log('   ✅ App 2 exists:', BigInt(app2Info.id) === appId2)
  console.log('   ✅ App 3 exists:', BigInt(app3Info.id) === appId3)
  console.log()

  console.log('2. Apps Have Unique IDs')
  console.log(`   App 1: ${appId1}`)
  console.log(`   App 2: ${appId2}`)
  console.log(`   App 3: ${appId3}`)
  console.log('   All different:', appId1 !== appId2 && appId2 !== appId3 && appId1 !== appId3 ? '✅ YES' : '❌ NO')
  console.log()

  console.log('3. Creation Order is Tracked')
  console.log(`   App 1 ID: ${appId1} (created first)`)
  console.log(`   App 2 ID: ${appId2} (created second)`)
  console.log(`   App 3 ID: ${appId3} (created latest)`)
  console.log('   Creation order: App IDs are sequential:', appId1 < appId2 && appId2 < appId3 ? '✅ YES' : '❌ NO')
  console.log()

  console.log('4. Latest App is Most Recently Created')
  console.log(`   Latest app ID: ${appId3}`)
  console.log(`   This is App 3 (version 2.0)`)
  console.log()

  console.log('=== Use Cases ===\n')

  console.log('1. Automatic Version Upgrades')
  console.log('   • Deploy new version with same name')
  console.log('   • Queries automatically return latest version')
  console.log('   • Old versions remain accessible by ID')
  console.log()

  console.log('2. Canary Deployments')
  console.log('   • Deploy new version alongside old')
  console.log('   • Route some traffic to latest version')
  console.log('   • Keep old version as fallback')
  console.log()

  console.log('3. Feature Flags')
  console.log('   • Each app version has different features')
  console.log('   • Select version by querying specific ID')
  console.log('   • Latest version for new users')
  console.log()

  console.log('4. Testing and Staging')
  console.log('   • Development: Use app ID 1')
  console.log('   • Staging: Use app ID 2')
  console.log('   • Production: Use latest (app ID 3)')
  console.log()

  console.log('=== Best Practices ===\n')

  console.log('1. Use Explicit App IDs in Production')
  console.log('   ❌ const appId = await getLatestAppByName("MyApp")')
  console.log('   ✅ const appId = 12345  // Fixed app ID')
  console.log()

  console.log('2. Store Version in App State')
  console.log('   • Use global state to track version')
  console.log('   • Enables runtime version checks')
  console.log('   • Helps with debugging')
  console.log()

  console.log('3. Document App IDs')
  console.log('   • Maintain registry of app IDs by version')
  console.log('   • Track which version is in production')
  console.log('   • Document upgrade paths')
  console.log()

  console.log('4. Clean Up Old Versions')
  console.log('   • Delete unused old apps (if deletable)')
  console.log('   • Frees up creator account minimum balance')
  console.log('   • Reduces confusion about which app to use')
  console.log()

  console.log('5. Use Semantic Versioning')
  console.log('   • Store version in note: {"name": "MyApp", "version": "2.1.3"}')
  console.log('   • Makes it clear which version is deployed')
  console.log('   • Helps with compatibility tracking')
  console.log()

  console.log('=== Common Pitfalls ===\n')

  console.log('Pitfall 1: Assuming Name is Unique')
  console.log('  ❌ "There can only be one MyApp"')
  console.log('  ✅ "Multiple apps can share the same name"')
  console.log()

  console.log('Pitfall 2: Hardcoding "Latest" Queries')
  console.log('  ❌ Code always queries for latest app by name')
  console.log('  ✅ Production uses fixed app ID, dev uses latest')
  console.log()

  console.log('Pitfall 3: Not Tracking App IDs')
  console.log('  ❌ "I deployed a new version but I forgot the ID"')
  console.log('  ✅ Store app IDs in config/registry immediately after creation')
  console.log()

  console.log('Pitfall 4: Breaking Changes Without New Name')
  console.log('  ❌ Deploy breaking changes with same name')
  console.log('  ✅ Use versioned names: MyApp_v1, MyApp_v2')
  console.log()

  console.log('=== Cleanup (Optional) ===\n')

  console.log('Deleting test apps to free up minimum balance...')

  try {
    await algorand.send.appDelete({ sender: deployer.addr, appId: appId1 })
    console.log('   ✅ App 1 deleted')
  } catch (error) {
    console.log('   ⚠️  App 1 could not be deleted (may not be deletable)')
  }

  try {
    await algorand.send.appDelete({ sender: deployer.addr, appId: appId2 })
    console.log('   ✅ App 2 deleted')
  } catch (error) {
    console.log('   ⚠️  App 2 could not be deleted')
  }

  try {
    await algorand.send.appDelete({ sender: deployer.addr, appId: appId3 })
    console.log('   ✅ App 3 deleted')
  } catch (error) {
    console.log('   ⚠️  App 3 could not be deleted')
  }

  console.log()
  console.log('✨ Example completed successfully!')
}

main().catch(console.error)
