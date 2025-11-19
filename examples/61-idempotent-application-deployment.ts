import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import { getApplicationAddress } from 'algosdk'
import appSpec from './artifacts/TestingApp.json' with { type: 'json' }

/**
 * This example demonstrates idempotent application deployment.
 *
 * Idempotent deployment means:
 * - If the app doesn't exist, it will be created
 * - If the app already exists with same code, it will be reused
 * - If the app exists with different code, it can be updated
 * - Running the deployment multiple times is safe
 *
 * This is essential for automated deployments and CI/CD pipelines.
 */

async function deployApplicationIdempotent() {
  console.log('=== Idempotent Application Deployment ===\n')

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds
  const deployer = await algorand.account.fromEnvironment('DEPLOYER', algo(10))
  console.log(`Using deployer account: ${deployer.addr}`)

  // Create an app factory instance
  const factory = algorand.client.getAppFactory({
    appSpec: appSpec as any,
    defaultSender: deployer.addr,
  })

  console.log('\n1. First Deployment (should CREATE)')
  console.log('   Deploying TestingApp application...')

  // Deploy the application - first time will create
  const { result: app } = await factory.deploy({
    onUpdate: 'update', // Update if code changes
    onSchemaBreak: 'replace', // Replace if schema changes
    updatable: true, // Allow updates
    deletable: true, // Allow deletion
    deployTimeParams: {
      VALUE: 1,
    },
  })

  // Check what operation was performed
  console.log(`   ✅ Operation: ${app.operationPerformed}`)
  console.log(`   App ID: ${app.appId}`)
  console.log(`   App Address: ${app.appAddress}`)

  // Verify the app address matches the expected address for the app ID
  const expectedAddress = getApplicationAddress(app.appId)
  console.log(`   ✓ Address verification: ${app.appAddress.toString() === expectedAddress.toString() ? 'PASSED' : 'FAILED'}`)

  // Display compiled programs info
  console.log(`   Approval Program: ${app.compiledApproval ? 'Compiled' : 'Not available'}`)
  console.log(`   Clear Program: ${app.compiledClear ? 'Compiled' : 'Not available'}`)

  console.log('\n2. Second Deployment (should be unchanged)')
  console.log('   Deploying same app again...')

  // Deploy again - should detect existing app and not recreate
  const { result: app2 } = await factory.deploy({
    onUpdate: 'update',
    onSchemaBreak: 'replace',
    updatable: true,
    deletable: true,
    deployTimeParams: {
      VALUE: 1,
    },
  })

  console.log(`   ✅ Operation: ${app2.operationPerformed}`)
  console.log(`   App ID: ${app2.appId}`)
  console.log(`   Same App ID as first deployment: ${app.appId === app2.appId ? 'YES ✓' : 'NO ✗'}`)

  // Test calling a method on the deployed application
  console.log('\n3. Testing the Deployed Application')
  console.log('   Calling call_abi("World") method...')

  const appClient = factory.getAppClientById({ appId: app.appId })
  const callResult = await appClient.send.call({
    method: 'call_abi',
    args: ['World'],
  })

  console.log(`   ✅ Method returned: ${callResult.return}`)

  console.log('\n=== Summary ===')
  console.log('✓ First deployment created the application')
  console.log('✓ Second deployment detected existing app (idempotent)')
  console.log('✓ Application is functional and callable')
  console.log('\n💡 Key Benefits of Idempotent Deployment:')
  console.log('   • Safe to run deployment scripts multiple times')
  console.log('   • No errors if app already exists')
  console.log('   • Automatic detection of updates needed')
  console.log('   • Perfect for CI/CD pipelines and automation')

  return app
}

// Run the example
deployApplicationIdempotent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
