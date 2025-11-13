import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import * as algosdk from 'algosdk'
import { OnApplicationComplete } from 'algosdk'

/**
 * This example demonstrates advanced app replacement using custom ABI methods.
 * 
 * Unlike simple replacement, this shows:
 * - Using custom ABI methods for app creation (create_abi)
 * - Using custom ABI methods for app deletion (delete_abi)
 * - Capturing return values from both operations
 * - Passing arguments to both create and delete methods
 * 
 * This is useful when your smart contract has specific initialization
 * or cleanup logic that needs to be executed during deployment/deletion.
 */

async function replaceApplicationWithAbiExample() {
  // Set up the testing environment with LocalNet
  const localnet = await algorandFixture()
  const { testAccount } = localnet.context

  // Create a factory instance for your application
  // Your app spec should define 'create_abi' and 'delete_abi' methods
  const factory = localnet.algorand.client.getTypedAppFactory({
    // Your app specification with ABI methods would go here
    // Must include:
    // - create_abi: A method that handles app creation with custom logic
    // - delete_abi: A method that handles app deletion with custom logic
  })

  console.log('Step 1: Deploy initial application')
  const { result: createdApp } = await factory.deploy({
    deployTimeParams: {
      VALUE: 1,
    },
    deletable: true, // Required for replacement
    populateAppCallResources: false, // Manual resource handling
  })

  console.log(`✓ Initial app deployed with ID: ${createdApp.appId}`)
  console.log(`  App address: ${createdApp.appAddress}`)

  console.log('\nStep 2: Replace app using custom ABI methods')
  const { result: app } = await factory.deploy({
    deployTimeParams: {
      VALUE: 2,
    },
    onUpdate: 'replace',
    
    // Custom ABI method for creation
    createParams: {
      method: 'create_abi',
      args: ['arg_io'], // Arguments passed to the create method
    },
    
    // Custom ABI method for deletion
    deleteParams: {
      method: 'delete_abi',
      args: ['arg2_io'], // Arguments passed to the delete method
    },
    
    populateAppCallResources: false,
  })

  console.log(`\n✓ Replacement with ABI methods completed!`)
  console.log(`  Operation performed: ${app.operationPerformed}`)
  console.log(`  Old app ID: ${createdApp.appId}`)
  console.log(`  New app ID: ${app.appId}`)
  console.log(`  New app address: ${app.appAddress}`)
  console.log(`  Address matches: ${algosdk.getApplicationAddress(app.appId) === app.appAddress ? '✓' : '✗'}`)

  // Return values from ABI methods
  console.log(`\n✓ ABI Method Return Values:`)
  console.log(`  create_abi returned: "${app.return}"`)
  console.log(`  delete_abi returned: "${app.deleteReturn}"`)

  // Verify the deletion occurred
  if (app.deleteResult && app.deleteResult.confirmation) {
    console.log(`\n✓ Old application deleted via ABI method`)
    console.log(`  Deleted app ID: ${app.deleteResult.transaction.applicationCall?.appIndex}`)
    console.log(`  OnComplete: ${app.deleteResult.transaction.applicationCall?.onComplete === OnApplicationComplete.DeleteApplicationOC ? 'DeleteApplication' : 'Unknown'}`)
  }

  console.log('\nℹ️  Benefits of ABI methods:')
  console.log('  • Execute custom initialization logic during creation')
  console.log('  • Perform cleanup operations before deletion')
  console.log('  • Capture return values for validation or logging')
  console.log('  • Pass dynamic arguments to control behavior')
}

// Run the example
replaceApplicationWithAbiExample()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })