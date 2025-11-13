import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * This example demonstrates deploying an application with an ABI create method.
 * The create method is called during deployment and can return values.
 *
 * Key concepts:
 * - Using ABI methods for app creation
 * - Passing arguments to create methods
 * - Getting return values from create operations
 * - Deploy-time parameters with ABI create
 */

async function deployAppWithAbiCreate() {
  console.log('=== Deploy Application with ABI Create Method ===')
  console.log()

  // Setup: Create Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  const testAccount = await algorand.account.fromEnvironment('ACCOUNT')

  console.log('Test account address:', testAccount.addr)
  console.log()

  // Load app spec from file
  const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
  const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))

  // Create app factory
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: testAccount.addr,
  })

  console.log('Step 1: Deploying application with ABI create method...')

  // Define deploy-time parameters for the app
  const deployTimeParams = {
    TMPL_UPDATABLE: 1,
    TMPL_DELETABLE: 1,
    TMPL_VALUE: 42,
  }

  // Create the app using an ABI method
  // This allows you to pass arguments and get return values during creation
  const { appClient, result } = await factory.send.create({
    method: 'create_abi',
    args: ['initialization_complete'],
    deployTimeParams,
  })

  console.log(`✓ App created with ID: ${appClient.appId}`)
  console.log(`  App address: ${appClient.appAddress}`)
  console.log(`  Transaction ID: ${result.txIds[0]}`)
  console.log()

  // The ABI method can return a value during creation
  console.log('Step 2: Checking return value from create method...')
  console.log(`✓ Create method returned: "${result.return}"`)
  console.log()

  // Verify the app exists
  const appInfo = await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()
  console.log('Step 3: Verifying app was deployed...')
  console.log(`✓ App exists on blockchain`)
  console.log(`  Creator: ${appInfo.params.creator}`)
  console.log()

  return { appClient, result }
}

// Run the example
deployAppWithAbiCreate()
  .then(() => {
    console.log('✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
