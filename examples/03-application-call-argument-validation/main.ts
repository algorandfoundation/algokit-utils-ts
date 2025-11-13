import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import appSpecJson from './artifacts/application.json'

/**
 * This example demonstrates how the AlgoKit TypeScript SDK validates
 * argument counts when calling application methods.
 *
 * The SDK will throw a helpful error if you provide too many or too few
 * arguments to a method, helping catch bugs at runtime.
 */

async function main() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a funded test account
  const sender = await algorand.account.fromEnvironment('DEPLOYER')
  console.log('Using account:', sender.addr)

  // Load the app spec (cast to any to avoid type issues with the JSON import)
  const appSpec = appSpecJson as any

  // Create an app factory with the testing app spec
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: sender.addr,
  })

  // Deploy the application with deployment parameters
  console.log('\nDeploying application...')
  const { appClient } = await factory.send.bare.create({
    deployTimeParams: {
      UPDATABLE: 0,
      DELETABLE: 0,
      VALUE: 1,
    },
  })
  console.log('Application deployed with ID:', appClient.appId)

  // Attempt to call a method with too many arguments
  // This demonstrates the SDK's argument validation
  console.log('\n--- Testing Argument Validation ---')
  console.log('Attempting to call method with incorrect number of arguments...')

  try {
    // call_abi expects only 1 argument (string), but we're providing 2
    await appClient.send.call({
      method: 'call_abi',
      args: ['test', 'extra'], // Extra argument here!
    })
    console.log('❌ ERROR: Should have thrown an error!')
  } catch (error) {
    // The SDK validates arguments and provides a helpful error message
    console.log('\n✓ Caught expected error:')
    console.log(`   ${(error as Error).message}`)
    // Expected: "Unexpected arg at position 1. call_abi only expects 1 args"
  }

  // Now call the method correctly with the right number of arguments
  console.log('\n--- Calling Method Correctly ---')
  console.log('Calling method with correct number of arguments...')

  const result = await appClient.send.call({
    method: 'call_abi',
    args: ['test'],
  })

  console.log(`✓ Method called successfully! Result: ${result.return}`)

  console.log('\n=== Summary ===')
  console.log('✓ Argument validation works correctly!')
  console.log('✓ The SDK prevents bugs by validating argument counts at runtime.')
  console.log('✓ Clear error messages help developers quickly identify issues.')
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})