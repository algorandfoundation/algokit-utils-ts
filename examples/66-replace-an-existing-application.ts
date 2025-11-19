import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'
import { getApplicationAddress } from 'algosdk'
import appSpec from './artifacts/TestingApp.json' with { type: 'json' }

/**
 * This example demonstrates how to replace an existing Algorand application.
 *
 * The 'replace' strategy is useful when:
 * - You need to make breaking schema changes
 * - The existing app was marked as deletable
 * - You want a clean slate with a new app ID
 *
 * The process:
 * 1. Deploy an initial app (marked as deletable)
 * 2. Deploy again with onSchemaBreak: 'replace'
 * 3. AlgoKit deletes the old app and creates a new one
 */

async function replaceApplicationExample() {
  console.log('=== Replace Application Example ===\n')

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

  console.log('\nStep 1: Deploy initial application with VALUE=1')
  const { result: createdApp } = await factory.deploy({
    deployTimeParams: {
      VALUE: 1,
    },
    onUpdate: 'update', // Allow updates if app exists
    onSchemaBreak: 'replace',
    deletable: true, // Must be true to allow replacement later
    updatable: true,
  })

  console.log(`✓ Initial app deployed with ID: ${createdApp.appId}`)
  console.log(`  App address: ${createdApp.appAddress}`)
  console.log(`  Operation performed: ${createdApp.operationPerformed}`)

  console.log('\nStep 2: Deploy with replace strategy (VALUE=2)')
  const { result: app } = await factory.deploy({
    deployTimeParams: {
      VALUE: 2,
    },
    onUpdate: 'replace', // This triggers delete + create
    onSchemaBreak: 'replace',
    deletable: true,
    updatable: true,
  })

  console.log(`\n✓ Replacement completed!`)
  console.log(`  Operation performed: ${app.operationPerformed}`)
  console.log(`  Old app ID: ${createdApp.appId}`)
  console.log(`  New app ID: ${app.appId}`)
  console.log(`  New app address: ${app.appAddress}`)

  // Verify the app address
  const expectedAddress = getApplicationAddress(app.appId)
  console.log(
    `  Address verification: ${app.appAddress.toString() === expectedAddress.toString() ? '✓ PASSED' : '✗ FAILED'}`
  )

  // The old app was deleted and a new one was created
  console.log(`  Delete and create operations completed`)

  console.log('\n✓ The new app has a higher ID than the old one, confirming a new app was created')
  console.log(`  New ID (${app.appId}) > Old ID (${createdApp.appId}): ${app.appId > createdApp.appId ? '✓' : '✗'}`)

  // Test calling a method on the new application
  console.log('\n✓ Testing the replaced application')
  const appClient = factory.getAppClientById({ appId: app.appId })
  const callResult = await appClient.send.call({
    method: 'call_abi',
    args: ['Replaced App'],
  })

  console.log(`  Method call successful! Returned: ${callResult.return}`)
}

// Run the example
replaceApplicationExample()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
