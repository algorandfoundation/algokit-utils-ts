import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * This example demonstrates the concept of app replacement deployment strategy.
 *
 * The replacement strategy conceptually involves:
 * 1. Deleting the old app (requires it to be deletable)
 * 2. Creating a new app with updated code and state
 * 3. Getting a new app ID (fresh start)
 *
 * This example manually demonstrates this workflow by:
 * - Creating an initial app (v1)
 * - Deleting it
 * - Creating a new app (v2) with different parameters
 *
 * This is useful when:
 * - You want a clean slate with a new app ID
 * - The changes are too significant for an update
 * - You want to reset all global/local state
 * - Testing deployment workflows
 *
 * Key concepts:
 * - Manual app replacement workflow
 * - Deploying multiple versions of an app
 * - Understanding when to use replacement vs. update
 */

async function deployAppWithReplacementStrategy() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a deployer account
  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

  console.log('Deployer address:', deployer.addr.toString())
  console.log()

  console.log('=== First Deployment (v1.0) ===')
  console.log()
  console.log('Deploying the initial version of the application...')
  console.log()

  // Deploy the first version of the application
  // We'll use TMPL_VALUE=100 to differentiate versions
  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: deployer.addr,
  })

  const { appClient: appClient1, result: result1 } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1, // Make it updatable
      TMPL_DELETABLE: 1, // Make it deletable (required for replacement)
      TMPL_VALUE: 100,   // Version 1.0 marker
    },
  })

  console.log('✅ Initial deployment successful!')
  console.log('App ID:', appClient1.appId)
  console.log('App Address:', appClient1.appAddress.toString())
  console.log('Template Value (version marker):', 100)
  console.log('Transaction ID:', result1.txIds[0])
  console.log()

  console.log('App is:')
  console.log('  • Updatable: Yes (TMPL_UPDATABLE=1)')
  console.log('  • Deletable: Yes (TMPL_DELETABLE=1)')
  console.log()

  // Store the first app ID for comparison
  const firstAppId = appClient1.appId

  console.log('=== Replacement Strategy: Delete Old App ===')
  console.log()
  console.log('Deleting app ID:', firstAppId)
  console.log()

  // Step 1: Delete the old app
  const deleteResult = await appClient1.send.delete.bare({})

  console.log('✅ Old app deleted successfully!')
  console.log('Delete Transaction ID:', deleteResult.txIds[0])
  console.log()

  console.log('=== Replacement Strategy: Create New App (v2.0) ===')
  console.log()
  console.log('Creating a new app with different template parameters...')
  console.log('This new app will have:')
  console.log('  • Different app ID')
  console.log('  • Different template value (TMPL_VALUE=200)')
  console.log('  • Fresh state (reset)')
  console.log()

  // Step 2: Create a new app with different parameters
  const { appClient: appClient2, result: result2 } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 200,   // Version 2.0 marker (different from v1)
    },
  })

  console.log('✅ Replacement app created successfully!')
  console.log('New App ID:', appClient2.appId)
  console.log('New App Address:', appClient2.appAddress.toString())
  console.log('Template Value (version marker):', 200)
  console.log('Transaction ID:', result2.txIds[0])
  console.log()

  console.log('=== Comparison ===')
  console.log()
  console.log('Old App ID:', firstAppId)
  console.log('New App ID:', appClient2.appId)
  console.log('App IDs are different:', firstAppId !== appClient2.appId, '✅')
  console.log()

  console.log('What happened:')
  console.log('  1. Old app (ID:', firstAppId, ') was deleted')
  console.log('  2. New app (ID:', appClient2.appId, ') was created')
  console.log('  3. All state was reset (fresh start)')
  console.log('  4. Template value changed from 100 to 200')
  console.log()

  // Verify the old app no longer exists
  console.log('=== Verifying Old App Deletion ===')
  console.log()

  try {
    await algorand.client.algod.getApplicationByID(Number(firstAppId)).do()
    console.log('⚠️  Old app still exists (unexpected)')
  } catch (error: any) {
    if (error.status === 404 || error.message.includes('application does not exist')) {
      console.log('✅ Old app successfully deleted!')
      console.log(`   App ID ${firstAppId} no longer exists on chain`)
    } else {
      console.log('Error checking old app:', error.message)
    }
  }

  console.log()
  console.log('=== Understanding Replacement Strategy ===')
  console.log()

  console.log('When to use REPLACE:')
  console.log('  ✅ You want a fresh app ID')
  console.log('  ✅ You want to reset all state')
  console.log('  ✅ Testing deployment workflows')
  console.log('  ✅ Major breaking changes')
  console.log()

  console.log('When NOT to use REPLACE:')
  console.log('  ❌ Production apps with existing users')
  console.log('  ❌ Apps with valuable state data')
  console.log('  ❌ When you can use UPDATE instead')
  console.log('  ❌ Apps that are referenced by other contracts')
  console.log()

  console.log('Requirements for REPLACE:')
  console.log('  • Old app must be DELETABLE (TMPL_DELETABLE=1)')
  console.log('  • Deployer must be the app creator')
  console.log('  • All users must have closed out their local state')
  console.log()

  console.log('=== Example Completed Successfully ===')
  console.log()

  console.log('You now understand the replacement deployment strategy concept!')
  console.log()
  console.log('Key Takeaways:')
  console.log('  • Replacement involves DELETE + CREATE operations')
  console.log('  • New app gets a different app ID')
  console.log('  • All state is reset (fresh start)')
  console.log('  • Old app must be deletable')
  console.log('  • Useful for testing and major changes, not for production')
}

// Run the example
deployAppWithReplacementStrategy().catch(console.error)
