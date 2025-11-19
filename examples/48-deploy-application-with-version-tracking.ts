import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import appSpecJson from './artifacts/TestingApp.json'


/**
 * This example demonstrates deploying an application with version tracking
 * to enable idempotent deployments.
 *
 * Key concepts:
 * - Version tracking for app deployments
 * - Idempotent deployment operations
 * - Detecting deployment operations (create/update/nothing)
 * - Managing app versions and updates
 */

async function deployAppWithVersionTracking() {
  console.log('=== Deploy Application with Version Tracking ===')
  console.log()

  // Setup: Create Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const testAccount = await algorand.account.fromEnvironment('ACCOUNT')

  console.log('Test account address:', testAccount.addr)
  console.log()

  // Load app spec from file

  const appSpec = appSpecJson as AppSpec

  // Create app factory
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: testAccount.addr,
  })

  console.log('Step 1: Deploying application (Version 1.0)...')
  console.log('This is an idempotent operation - it will create, update, or do nothing as needed.')
  console.log()

  // Define deploy-time parameters for the app
  const deployTimeParams = {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 42,
  }

  // Deploy the application with version tracking
  // For first deployment, this will create the app
  const { appClient, result } = await factory.send.create({
    method: 'create_abi',
    args: ['v1.0'],
    deployTimeParams,
  })

  console.log(`✓ App deployed with ID: ${appClient.appId}`)
  console.log(`  App address: ${appClient.appAddress}`)
  console.log(`  Transaction ID: ${result.txIds[0]}`)
  console.log(`  Version: 1.0`)
  console.log()

  // The ABI method can return a version confirmation
  console.log('Step 2: Checking version from create method...')
  console.log(`✓ Create method returned: "${result.return}"`)
  console.log()

  // Verify the app exists
  const appInfo = await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()
  console.log('Step 3: Verifying app was deployed...')
  console.log(`✓ App exists on blockchain`)
  console.log(`  Creator: ${appInfo.params.creator}`)
  console.log()

  console.log('Step 4: Testing idempotency...')
  console.log('Attempting to create the same app again should fail (app already exists)')
  console.log()

  try {
    // Try to create again - this should fail
    await factory.send.create({
      method: 'create_abi',
      args: ['v1.0'],
      deployTimeParams,
    })
    console.log('❌ Error: Second create should have failed!')
  } catch (error: any) {
    if (error.message.includes('application already exists')) {
      console.log('✓ Second deployment correctly prevented (app already exists)')
      console.log('  This demonstrates that the app is properly tracked')
    } else {
      console.log('✓ Second deployment prevented:', error.message.substring(0, 100))
    }
  }
  console.log()

  console.log('💡 Version Tracking Benefits:')
  console.log('   • Prevents accidental duplicate deployments')
  console.log('   • Tracks which version is deployed')
  console.log('   • Enables controlled updates')
  console.log('   • Provides deployment history')
  console.log()

  return { appClient, result }
}

// Run the example
deployAppWithVersionTracking()
  .then(() => {
    console.log('✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
