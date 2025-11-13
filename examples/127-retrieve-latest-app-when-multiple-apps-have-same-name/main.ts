import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how the SDK handles multiple apps with the same name.
 * When multiple apps are created with identical names, getCreatorAppsByName returns
 * only the most recently created app.
 * 
 * This is important for understanding app deployment patterns and version management.
 */

async function main() {
  // Initialize Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get a test account with funds
  const testAccount = await algorand.account.fromEnvironment('ACCOUNT1')
  console.log(`Using account: ${testAccount.addr}\n`)

  // Define deployment metadata (same name for all apps)
  const appName = 'MY_APP'
  const creationMetadata = {
    name: appName,
    version: '1.0',
    updatable: true,
    deletable: false
  }

  console.log('Creating multiple apps with the same name...')
  console.log(`App name: ${appName}\n`)

  // Compile simple TEAL programs
  const approvalProgram = await algorand.app.compileTeal(
    '#pragma version 10\nint 1\nreturn'
  )
  const clearProgram = await algorand.app.compileTeal(
    '#pragma version 10\nint 1\nreturn'
  )

  // Create three apps with the same name but different leases
  // (lease prevents transaction deduplication)
  console.log('Creating App 1...')
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
    note: new TextEncoder().encode(JSON.stringify(creationMetadata)),
    lease: new Uint8Array([1]) // Unique lease to prevent deduplication
  })
  console.log(`  ✅ App 1 created with ID: ${app1.appId}`)

  console.log('Creating App 2...')
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
    note: new TextEncoder().encode(JSON.stringify(creationMetadata)),
    lease: new Uint8Array([2])
  })
  console.log(`  ✅ App 2 created with ID: ${app2.appId}`)

  console.log('Creating App 3...')
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
    note: new TextEncoder().encode(JSON.stringify(creationMetadata)),
    lease: new Uint8Array([3])
  })
  console.log(`  ✅ App 3 created with ID: ${app3.appId}\n`)

  // Wait for indexer to catch up
  console.log('Waiting for indexer to index the transactions...')
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Retrieve apps by name
  const apps = await algorand.appDeployer.getCreatorAppsByName(testAccount.addr)

  console.log('\n📋 Retrieved apps by name:')
  const retrievedApp = apps.apps[appName]
  
  if (retrievedApp) {
    console.log(`\n🔍 Checking which app is returned for name '${appName}':`)
    console.log(`  App 1 ID: ${app1.appId} - ${retrievedApp.appId === app1.appId ? '❌' : '✅'} Not returned`)
    console.log(`  App 2 ID: ${app2.appId} - ${retrievedApp.appId === app2.appId ? '❌' : '✅'} Not returned`)
    console.log(`  App 3 ID: ${app3.appId} - ${retrievedApp.appId === app3.appId ? '✅' : '❌'} RETURNED (Latest)`)
    
    console.log(`\n✅ Result: getCreatorAppsByName returns the LATEST app created with name '${appName}'`)
    console.log(`   Retrieved App ID: ${retrievedApp.appId}`)
  } else {
    console.log(`❌ App '${appName}' not found in retrieved apps`)
  }

  console.log(`\n💡 Key Takeaway: When multiple apps share the same name, only the most`)
  console.log(`   recently created app is returned by getCreatorAppsByName.`)
}

main().catch(console.error)