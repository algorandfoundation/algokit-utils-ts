import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * This example demonstrates how to deploy a new Algorand application.
 *
 * Key concepts:
 * - Creating and funding a deployer account
 * - Using a typed app factory to deploy applications
 * - Setting deploy-time template parameters
 * - Understanding app deployment results
 * - Retrieving app information after deployment
 *
 * The example shows the basic workflow for deploying a smart contract
 * to the Algorand blockchain using AlgoKit Utils v9.1.2.
 */

async function deployNewApp() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a deployer account
  const deployer = algorand.account.random()
  await algorand.account.ensureFunded(deployer, dispenser, (10).algos())

  console.log('Deployer account:', deployer.addr.toString())
  console.log()

  console.log('=== Deploying New Application ===')
  console.log()

  // Get the typed app factory
  // This factory knows about the TestingApp contract and its methods
  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: deployer.addr,
  })

  console.log('Deploying TestingApp with deploy-time parameters...')
  console.log()

  // Deploy the application
  // Use deploy-time template parameters to configure the app
  const { appClient, result } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,  // Make the app updatable
      TMPL_DELETABLE: 1,  // Make the app deletable
      TMPL_VALUE: 42,     // Set a template value
    },
  })

  console.log('✅ Application deployed successfully!')
  console.log()

  console.log('=== Deployment Details ===')
  console.log()
  console.log('App ID:', appClient.appId)
  console.log('App Address:', appClient.appAddress.toString())
  console.log('Transaction ID:', result.txIds[0])
  console.log()

  console.log('Deploy-Time Parameters:')
  console.log('  TMPL_UPDATABLE: 1 (app can be updated)')
  console.log('  TMPL_DELETABLE: 1 (app can be deleted)')
  console.log('  TMPL_VALUE: 42')
  console.log()

  // Retrieve app information from the blockchain
  console.log('=== Retrieving App Information ===')
  console.log()

  const appInfo = await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()

  console.log('On-Chain App Information:')
  console.log('  Creator:', appInfo.params.creator.toString())
  console.log('  Approval Program Size:', appInfo.params.approvalProgram.length, 'bytes')
  console.log('  Clear Program Size:', appInfo.params.clearStateProgram.length, 'bytes')
  console.log('  Global State Schema:')
  console.log('    Uints:', appInfo.params.globalStateSchema?.numUint || 0)
  console.log('    Bytes:', appInfo.params.globalStateSchema?.numByteSlice || 0)
  console.log('  Local State Schema:')
  console.log('    Uints:', appInfo.params.localStateSchema?.numUint || 0)
  console.log('    Bytes:', appInfo.params.localStateSchema?.numByteSlice || 0)
  console.log()

  console.log('=== Understanding the Deployment ===')
  console.log()
  console.log('What just happened:')
  console.log('  1. Created a deployer account and funded it')
  console.log('  2. Got a typed app factory for TestingApp')
  console.log('  3. Called create.bare() with deploy-time parameters')
  console.log('  4. AlgoKit Utils compiled the TEAL code')
  console.log('  5. Sent an application creation transaction')
  console.log('  6. Received an app ID and app address')
  console.log()

  console.log('The app is now deployed and ready to use!')
  console.log('You can call its methods using the appClient.')
  console.log()

  console.log('=== Testing the Deployed App ===')
  console.log()
  console.log('Calling the "callAbi" method with value="Hello from deployed app"...')

  // Test calling a method on the deployed app
  const callResult = await appClient.send.callAbi({
    args: {
      value: 'Hello from deployed app',
    },
  })

  console.log('✅ Method call successful!')
  console.log('Transaction ID:', callResult.txIds[0])
  console.log('Returned value:', callResult.return)
  console.log()

  console.log('=== Example Completed Successfully ===')
  console.log()

  console.log('Key Takeaways:')
  console.log('  • Use AlgorandClient.defaultLocalNet() to connect to LocalNet')
  console.log('  • Create and fund accounts using account.random() and ensureFunded()')
  console.log('  • Use getTypedAppFactory() to get a typed app factory')
  console.log('  • Deploy with send.create.bare() and deploy-time parameters')
  console.log('  • The result includes appClient for interacting with the app')
  console.log('  • Call methods on the deployed app using appClient.send')

  return appClient
}

// Run the example
deployNewApp().catch(console.error)
