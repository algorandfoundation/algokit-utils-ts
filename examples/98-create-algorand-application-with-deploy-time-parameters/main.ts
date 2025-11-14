import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { getApplicationAddress } from 'algosdk'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * Demonstrates creating an Algorand application with deploy-time parameters.
 *
 * Deploy-time parameters are template variables in your smart contract that get
 * substituted during compilation. Common use cases include:
 * - TMPL_UPDATABLE: Whether the app can be updated after deployment
 * - TMPL_DELETABLE: Whether the app can be deleted
 * - Custom values: Any other configuration values your contract needs
 *
 * This example shows how to pass deploy-time parameters when creating an app.
 */
async function createApplicationWithDeployTimeParameters() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser account for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a test account to be the app creator
  const creator = algorand.account.random()
  await algorand.account.ensureFunded(creator, dispenser, (5).algos())

  console.log('Creator address:', creator.addr)
  console.log()

  console.log('=== Creating Application with Deploy-Time Parameters ===')
  console.log()

  // Get the typed app factory
  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: creator.addr,
  })

  // Create the app with deploy-time parameters
  // These parameters are substituted into the smart contract during compilation
  const { appClient, result } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1, // 1 = updatable, 0 = not updatable
      TMPL_DELETABLE: 1, // 1 = deletable, 0 = not deletable
      TMPL_VALUE: 42, // Custom parameter value
    },
  })

  const appId = BigInt(result.appId)
  const appAddress = getApplicationAddress(appId)

  console.log('✅ App created successfully!')
  console.log('App ID:', appId)
  console.log('App Address:', appAddress)
  console.log()

  console.log('Deploy-time parameters used:')
  console.log('  TMPL_UPDATABLE: 1 (app is updatable)')
  console.log('  TMPL_DELETABLE: 1 (app is deletable)')
  console.log('  TMPL_VALUE: 42 (custom value)')
  console.log()

  // You can now use the app client for further operations
  console.log('The app client is ready for method calls.')
  console.log('Example: await appClient.send.methodName({ args: [...] })')
  console.log()

  console.log('✅ Example completed successfully!')
}

// Run the example
createApplicationWithDeployTimeParameters().catch(console.error)