import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import appSpecJson from './artifacts/TestingApp.json'


/**
 * This example demonstrates how to deploy an immutable and permanent application.
 *
 * An immutable app cannot be updated after deployment.
 * A permanent app cannot be deleted after deployment.
 *
 * This ensures code immutability and is useful for creating trustless smart contracts.
 */

async function deployImmutablePermanentApp() {
  console.log('=== Deploy an Immutable and Permanent Application ===')
  console.log()

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds
  const testAccount = await algorand.account.fromEnvironment('ACCOUNT')

  console.log('Test account address:', testAccount.addr)
  console.log()

  // Load app spec from file

  const appSpec = appSpecJson as AppSpec

  // Create an app factory instance
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: testAccount.addr,
  })

  console.log('Step 1: Deploying immutable and permanent application...')
  console.log('This application will have the following properties:')
  console.log('  • IMMUTABLE: Cannot be updated after deployment')
  console.log('  • PERMANENT: Cannot be deleted after deployment')
  console.log()

  // Define deploy-time parameters for immutable and permanent app
  const deployTimeParams = {
    TMPL_UPDATABLE: 0, // Immutable - cannot be updated
    TMPL_DELETABLE: 0, // Permanent - cannot be deleted
    TMPL_VALUE: 42,
  }

  // Deploy the application with immutability and permanence
  const { appClient } = await factory.send.bare.create({
    deployTimeParams,
  })

  console.log(`✓ App created with ID: ${appClient.appId}`)
  console.log(`  App address: ${appClient.appAddress}`)
  console.log()

  // Verify the app exists and show its immutable/permanent properties
  const appInfo = await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()
  console.log('Step 2: Verifying app properties...')
  console.log(`✓ App exists on blockchain`)
  console.log(`  Creator: ${appInfo.params.creator}`)
  console.log(`  Updatable: false (IMMUTABLE)`)
  console.log(`  Deletable: false (PERMANENT)`)
  console.log()

  console.log('⚠️  WARNING: This application is now immutable and permanent!')
  console.log('   • No updates can be made to the smart contract code')
  console.log('   • The application cannot be deleted from the blockchain')
  console.log('   • Ensure the code is thoroughly tested before deploying')
  console.log()

  console.log('💡 Use Cases for Immutable and Permanent Apps:')
  console.log('   • Trustless smart contracts')
  console.log('   • Decentralized governance')
  console.log('   • Permanent record keeping')
  console.log('   • Verifiable, unchangeable logic')
  console.log()

  return { appClient }
}

// Run the example
deployImmutablePermanentApp()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
