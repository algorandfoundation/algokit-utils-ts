import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

/**
 * This example demonstrates how to create an application with a custom
 * onComplete action. Using OptIn on creation is useful for apps that
 * require local state and want the creator to automatically opt-in.
 *
 * This example provides a comparison between NoOp (default) and OptIn
 * OnComplete actions to understand their differences.
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function createAppWithOptInOnComplete() {
  // Initialize the Algorand client for localnet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds
  const account = await algorand.account.fromEnvironment('ACCOUNT')

  // Load the app spec
  const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
  const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))

  // Create an app factory instance
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: account.addr,
  })

  console.log('Creating application with OptIn onComplete action...')
  console.log('Creator account:', account.addr.toString())

  // Create the application with OptIn as the onComplete action
  // This means the creator will automatically opt-in to the app during creation
  const { result, appClient } = await factory.send.bare.create({
    // Set the onComplete action to OptIn
    // This is particularly useful for apps with local state where the
    // creator needs to be opted-in immediately
    onComplete: algosdk.OnApplicationComplete.OptInOC,

    // Allow the app to be updated by its creator
    updatable: true,

    // Allow the app to be deleted by its creator
    deletable: true,

    // Deploy-time parameters for the contract
    deployTimeParams: {
      VALUE: 1,
    },
  })

  // Log the application details
  console.log('\nApplication created successfully with OptIn!')
  console.log('App ID:', appClient.appId.toString())
  console.log('App Address:', appClient.appAddress.toString())
  console.log('Transaction ID:', result.txIds[0])

  // Verify the onComplete action in the transaction
  const onCompleteValue = result.transactions[0].applicationCall?.onComplete
  if (onCompleteValue !== undefined) {
    console.log('\nTransaction details:')
    console.log('OnComplete action:', onCompleteValue)
    console.log('Is OptIn:', onCompleteValue === algosdk.OnApplicationComplete.OptInOC)

    // OnApplicationComplete enum values:
    // NoOpOC = 0,
    // OptInOC = 1,
    // CloseOutOC = 2,
    // ClearStateOC = 3,
    // UpdateApplicationOC = 4,
    // DeleteApplicationOC = 5
    console.log('OptIn value:', algosdk.OnApplicationComplete.OptInOC)
  }

  // Verify the app address is correctly derived from the app ID
  const derivedAddress = algosdk.getApplicationAddress(appClient.appId).toString()
  const appAddress = appClient.appAddress.toString()
  console.log('\nVerifying app address...')
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

  console.log('\nThe creator account is now opted-in to the application!')
  console.log('The app is updatable and deletable by the creator.')

  return { result, appClient }
}

// Example: Understanding different OnComplete actions
async function demonstrateOnCompleteActions() {
  const algorand = AlgorandClient.defaultLocalNet()
  const account = await algorand.account.fromEnvironment('ACCOUNT')

  // Load the app spec
  const appSpecPath = path.join(__dirname, 'artifacts', 'application.json')
  const appSpec = JSON.parse(readFileSync(appSpecPath, 'utf-8'))

  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: account.addr,
  })

  console.log('\n--- Demonstrating different OnComplete actions ---\n')

  // 1. Create with NoOp (default)
  console.log('1. Creating app with NoOp (default)...')
  const app1 = await factory.send.bare.create({
    deployTimeParams: { VALUE: 1 },
    updatable: true,
    deletable: true,
  })
  console.log('   App ID:', app1.appClient.appId.toString())
  console.log('   OnComplete:', app1.result.transactions[0].applicationCall?.onComplete ?? 0, '(NoOp)')

  // 2. Create with OptIn
  console.log('\n2. Creating app with OptIn...')
  const app2 = await factory.send.bare.create({
    onComplete: algosdk.OnApplicationComplete.OptInOC,
    deployTimeParams: { VALUE: 1 },
    updatable: true,
    deletable: true,
  })
  console.log('   App ID:', app2.appClient.appId.toString())
  console.log('   OnComplete:', app2.result.transactions[0].applicationCall?.onComplete, '(OptIn)')
  console.log('   Creator is now opted-in!')

  console.log('\nKey difference:')
  console.log('- NoOp (0): App is created, but creator is NOT opted-in')
  console.log('- OptIn (1): App is created AND creator IS opted-in (can store local state)')
}

// Run the examples
async function main() {
  await createAppWithOptInOnComplete()
  await demonstrateOnCompleteActions()
}

main()
  .then(() => {
    console.log('\nAll examples completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
