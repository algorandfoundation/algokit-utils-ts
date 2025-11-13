import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import appSpecJson from './artifacts/application.json'

/**
 * This example demonstrates how to clone an app client with a different name.
 *
 * Cloning is useful when you want multiple references to the same app with different configurations,
 * such as different app names for organizational purposes, while maintaining the same app ID.
 *
 * Prerequisites:
 * - AlgoKit installed and LocalNet running
 * - Node.js and npm installed
 */

async function demonstrateAppClientClone() {
  // Initialize AlgorandClient to connect to LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds
  const testAccount = await algorand.account.dispenserFromEnvironment()

  console.log('=== Clone App Client Example ===\n')

  // Step 1: Deploy an application with an initial name
  console.log('Step 1: Deploying application...')

  const appSpec = appSpecJson as any
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: testAccount.addr,
  })

  const { appClient } = await factory.send.bare.create({
    deployTimeParams: {
      UPDATABLE: 0,
      DELETABLE: 0,
      VALUE: 1,
    },
  })

  console.log(`App deployed with ID: ${appClient.appId}`)
  console.log(`Original app name: ${appClient.appName}\n`)

  // Step 2: Clone the app client with a different name
  console.log('Step 2: Cloning app client with new name...')
  const clonedAppClient = appClient.clone({
    appName: 'cloned-app',
  })

  // Step 3: Verify the clone maintains the same app ID but has a different name
  console.log('\n=== Results ===')
  console.log(`Original App ID: ${appClient.appId}`)
  console.log(`Cloned App ID: ${clonedAppClient.appId}`)
  console.log(`App IDs match: ${clonedAppClient.appId === appClient.appId}`)
  console.log(`\nOriginal app name: ${appClient.appName}`)
  console.log(`Cloned app name: ${clonedAppClient.appName}`)
  console.log(`Names are different: ${clonedAppClient.appName !== appClient.appName}`)

  // Step 4: Demonstrate that both clients can interact with the same app
  console.log('\n=== Testing Both Clients ===')

  // Call a method using the original client
  const result1 = await appClient.send.call({
    method: 'call_abi',
    args: ['World'],
  })
  console.log(`Original client result: ${result1.return}`)

  // Call the same method using the cloned client
  const result2 = await clonedAppClient.send.call({
    method: 'call_abi',
    args: ['Clone'],
  })
  console.log(`Cloned client result: ${result2.return}`)

  console.log('\n✅ Clone successful! Both clients reference the same app with different names.')
  console.log('\nUse cases for cloning:')
  console.log('- Different organizational names for the same app')
  console.log('- Different default signers for different contexts')
  console.log('- Different default parameters while maintaining the same app ID')
}

// Run the example
demonstrateAppClientClone().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
