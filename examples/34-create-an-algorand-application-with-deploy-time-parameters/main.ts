import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

/**
 * This example demonstrates how to create an Algorand application
 * with deploy-time parameters using the factory pattern.
 *
 * It covers:
 * - Loading an app spec with TEAL template variables
 * - Creating an app factory with deploy-time parameters
 * - Deploying the application with custom parameter values
 * - Verifying the app address and confirmation details
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function createAppWithDeployTimeParams() {
  // Initialize the Algorand client for localnet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds
  const account = await algorand.account.fromEnvironment('ACCOUNT')
  console.log('Creating application from account:', account.addr.toString())

  // Load the app spec from artifacts
  const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
  const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))

  // Create an app factory instance
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: account.addr,
  })

  console.log('\nCreating application with deploy-time parameters...')

  // Create the application with deploy-time parameters
  // Deploy-time parameters allow you to set immutable configuration values
  // when the contract is deployed
  const { result, appClient } = await factory.send.bare.create({
    deployTimeParams: {
      TMPL_UPDATABLE: 1, // Makes the app updatable
      TMPL_DELETABLE: 1, // Makes the app deletable
      TMPL_VALUE: 42,    // Custom parameter specific to your contract
    },
  })

  // Log the application details
  console.log('\n✅ Application created successfully!')
  console.log('App ID:', appClient.appId.toString())
  console.log('App Address:', appClient.appAddress.toString())
  console.log('Transaction ID:', result.txIds[0])

  // Verify the app address is correctly derived from the app ID
  const derivedAddress = algosdk.getApplicationAddress(appClient.appId).toString()
  const appAddress = appClient.appAddress.toString()
  console.log('\n✓ Verifying app address...')
  console.log('App Address:', appAddress)
  console.log('Derived Address:', derivedAddress)
  console.log('Addresses match:', appAddress === derivedAddress)

  // The confirmation contains the application index
  const confirmation = result.confirmations?.[0]
  if (confirmation) {
    console.log('\nConfirmation details:')
    console.log('Application Index:', appClient.appId.toString())
    console.log('Confirmed Round:', confirmation.confirmedRound)
  }

  return { result, appClient }
}

// Run the example
createAppWithDeployTimeParams()
  .then(() => {
    console.log('\nExample completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
