import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * This example demonstrates how to work with ABI methods that have default arguments
 * sourced from different locations:
 * 1. Default values from constant values
 * 2. Default values computed by another ABI method
 * 3. Default values read from global state
 * 4. Default values read from local state
 */

async function demonstrateAbiDefaultArguments() {
  // Setup: Create a local Algorand testing environment
  const localnet = algorandFixture()
  await localnet.newScope()
  const { algod, indexer, testAccount } = localnet.context

  const algorand = AlgorandClient.fromClients({ algod, indexer })
  algorand.setDefaultSigner(testAccount.signer)

  // Deploy the smart contract
  console.log('Deploying TestingApp...')
  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: testAccount.addr,
  })

  const { appClient } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1,
      TMPL_DELETABLE: 1,
      TMPL_VALUE: 123,
    },
  })
  console.log(`App deployed with ID: ${appClient.appId}\n`)

  console.log('=== ABI Methods with Default Arguments ===\n')

  // ===================================================================
  // Example 1: Default Value from Constant
  // ===================================================================
  console.log('1. Default Value from Constant')
  console.log('   Calling method where default is a hard-coded constant...')

  // Call with explicit value
  const resultFromConst = await appClient.send.defaultValue({
    args: ['defined value'],
  })
  console.log('   With explicit value:', resultFromConst.return)

  // Call with undefined to use the constant default
  const resultFromConstDefault = await appClient.send.defaultValue({
    args: [undefined],
  })
  console.log('   With default value:', resultFromConstDefault.return)

  // ===================================================================
  // Example 2: Default Value from ABI Method
  // ===================================================================
  console.log('\n2. Default Value from ABI Method')
  console.log('   Calling method where default is computed by another method...')

  // Call with explicit value
  const resultFromAbi = await appClient.send.defaultValueFromAbi({
    args: ['defined value'],
  })
  console.log('   With explicit value:', resultFromAbi.return)

  // Call with undefined to trigger the ABI method default
  const resultFromAbiDefault = await appClient.send.defaultValueFromAbi({
    args: [undefined],
  })
  console.log('   With default from ABI method:', resultFromAbiDefault.return)

  // ===================================================================
  // Example 3: Default Value from Global State
  // ===================================================================
  console.log('\n3. Default Value from Global State')
  console.log('   Setting global state and using it as default...')

  // First, set the global state value
  const globalInt1 = 456n
  await appClient.send.setGlobal({
    args: [globalInt1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])],
  })
  console.log('   Global state set to:', globalInt1)

  // Call with undefined to use global state as default
  const resultFromGlobalDefault = await appClient.send.defaultValueFromGlobalState({
    args: [undefined],
  })
  console.log('   With default from global state:', resultFromGlobalDefault.return)

  // ===================================================================
  // Example 4: Default Value from Local State
  // ===================================================================
  console.log('\n4. Default Value from Local State')
  console.log('   Opting in, setting local state, and using it as default...')

  // First, opt into the application
  await appClient.send.optIn.optIn({
    args: [],
  })
  console.log('   Account opted in to application')

  // Set the local state value
  const localBytes1 = 'bananas'
  await appClient.send.setLocal({
    args: [1, 2, localBytes1, new Uint8Array([1, 2, 3, 4])],
  })
  console.log('   Local state set to:', localBytes1)

  // Call with explicit value
  const resultFromLocal = await appClient.send.defaultValueFromLocalState({
    args: ['defined value'],
  })
  console.log('   With explicit value:', resultFromLocal.return)

  // Call with undefined to use local state as default
  const resultFromLocalDefault = await appClient.send.defaultValueFromLocalState({
    args: [undefined],
  })
  console.log('   With default from local state:', resultFromLocalDefault.return)

  console.log('\n=== Example Complete ===')
  console.log('\nKey Takeaways:')
  console.log('- Default arguments can come from constants, ABI methods, global state, or local state')
  console.log('- Pass undefined to use the default value')
  console.log('- Pass explicit values to override defaults')
  console.log('- Global state defaults are shared across all users')
  console.log('- Local state defaults require opting in and are per-user')
}

// Run the example
demonstrateAbiDefaultArguments()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
