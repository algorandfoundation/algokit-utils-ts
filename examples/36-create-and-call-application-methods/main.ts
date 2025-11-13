import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

/**
 * This example demonstrates the fundamental workflow of:
 * 1. Creating an Algorand application using a factory
 * 2. Calling an ABI method on the created application
 * 3. Working with return values from ABI methods
 *
 * This is one of the most common patterns you'll use when working
 * with Algorand smart contracts.
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function createAndCallAppExample() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds
  const testAccount = await algorand.account.fromEnvironment('ACCOUNT')

  // Load the app spec from artifacts
  const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
  const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))

  // Create a factory instance for your application
  // The factory handles app deployment and creates clients
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: testAccount.addr,
  })

  console.log('Step 1: Create the application')
  console.log('  Deploying with bare create (no ABI method)...')

  const { result, appClient } = await factory.send.bare.create({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,  // App can be updated
      TMPL_DELETABLE: 1,  // App can be deleted
      TMPL_VALUE: 1,      // Initial value parameter
    },
  })

  console.log(`✓ Application created successfully!`)
  console.log(`  App ID: ${appClient.appId.toString()}`)
  console.log(`  App Address: ${appClient.appAddress.toString()}`)
  console.log(`  Transaction ID: ${result.txIds[0]}`)

  console.log('\nStep 2: Call an ABI method on the application')
  console.log('  Calling call_abi method with argument "test"...')

  // Call the ABI method on the created app
  const callResult = await appClient.send.call({
    method: 'call_abi',
    args: ['test'], // Method arguments
  })

  // Check and display the return value
  if (callResult.return) {
    console.log(`\n✓ Method call successful!`)
    console.log(`  Method: call_abi`)
    console.log(`  Input argument: "test"`)
    console.log(`  Return value: "${callResult.return}"`)
    console.log(`  Transaction ID: ${callResult.txIds[0]}`)
  } else {
    console.log('\n⚠️  Method returned no value')
  }

  console.log('\nℹ️  Key Concepts:')
  console.log('  • factory.send.bare.create(): Creates app without calling an ABI method')
  console.log('  • appClient: Client for interacting with your specific app')
  console.log('  • appClient.send.call(): Invokes ABI methods on the deployed app')
  console.log('  • return: Contains the decoded return value from the ABI method')

  console.log('\n📝 Common Use Cases:')
  console.log('  • Initialize app state after creation')
  console.log('  • Query app state with read-only methods')
  console.log('  • Execute app logic that modifies state')
  console.log('  • Chain multiple method calls in a workflow')
}

// Run the example
createAndCallAppExample()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })