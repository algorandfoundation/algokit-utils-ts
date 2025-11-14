import { AlgorandClient, algos } from '@algorandfoundation/algokit-utils'
import appSpecJson from './artifacts/application.json'

/**
 * This example demonstrates how to clone an app client with different configuration.
 *
 * Cloning is useful when you need multiple app client instances for the same application
 * but with different settings (e.g., different default senders for multi-user scenarios).
 * The cloned client inherits properties like appId and appName from the original.
 *
 * Prerequisites:
 * - AlgoKit installed and LocalNet running
 * - Node.js and npm installed
 */

async function demonstrateAppClientCloneWithDifferentSender() {
  // Initialize AlgorandClient to connect to LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the first account with funds
  const account1 = await algorand.account.dispenserFromEnvironment()

  console.log('--- Deploying Application ---')

  // Deploy the application with account1 as the default sender
  const appSpec = appSpecJson as any
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: account1.addr,
  })

  const { appClient } = await factory.send.bare.create({
    deployTimeParams: {
      UPDATABLE: 0,
      DELETABLE: 0,
      VALUE: 1,
    },
  })

  console.log(`✅ App deployed successfully!`)
  console.log(`   App ID: ${appClient.appId}`)
  console.log(`   App Name: ${appClient.appName}`)
  console.log(`   Default Sender: ${account1.addr}\n`)

  // ===================================================================
  // Create a second account that will interact with the same app
  // ===================================================================
  console.log('--- Creating Second Account ---')

  const account2 = algorand.account.random()

  // Fund the second account
  await algorand.send.payment({
    sender: account1,
    receiver: account2.addr,
    amount: algos(1),
  })

  console.log(`✅ Second account created: ${account2.addr}`)
  console.log(`   Funded with 1 ALGO\n`)

  // ===================================================================
  // Clone the app client with a different default sender
  // ===================================================================
  console.log('--- Cloning App Client ---')

  const clonedAppClient = appClient.clone({
    defaultSender: account2.addr,
  })

  console.log('✅ App client cloned successfully!\n')

  // ===================================================================
  // Verify inherited and overridden properties
  // ===================================================================
  console.log('--- Verifying Client Properties ---\n')

  // The cloned client should have the same appId
  console.log('App IDs:')
  console.log(`   Original: ${appClient.appId}`)
  console.log(`   Cloned:   ${clonedAppClient.appId}`)
  console.log(`   Match: ${appClient.appId === clonedAppClient.appId ? '✅' : '❌'}\n`)

  // The cloned client should inherit the app name
  console.log('App Names:')
  console.log(`   Original: ${appClient.appName}`)
  console.log(`   Cloned:   ${clonedAppClient.appName}`)
  console.log(`   Match: ${appClient.appName === clonedAppClient.appName ? '✅' : '❌'}\n`)

  // ===================================================================
  // Demonstrate both clients can interact with the same app
  // ===================================================================
  console.log('--- Testing Both Clients ---\n')

  // Call a method using the original client (account1)
  const result1 = await appClient.send.call({
    method: 'call_abi',
    args: ['from account1'],
  })
  console.log(`Original client (account1) result: ${result1.return}`)

  // Call the same method using the cloned client (account2)
  const result2 = await clonedAppClient.send.call({
    method: 'call_abi',
    args: ['from account2'],
  })
  console.log(`Cloned client (account2) result: ${result2.return}\n`)

  // ===================================================================
  // Use Case: Multi-User Interaction
  // ===================================================================
  console.log('--- Use Case: Multiple Users Interacting with Same App ---\n')

  console.log('This pattern is useful when:')
  console.log('  • Multiple users need to interact with the same application')
  console.log('  • You want to reuse the same app configuration (name, appId, etc.)')
  console.log('  • Each user has their own signing account')
  console.log('  • You want to avoid redeploying or looking up the app multiple times\n')

  console.log('Example scenarios:')
  console.log('  • Multiplayer games where each player needs their own client')
  console.log('  • Marketplace apps where buyers and sellers interact differently')
  console.log('  • DAO voting where each member votes with their own account')
  console.log('  • Testing scenarios with multiple simulated users\n')

  console.log('✅ All examples completed successfully!')
}

// Run the example
demonstrateAppClientCloneWithDifferentSender().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
