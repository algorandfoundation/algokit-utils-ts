import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import appSpecJson from './artifacts/application.json'

/**
 * This example demonstrates how to call ABI methods that have default arguments.
 *
 * Default arguments allow smart contract methods to provide fallback values when
 * arguments are not explicitly provided by the caller. This feature is part of ARC-4.
 *
 * Two scenarios are shown:
 * 1. Default value from a constant (defined in the contract)
 * 2. Default value from another ABI method (computed dynamically)
 *
 * Prerequisites:
 * - AlgoKit installed and LocalNet running
 * - A deployed smart contract with ABI methods that have default arguments
 */

async function demonstrateAbiDefaultArguments() {
  // Initialize AlgorandClient to connect to LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account with funds
  const testAccount = await algorand.account.dispenserFromEnvironment()

  console.log('Deploying smart contract with ABI default arguments...')

  // Load the app spec and create a factory
  const appSpec = appSpecJson as any
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: testAccount.addr,
  })

  // Deploy the application
  const { appClient } = await factory.send.bare.create({
    deployTimeParams: {
      UPDATABLE: 0,
      DELETABLE: 0,
      VALUE: 1,
    },
  })

  console.log(`Application deployed with ID: ${appClient.appId}`)

  // ==========================================
  // SCENARIO 1: Default Value from Constant
  // ==========================================
  console.log('\n=== Default Value from Constant ===')
  console.log('Method signature: default_value(string)string')

  // Call the method WITH an explicit argument
  const result1 = await appClient.send.call({
    method: 'default_value',
    args: ['defined value'],
  })
  console.log('Called with explicit argument "defined value"')
  console.log('Result:', result1.return) // Expected: 'defined value'

  // Call the method WITHOUT an argument (uses default)
  const result2 = await appClient.send.call({
    method: 'default_value',
    args: [undefined], // Pass undefined to use default
  })
  console.log('\nCalled without argument (using default)')
  console.log('Result:', result2.return) // Expected: 'default value'
  console.log('The contract used its predefined constant default value')

  // ==========================================
  // SCENARIO 2: Default Value from ABI Method
  // ==========================================
  console.log('\n=== Default Value from ABI Method ===')
  console.log('Method signature: default_value_from_abi(string)string')
  console.log('The default value is computed by calling another ABI method')

  // Call the method WITH an explicit argument
  const result3 = await appClient.send.call({
    method: 'default_value_from_abi',
    args: ['defined value'],
  })
  console.log('\nCalled with explicit argument "defined value"')
  console.log('Result:', result3.return) // Expected: 'ABI, defined value'

  // Call the method WITHOUT an argument (uses default from ABI method)
  const result4 = await appClient.send.call({
    method: 'default_value_from_abi',
    args: [undefined], // Pass undefined to use default
  })
  console.log('\nCalled without argument (using default from ABI method)')
  console.log('Result:', result4.return) // Expected: 'ABI, default value'
  console.log('The contract computed the default by calling another method')

  // ==========================================
  // SUMMARY
  // ==========================================
  console.log('\n=== Summary ===')
  console.log('✅ Constant default: Method uses a hardcoded default value')
  console.log('✅ Method default: Method computes default by calling another method')
  console.log('✅ This reduces transaction complexity and improves UX')
  console.log('\nBenefits of default arguments:')
  console.log('- Simpler API for common use cases')
  console.log('- Backward compatibility when adding new parameters')
  console.log('- Reduced transaction data when defaults are acceptable')
}

// Run the example
demonstrateAbiDefaultArguments().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
