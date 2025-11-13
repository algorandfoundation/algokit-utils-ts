import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * This example demonstrates deploying an immutable and permanent application.
 *
 * Key concepts:
 * - Deploying immutable apps (cannot be updated)
 * - Deploying permanent apps (cannot be deleted)
 * - Using deploy-time parameters to control mutability
 * - Understanding the implications of immutability
 */

async function deployImmutablePermanentApp() {
  console.log('=== Deploy Immutable and Permanent Application ===')
  console.log()
  console.log('⚠️  WARNING: This app cannot be updated or deleted after deployment!')
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

  console.log('Step 1: Deploying immutable and permanent application...')
  console.log()

  // Define deploy-time parameters for the app
  // TMPL_UPDATABLE: 0 means the app CANNOT be updated (immutable)
  // TMPL_DELETABLE: 0 means the app CANNOT be deleted (permanent)
  const deployTimeParams = {
    TMPL_UPDATABLE: 0,  // Immutable
    TMPL_DELETABLE: 0,  // Permanent
    TMPL_VALUE: 42,
  }

  // Create the app with bare call
  const { appClient } = await factory.send.bare.create({
    deployTimeParams,
  })

  console.log(`✓ App deployed with ID: ${appClient.appId}`)
  console.log(`  App address: ${appClient.appAddress}`)
  console.log()

  // Verify the app exists
  const appInfo = await algorand.client.algod.getApplicationByID(Number(appClient.appId)).do()
  console.log('Step 2: Verifying app configuration...')
  console.log(`✓ App exists on blockchain`)
  console.log(`  Creator: ${appInfo.params.creator}`)
  console.log()

  console.log('Step 3: Configuration details...')
  console.log(`  Updatable: false (IMMUTABLE)`)
  console.log(`  Deletable: false (PERMANENT)`)
  console.log()

  console.log('💡 Implications:')
  console.log('   • This app is now locked and cannot be modified')
  console.log('   • The app cannot be deleted from the blockchain')
  console.log('   • Ideal for production contracts requiring immutability')
  console.log('   • Ensures contract logic cannot change after deployment')
  console.log('   • Users can trust the contract will always behave the same way')
  console.log()

  console.log('⚠️  Note: Test this carefully before deploying to production!')
  console.log('   Once deployed, there is no way to change or remove the app.')
  console.log()

  return { appClient }
}

// Run the example
deployImmutablePermanentApp()
  .then(() => {
    console.log('✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
