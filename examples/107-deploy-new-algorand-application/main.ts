import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { getApplicationAddress } from 'algosdk'
import * as fs from 'fs'
import * as path from 'path'

/**
 * This example demonstrates how to deploy a new Algorand application using the appDeployer.
 * The appDeployer is the recommended high-level API for app deployment as it handles:
 * - Idempotent deployments (won't redeploy if the app already exists)
 * - Deployment metadata tracking
 * - Updatability and deletability controls
 */
async function deployNewApp() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds from the LocalNet dispenser
  const deployer = await algorand.account.localNet.dispenser()
  
  console.log('Deployer account:', deployer.addr)

  // Read the approval and clear state programs
  const approvalProgram = fs.readFileSync(
    path.join(__dirname, 'approval.teal'),
    'utf8'
  )
  const clearProgram = fs.readFileSync(
    path.join(__dirname, 'clear.teal'),
    'utf8'
  )

  // Compile the TEAL programs
  const approvalCompiled = await algorand.client.algod.compile(approvalProgram).do()
  const clearCompiled = await algorand.client.algod.compile(clearProgram).do()

  // Define deployment metadata
  // This metadata is used for idempotent deployments and tracking
  const metadata = {
    name: 'MyExampleApp',
    version: '1.0.0',
    updatable: true,  // Can be updated after deployment
    deletable: true,  // Can be deleted after deployment
  }

  console.log('\nDeploying application with metadata:', metadata)

  // Create the deployment parameters
  const deployment = {
    sender: deployer.addr,
    metadata,
    createParams: {
      approvalProgram: new Uint8Array(Buffer.from(approvalCompiled.result, 'base64')),
      clearStateProgram: new Uint8Array(Buffer.from(clearCompiled.result, 'base64')),
      globalNumUint: 1,
      globalNumByteSlice: 1,
      localNumUint: 0,
      localNumByteSlice: 0,
    },
    deployTimeParams: {
      TMPL_UPDATABLE: metadata.updatable ? 1 : 0,
      TMPL_DELETABLE: metadata.deletable ? 1 : 0,
    },
  }

  try {
    // Deploy the application
    // This will create the app on the blockchain
    const result = await algorand.appDeployer.deploy(deployment)

    console.log('\n✅ Application deployed successfully!')
    console.log('\nDeployment Details:')
    console.log('-------------------')
    console.log('App ID:', result.appId.toString())
    console.log('App Address:', result.appAddress)
    console.log('Transaction ID:', result.transaction.txID())
    console.log('Created Round:', result.createdRound.toString())
    console.log('Updated Round:', result.updatedRound.toString())
    console.log('\nMetadata:')
    console.log('Name:', result.name)
    console.log('Version:', result.version)
    console.log('Updatable:', result.updatable)
    console.log('Deletable:', result.deletable)
    console.log('Deleted:', result.deleted)

    // Verify the app address matches the expected address
    const expectedAddress = getApplicationAddress(result.appId)
    console.log('\nVerification:')
    console.log('Expected Address:', expectedAddress)
    console.log('Matches:', result.appAddress === expectedAddress ? '✓' : '✗')

    return result
  } catch (error) {
    console.error('❌ Deployment failed:', error)
    throw error
  }
}

// Run the example
deployNewApp()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Example failed:', error)
    process.exit(1)
  })