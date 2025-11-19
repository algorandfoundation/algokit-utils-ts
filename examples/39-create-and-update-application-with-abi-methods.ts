import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import appSpecJson from './artifacts/TestingApp.json'

/**
 * This example demonstrates how to:
 * 1. Create an application using an ABI method and retrieve its return value
 * 2. Update an existing application using an ABI method
 *
 * ABI (Application Binary Interface) methods provide type-safe interactions
 * with smart contracts and enable return value handling.
 */


async function createAndUpdateAppWithABI() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds
  const testAccount = await algorand.account.fromEnvironment('ACCOUNT')

  console.log('Test account address:', testAccount.addr.toString())

  // Load the app spec from artifacts

  const appSpec = appSpecJson as AppSpec

  // ========================================
  // Part 1: Create Application with ABI Method
  // ========================================

  console.log('\n=== Creating Application with ABI Method ===')

  // Create a factory instance for the application
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: testAccount.addr,
  })

  // Create the application using an ABI method
  // The 'create_abi' method is called during app creation
  const { result: createResult, appClient } = await factory.send.create({
    method: 'create_abi',
    args: ['string_io'], // Arguments passed to the create_abi method
    deployTimeParams: {
      TMPL_UPDATABLE: 1, // Make the app updatable so we can update it later
      TMPL_DELETABLE: 1, // Make the app deletable
      TMPL_VALUE: 1,     // Custom deploy-time parameter
    },
  })

  // Handle the return value from the ABI method
  console.log('App created successfully!')
  console.log('  App ID:', appClient.appId.toString())
  console.log('  App Address:', appClient.appAddress.toString())
  console.log('  Transaction ID:', createResult.txIds[0])

  if (createResult.return) {
    console.log('  Return value from create_abi:', createResult.return)
  }

  // ========================================
  // Part 2: Update Application with ABI Method
  // ========================================

  console.log('\n=== Updating Application with ABI Method ===')

  // Update the application using an ABI method
  const updateResult = await appClient.send.update({
    method: 'update_abi',
    args: ['updated_string'], // Arguments passed to the update_abi method
    deployTimeParams: {
      TMPL_UPDATABLE: 1, // Keep the app updatable
      TMPL_DELETABLE: 1, // Keep the app deletable
      TMPL_VALUE: 2,     // Changed deploy-time parameter
    },
  })

  // Handle the return value from the update
  console.log('App updated successfully!')
  console.log('  Transaction ID:', updateResult.txIds[0])

  if (updateResult.return) {
    console.log('  Return value from update_abi:', updateResult.return)
  }

  console.log('\n=== Example Complete ===')
  console.log('Summary:')
  console.log('  - Created an app with ABI method "create_abi" and retrieved return value')
  console.log('  - Updated the app with ABI method "update_abi" and verified the result')
  console.log('  - Used deploy-time parameters to configure app behavior')
  console.log('  - ABI methods provide type-safe interactions and return value handling')
}

// Run the example
createAndUpdateAppWithABI()
  .then(() => {
    console.log('\n✅ Example completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  })
