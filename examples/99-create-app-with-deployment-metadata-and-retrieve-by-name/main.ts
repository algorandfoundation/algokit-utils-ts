import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to:
 * 1. Create an Algorand application with deployment metadata
 * 2. Retrieve the app by creator address and name
 * 3. Verify all metadata fields are correctly stored
 */

async function main() {
  // Initialize Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get a test account with funds
  const testAccount = await algorand.account.fromEnvironment('ACCOUNT1')
  console.log(`Using account: ${testAccount.addr}\n`)

  // Define deployment metadata
  const appName = 'MY_APP'
  const creationMetadata = {
    name: appName,
    version: '1.0',
    updatable: true,
    deletable: false
  }

  console.log('Creating app with metadata:')
  console.log(JSON.stringify(creationMetadata, null, 2))
  console.log()

  // Create a simple app (using approval and clear programs)
  // In production, replace these with your actual TEAL programs
  const approvalProgram = await algorand.app.compileTeal(
    '#pragma version 10\nint 1\nreturn'
  )
  const clearProgram = await algorand.app.compileTeal(
    '#pragma version 10\nint 1\nreturn'
  )

  // Create the app with metadata
  const appCreateResult = await algorand.send.appCreate({
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
    // Include metadata in the transaction note
    note: new TextEncoder().encode(JSON.stringify(creationMetadata))
  })

  console.log(`✅ App created successfully!`)
  console.log(`App ID: ${appCreateResult.appId}`)
  console.log(`App Address: ${appCreateResult.appAddress}`)
  console.log(`Confirmed in round: ${appCreateResult.confirmation.confirmedRound}\n`)

  // Wait for indexer to catch up (important for LocalNet)
  console.log('Waiting for indexer to index the transaction...')
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Retrieve apps by name for this creator
  const apps = await algorand.appDeployer.getCreatorAppsByName(testAccount.addr)

  console.log('\n📋 Retrieved apps by name:')
  console.log(`Creator: ${apps.creator}`)
  console.log(`Apps found: ${Object.keys(apps.apps).join(', ')}\n`)

  // Get the specific app we just created
  const retrievedApp = apps.apps[appName]
  
  if (retrievedApp) {
    console.log('✅ App metadata verification:')
    console.log(`  App ID: ${retrievedApp.appId}`)
    console.log(`  App Address: ${retrievedApp.appAddress}`)
    console.log(`  Name: ${retrievedApp.name}`)
    console.log(`  Version: ${retrievedApp.version}`)
    console.log(`  Updatable: ${retrievedApp.updatable}`)
    console.log(`  Deletable: ${retrievedApp.deletable}`)
    console.log(`  Created Round: ${retrievedApp.createdRound}`)
    console.log(`  Updated Round: ${retrievedApp.updatedRound}`)
    console.log(`\n  Created Metadata:`, retrievedApp.createdMetadata)
    
    // Verify the data matches
    const isValid = 
      retrievedApp.appId === appCreateResult.appId &&
      retrievedApp.name === creationMetadata.name &&
      retrievedApp.version === creationMetadata.version &&
      retrievedApp.updatable === creationMetadata.updatable &&
      retrievedApp.deletable === creationMetadata.deletable
    
    console.log(`\n${isValid ? '✅' : '❌'} Metadata verification: ${isValid ? 'PASSED' : 'FAILED'}`)
  } else {
    console.log(`❌ App '${appName}' not found in retrieved apps`)
  }
}

main().catch(console.error)