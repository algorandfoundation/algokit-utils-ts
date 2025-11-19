import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * Example: Update an Existing Application Using an ABI Update Method
 *
 * This example demonstrates:
 * 1. Deploying an updatable application
 * 2. Updating the application while calling a custom ABI method
 * 3. Passing arguments to the update method
 * 4. Receiving return values from the update method
 */

async function updateApplicationAbiExample() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a funded account
  const deployer = await algorand.account.localNetDispenser()

  console.log('Deploying initial application version...')

  // Get app factory instance
  const factory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: deployer.addr,
  })

  // Deploy the initial version of the app (create_abi method will be called)
  const { result: createdApp } = await factory.deploy({
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
  console.log(`  App address: ${createdApp.appAddress}`)
  console.log(`  Create method returned: "${createdApp.return}"`)
  console.log()

  console.log('Updating application using update_abi method...')

  // Update the app using the custom update_abi method
  // The update_abi method receives the input string and can perform migration logic
  // We'll change the VALUE parameter to force an update
  const { result: updatedApp } = await factory.deploy({
    onUpdate: 'update', // Specify update behavior
    updateParams: {
      method: 'update_abi', // Name of the ABI method to call during update
      args: { input: 'Migrating to v2.0 - schema changes applied' },
    },
    deployTimeParams: {
      VALUE: 100, // Changed from 42 to force an actual update
    },
  })

  console.log(`✓ Update completed!`)
  console.log(`  Operation: ${updatedApp.operationPerformed}`)
  console.log(`  App ID (preserved): ${updatedApp.appId}`)
  console.log(`  Update method returned: "${updatedApp.return}"`)
  console.log()

  console.log('Updating again with different migration data...')

  // Perform another update to demonstrate multiple updates
  const { result: updatedApp2 } = await factory.deploy({
    onUpdate: 'update',
    updateParams: {
      method: 'update_abi',
      args: { input: 'Upgrading to v3.0 - new features added' },
    },
    deployTimeParams: {
      VALUE: 200, // Changed again to force another update
    },
  })

  console.log(`✓ Second update completed!`)
  console.log(`  Update method returned: "${updatedApp2.return}"`)
  console.log()

  console.log('✅ Application updated successfully using ABI methods!')
  console.log('   The update_abi method can:')
  console.log('   - Perform data migrations')
  console.log('   - Validate upgrade conditions')
  console.log('   - Return confirmation or status information')
  console.log('   - Access and modify global/local state')
}

// Run the example
updateApplicationAbiExample()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
