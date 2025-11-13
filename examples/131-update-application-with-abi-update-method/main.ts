import * as algokit from '@algorandfoundation/algokit-utils'
import { OnApplicationComplete } from 'algosdk'

// This example demonstrates updating an application using an ABI update method
// The update method can accept arguments and return values

async function updateAppWithAbiMethod() {
  // Initialize AlgoKit and get clients
  const algod = algokit.getAlgoClient(algokit.getDefaultLocalNetConfig('algod'))
  const indexer = algokit.getAlgoClient(algokit.getDefaultLocalNetConfig('indexer'))
  const account = await algokit.getLocalNetDispenserAccount(algod)

  // Load your application specification
  const appSpec = '<YOUR_APP_SPEC>' // Replace with your actual app spec

  console.log('Setting up app client...')
  
  // Create an app client
  const client = algokit.getAppClient(
    {
      resolveBy: 'creatorAndName',
      app: appSpec,
      sender: account,
      creatorAddress: account.addr,
      findExistingUsing: indexer,
    },
    algod,
  )

  console.log('\n=== INITIAL DEPLOYMENT ===')
  console.log('Creating application with VALUE=1...')
  
  // First deployment - create the application
  const createdApp = await client.deploy({
    version: '1.0',
    deployTimeParams: {
      VALUE: 1,
    },
    allowUpdate: true, // Must allow updates
  })

  console.log(`✅ Application created`)
  console.log(`App ID: ${createdApp.appId}`)
  console.log(`Created in Round: ${createdApp.createdRound}`)

  console.log('\n=== UPDATING WITH ABI METHOD ===')
  console.log('Updating application with VALUE=2 and calling update_abi method...')
  
  // Second deployment - update with ABI method
  const updatedApp = await client.deploy({
    version: '1.0',
    deployTimeParams: {
      VALUE: 2, // Updated parameter
    },
    onUpdate: 'update', // Perform an update
    updateArgs: {
      // Specify the ABI method to call during update
      method: 'update_abi', // Name of your ABI update method
      methodArgs: ['arg_io'], // Arguments to pass to the update method
    },
  })

  // Verify the update operation
  if (updatedApp.operationPerformed === 'update') {
    console.log('✅ Update operation performed successfully')
    
    // Verify it's the same app
    console.log(`\nApp Identity:`)
    console.log(`  App ID: ${updatedApp.appId} (same: ${updatedApp.appId === createdApp.appId})`)
    console.log(`  App Address: ${updatedApp.appAddress} (same: ${updatedApp.appAddress === createdApp.appAddress})`)
    
    // Check round information
    console.log(`\nRound Information:`)
    console.log(`  Created in Round: ${updatedApp.createdRound}`)
    console.log(`  Updated in Round: ${updatedApp.updatedRound}`)
    console.log(`  Rounds are different: ${updatedApp.updatedRound !== updatedApp.createdRound}`)
    
    // Verify the transaction type
    if (updatedApp.transaction.applicationCall?.onComplete === OnApplicationComplete.UpdateApplicationOC) {
      console.log('\n✅ Transaction type confirmed as UpdateApplication')
    }
    
    // Display the return value from the update method
    if (updatedApp.return?.returnValue) {
      console.log(`\n✅ Return value from update_abi method: ${updatedApp.return.returnValue}`)
    }
    
    console.log('\n✅ Application successfully updated with ABI method')
  } else {
    console.log(`⚠️  Expected update but got: ${updatedApp.operationPerformed}`)
  }

  return { createdApp, updatedApp }
}

// Run the example
updateAppWithAbiMethod()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })