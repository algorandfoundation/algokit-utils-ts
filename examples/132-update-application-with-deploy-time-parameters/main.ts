import * as algokit from '@algorandfoundation/algokit-utils'

// This example demonstrates updating an existing application with new deploy-time parameters
// It shows idempotent deployment - deploy() can create or update based on the situation

async function updateApplicationWithDeployParams() {
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
  console.log('Deploying application with VALUE=1...')
  
  // First deployment - create the application
  const createdApp = await client.deploy({
    version: '1.0',
    deployTimeParams: {
      VALUE: 1, // Initial deploy-time parameter
    },
    allowUpdate: true, // Allow future updates
  })

  console.log(`Operation performed: ${createdApp.operationPerformed}`)
  console.log(`App ID: ${createdApp.appId}`)
  console.log(`App Address: ${createdApp.appAddress}`)
  console.log(`Created in Round: ${createdApp.createdRound}`)

  console.log('\n=== UPDATING APPLICATION ===')
  console.log('Deploying again with VALUE=2...')
  
  // Second deployment - update the existing application
  const updatedApp = await client.deploy({
    version: '1.0',
    deployTimeParams: {
      VALUE: 2, // Updated deploy-time parameter
    },
    onUpdate: 'update', // Specify what to do on update
  })

  console.log(`Operation performed: ${updatedApp.operationPerformed}`)
  
  // Verify this was an update, not a new creation
  if (updatedApp.operationPerformed === 'update') {
    console.log('✅ Application was updated (not recreated)')
    console.log(`App ID remains: ${updatedApp.appId}`)
    console.log(`App Address remains: ${updatedApp.appAddress}`)
    console.log(`\nRound Information:`)
    console.log(`  Created in Round: ${updatedApp.createdRound}`)
    console.log(`  Updated in Round: ${updatedApp.updatedRound}`)
    
    // Verify the app ID didn't change
    if (updatedApp.appId === createdApp.appId) {
      console.log('✅ App ID unchanged (same app)')
    }
    
    // Verify the address didn't change
    if (updatedApp.appAddress === createdApp.appAddress) {
      console.log('✅ App address unchanged (same app)')
    }
    
    // Verify the created round is the same but updated round is different
    if (updatedApp.createdRound === createdApp.createdRound) {
      console.log('✅ Created round unchanged')
    }
    
    if (updatedApp.updatedRound !== updatedApp.createdRound) {
      console.log('✅ Updated round is different from created round')
    }
    
    console.log(`\n✅ Deploy-time parameter VALUE was updated from 1 to 2`)
  } else {
    console.log(`⚠️  Expected update but got: ${updatedApp.operationPerformed}`)
  }

  return { createdApp, updatedApp }
}

// Run the example
updateApplicationWithDeployParams()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })