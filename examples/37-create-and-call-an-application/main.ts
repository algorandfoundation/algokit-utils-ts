import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

/**
 * This example demonstrates the basic workflow of creating an Algorand
 * application and then calling an ABI method on it.
 *
 * This is the foundational pattern for interacting with smart contracts
 * on Algorand using AlgoKit Utils.
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function createAndCallApp() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds
  const account = await algorand.account.fromEnvironment('ACCOUNT')

  console.log('Account address:', account.addr.toString())
  console.log('\n--- Step 1: Create the application ---')

  // Load the app spec from artifacts
  const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
  const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))

  // Create a factory instance for your application
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: account.addr,
  })

  // Create the application with deploy-time parameters
  // These parameters configure the app's behavior at creation time
  const { result, appClient } = await factory.send.bare.create({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,  // App can be updated
      TMPL_DELETABLE: 1,  // App can be deleted
      TMPL_VALUE: 1,      // Custom parameter for your app logic
    },
  })

  console.log('Application created successfully!')
  console.log('  App ID:', appClient.appId.toString())
  console.log('  App Address:', appClient.appAddress.toString())
  console.log('  Transaction ID:', result.txIds[0])

  console.log('\n--- Step 2: Call an ABI method on the app ---')

  // Call an ABI method on the created application
  // The method 'call_abi' takes a string argument and returns a greeting
  const callResult = await appClient.send.call({
    method: 'call_abi',
    args: ['test'], // Pass 'test' as the argument
  })

  console.log('Method call successful!')
  console.log('  Transaction ID:', callResult.txIds[0])

  // Decode and display the return value
  if (callResult.return) {
    console.log('\nReturn value from ABI method:')
    console.log('  Decoded value:', callResult.return)
    console.log('  ✓ Successfully decoded')
  } else {
    console.log('\n⚠️  Method returned no value')
  }

  console.log('\n--- Summary ---')
  console.log('This example showed the basic pattern:')
  console.log('  1. Create an app factory with app spec')
  console.log('  2. Call factory.send.bare.create() with deploy-time parameters')
  console.log('  3. Call appClient.send.call() with method name and arguments')
  console.log('  4. Access return values from the method call')
}

// Run the example
createAndCallApp()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  })
