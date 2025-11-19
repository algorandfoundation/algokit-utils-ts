import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * Example: Update an Existing Application Using an ABI Update Method
 *
 * This example demonstrates:
 * 1. Deploying an updatable application with deploy-time parameters
 * 2. Updating the application while calling a custom ABI method
 * 3. Passing arguments to the update method
 * 4. Receiving return values from the update method
 * 5. Accessing the compiled approval program after update
 */

async function updateAppWithAbi() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a funded account
  const deployer = await algorand.account.localNetDispenser()

  console.log('Creating an updatable application...')

  // Get app factory instance
  const factory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: deployer.addr,
  })

  // Deploy the initial version of the app (create_abi method will be called)
  const { result: createdApp, appClient } = await factory.deploy({
    createParams: {
      method: 'create_abi',
      args: { input: 'Initial deployment v1.0' },
    },
    deployTimeParams: {
      VALUE: 42, // TMPL_VALUE parameter in the TEAL template
    },
    onUpdate: 'update', // Allow updates if app already exists
    updatable: true, // Must be updatable to allow future updates
    deletable: true,
  })

  console.log(`✓ App created with ID: ${createdApp.appId}`)
  console.log('  App is updatable and can be upgraded with new logic')
  console.log()

  // Update the app using an ABI method
  // This allows you to include custom migration logic in the update
  console.log('Updating the app with ABI method...')

  const { result: updateResult } = await factory.deploy({
    onUpdate: 'update',
    updateParams: {
      method: 'update_abi',
      args: { input: 'Migrating to v2.0' },
    },
    deployTimeParams: {
      VALUE: 100, // Changed from 42 to force an actual update
    },
  })

  // The ABI method can return a value during the update
  console.log(`✓ Update method returned: "${updateResult.return}"`)

  // You can access the newly compiled approval program
  console.log(
    `  New approval program compiled: ${updateResult.compiledApproval ? 'Yes' : 'No'}`
  )
  console.log('  App successfully updated with new logic!')
  console.log()

  console.log('✅ Example completed successfully')
  console.log('   - App was created with deploy-time parameters')
  console.log('   - App was updated using an ABI method')
  console.log('   - Update method returned migration confirmation')
}

// Run the example
updateAppWithAbi()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
