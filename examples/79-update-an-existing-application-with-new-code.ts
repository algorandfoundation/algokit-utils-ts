import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * Example: Update an Existing Application with New Code
 *
 * This example demonstrates:
 * 1. Deploying an updatable application with deploy-time parameters
 * 2. Updating the application code by changing deploy-time parameters
 * 3. Tracking operation performed (create vs update)
 * 4. Confirming app ID preservation and update rounds
 * 5. Using idempotent deployment for safe updates
 */

async function updateApplicationCodeExample() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a funded account
  const deployer = await algorand.account.localNetDispenser()

  console.log('Step 1: Deploy initial application with VALUE=42')

  // Get app factory instance
  const factory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: deployer.addr,
  })

  // Deploy the initial version of the app with VALUE=42
  const { result: createdApp } = await factory.deploy({
    createParams: {
      method: 'create_abi',
      args: { input: 'Initial deployment v1.0' },
    },
    deployTimeParams: {
      VALUE: 42, // Initial deploy-time parameter
    },
    onUpdate: 'update', // Allow updates if app already exists
    updatable: true, // Must be updatable to allow future updates
    deletable: true,
  })

  console.log(`✓ App created with ID: ${createdApp.appId}`)
  console.log(`  App address: ${createdApp.appAddress}`)
  console.log(`  Operation performed: ${createdApp.operationPerformed}`)
  console.log(`  Created at round: ${createdApp.createdRound}`)
  console.log()

  console.log('Step 2: Update the application with VALUE=100')
  console.log('  (Changing deploy-time parameter updates the bytecode)')

  // Update the app by changing the deploy-time parameter
  // This changes the bytecode and triggers an update
  const { result: updatedApp } = await factory.deploy({
    deployTimeParams: {
      VALUE: 100, // Changed from 42 to force an update
    },
    onUpdate: 'update', // Specify update behavior
  })

  console.log()
  console.log('✓ Update completed!')
  console.log(`  Operation performed: ${updatedApp.operationPerformed}`)
  console.log(`  App ID (preserved): ${updatedApp.appId}`)
  console.log(`  App address (preserved): ${updatedApp.appAddress}`)
  console.log(`  Created at round: ${updatedApp.createdRound}`)
  console.log(`  Updated at round: ${updatedApp.updatedRound}`)
  console.log()

  // Verify the update was successful
  if (updatedApp.operationPerformed === 'update') {
    console.log('✅ Application successfully updated!')
    console.log(
      `   ✓ App ID preserved: ${updatedApp.appId === createdApp.appId}`
    )
    console.log(`   ✓ Created round: ${createdApp.createdRound}`)
    console.log(`   ✓ Updated round: ${updatedApp.updatedRound}`)
    console.log(
      `   ✓ Rounds are different: ${updatedApp.updatedRound !== createdApp.createdRound}`
    )
  }
}

// Run the example
updateApplicationCodeExample()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
