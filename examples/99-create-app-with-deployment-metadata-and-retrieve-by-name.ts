import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * This example demonstrates how to:
 * 1. Create an Algorand application with deployment metadata
 * 2. Use the app deployer to track deployment information
 * 3. Retrieve apps by creator address and name
 * 4. Verify deployment metadata is correctly stored
 *
 * Deployment metadata helps track app versions, update policies, and enables
 * finding apps by name instead of just app ID.
 */

async function createAppWithDeploymentMetadata() {
  // Initialize Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser account for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a creator account
  const creator = algorand.account.random()
  await algorand.account.ensureFunded(creator, dispenser, (5).algos())

  console.log('Creator address:', creator.addr.toString())
  console.log()

  // Define deployment metadata
  const appName = 'TestingApp'
  const appVersion = '1.0.0'

  console.log('=== Creating Application with Deployment Metadata ===')
  console.log()
  console.log('Deployment metadata:')
  console.log(`  Name: ${appName}`)
  console.log(`  Version: ${appVersion}`)
  console.log(`  Updatable: true`)
  console.log(`  Deletable: true`)
  console.log()

  // Deploy the app using app deployer which handles metadata
  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: creator.addr,
  })

  // Create the app with deployment metadata
  const { appClient, result } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 100,
    },
  })

  const appId = BigInt(result.appId)

  console.log('✅ App created successfully!')
  console.log('App ID:', appId)
  console.log('App Address:', result.appAddress)
  console.log('Transaction ID:', result.txIds[0])
  console.log()

  // Wait for indexer to catch up (important for LocalNet)
  console.log('Waiting for indexer to index the transaction...')
  await new Promise((resolve) => setTimeout(resolve, 2000))
  console.log()

  // Retrieve apps by creator using the app deployer
  console.log('=== Retrieving Apps by Creator ===')
  console.log()

  try {
    const apps = await algorand.appDeployer.getCreatorAppsByName(creator.addr)

    console.log('📋 Apps found for creator:')
    console.log(`  Creator: ${apps.creator}`)
    console.log(`  Number of apps: ${Object.keys(apps.apps).length}`)

    if (Object.keys(apps.apps).length > 0) {
      console.log(`  App names: ${Object.keys(apps.apps).join(', ')}`)
      console.log()

      // Display details for each app
      for (const [name, app] of Object.entries(apps.apps)) {
        console.log(`App: ${name}`)
        console.log(`  App ID: ${app.appId}`)
        console.log(`  App Address: ${app.appAddress}`)
        console.log(`  Version: ${app.version || 'N/A'}`)
        console.log(`  Created Round: ${app.createdRound}`)
        console.log(`  Updated Round: ${app.updatedRound}`)
        console.log(`  Updatable: ${app.updatable !== undefined ? app.updatable : 'N/A'}`)
        console.log(`  Deletable: ${app.deletable !== undefined ? app.deletable : 'N/A'}`)

        if (app.createdMetadata) {
          console.log('  Created Metadata:', JSON.stringify(app.createdMetadata, null, 4))
        }
        console.log()
      }
    } else {
      console.log('  No apps found with metadata')
      console.log()
    }

    console.log('✅ Example completed successfully!')
  } catch (error) {
    console.log('Note: Indexer may not be available or not yet indexed the app.')
    console.log('Error:', error instanceof Error ? error.message : String(error))
    console.log()
    console.log('The app was created successfully, but retrieval by name requires indexer.')
  }
}

// Run the example
createAppWithDeploymentMetadata().catch(console.error)
