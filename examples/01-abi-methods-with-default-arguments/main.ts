import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import appSpecJson from './artifacts/application.json'

/**
 * Example: ABI Methods with Default Arguments
 *
 * This example demonstrates how to call ABI methods that have default argument values.
 * When a method has default arguments, you can omit those arguments and the default
 * value will be used automatically.
 */
async function abiDefaultArguments() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.fromEnvironment()

  // Get a test account
  const testAccount = await algorand.account.fromEnvironment('TEST_ACCOUNT')

  console.log('\n--- ABI Methods with Default Arguments Example ---\n')

  // Cast the imported JSON to AppSpec type
  const appSpec = appSpecJson as AppSpec

  // Get the app factory with the app spec
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: testAccount.addr,
  })

  // Deploy the app
  console.log('Deploying the application...')
  const { appClient: client } = await factory.deploy({
    deployTimeParams: {
      VALUE: 1,
    },
  })

  console.log(`Application deployed with ID: ${client.appId}\n`)

  // ========================================
  // Calling method WITH an explicit argument
  // ========================================
  console.log('1. Calling method with explicit argument:')
  console.log('   Input: "defined value"')

  const resultWithArg = await client.send.call({
    method: 'default_value',
    args: ['defined value'],
  })

  console.log(`   Output: ${resultWithArg.return}\n`)

  // ========================================
  // Calling method WITHOUT an explicit argument (using default)
  // ========================================
  console.log('2. Calling method without explicit argument (using default):')
  console.log('   Input: undefined (will use default value)')

  const resultWithDefault = await client.send.call({
    method: 'default_value',
    args: [undefined], // undefined means use the default value
  })

  console.log(`   Output: ${resultWithDefault.return}\n`)

  // ========================================
  // Explanation
  // ========================================
  console.log('\nHow it works:')
  console.log('  - The ABI method "default_value(string)string" has a default argument value of "default value"')
  console.log('  - When called with an argument, it returns that argument')
  console.log('  - When called with undefined, it uses the default value from the contract')
  console.log('  - The default value is defined as a constant in the application.json hints')
  console.log('  - Check artifacts/application.json to see the default_arguments configuration')

  console.log('\n✅ Successfully demonstrated ABI methods with default arguments!')
}

// Run the example
abiDefaultArguments().catch(console.error)