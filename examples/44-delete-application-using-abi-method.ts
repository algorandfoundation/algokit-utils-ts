import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import appSpecJson from './artifacts/TestingApp.json'


/**
 * This example demonstrates how to delete a smart contract application
 * using an ABI method with custom cleanup logic.
 *
 * Key concepts:
 * - Creating a deletable app with deploy-time parameters
 * - Using ABI methods for app deletion
 * - Getting return values from delete operations
 */

async function deleteAppWithAbi() {
  console.log('=== Delete Application Using ABI Method ===')
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

  console.log('Step 1: Creating a deletable application...')

  // Define deploy-time parameters for the app
  // TMPL_UPDATABLE: 0 means the app cannot be updated
  // TMPL_DELETABLE: 1 means the app can be deleted
  // TMPL_VALUE: 1 is an example parameter
  const deployTimeParams = {
    TMPL_UPDATABLE: 0,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 1,
  }

  // Create the app with a bare call (no ABI method)
  const { appClient } = await factory.send.bare.create({
    deployTimeParams,
  })

  console.log(`✓ App created with ID: ${appClient.appId}`)
  console.log(`  App address: ${appClient.appAddress}`)
  console.log('  App is deletable and can be removed from the blockchain')
  console.log()

  // Verify the app exists
  const appInfo = await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()
  console.log('Step 2: Verifying app exists...')
  console.log(`✓ App exists on blockchain`)
  console.log(`  Creator: ${appInfo.params.creator}`)
  console.log()

  // Delete the app using an ABI method
  // This allows you to include custom cleanup logic before deletion
  console.log('Step 3: Deleting the app with ABI method...')

  const deleteResult = await appClient.send.delete({
    method: 'delete_abi',
    args: ['cleanup_complete'],
  })

  // The ABI method can return a value during deletion
  // This is useful for confirming successful cleanup operations
  console.log(`✓ Delete method returned: "${deleteResult.return}"`)
  console.log(`  Transaction ID: ${deleteResult.txIds[0]}`)
  console.log()

  console.log('Step 4: Verifying app was deleted...')

  // Try to fetch the app - it should no longer exist
  try {
    await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()
    console.log('❌ Error: App still exists!')
  } catch (error) {
    console.log('✓ App successfully deleted from the blockchain')
    console.log('  The app no longer exists and cannot be queried')
  }
  console.log()

  return deleteResult
}

// Run the example
deleteAppWithAbi()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
