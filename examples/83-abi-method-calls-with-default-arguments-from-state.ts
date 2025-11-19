import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { TestingAppFactory } from './artifacts/TestingApp/client'

/**
 * This example demonstrates how to call ABI methods that have default arguments
 * sourced from the application's global state and user's local state.
 *
 * Default arguments allow smart contracts to use stored state values as method parameters,
 * reducing the need to pass the same values repeatedly and simplifying contract interactions.
 */

async function main() {
  // Setup: Initialize test environment and deploy the app
  const localnet = algorandFixture()
  await localnet.newScope()
  const { algod, indexer, testAccount } = localnet.context

  const algorand = AlgorandClient.fromClients({ algod, indexer })
  algorand.setDefaultSigner(testAccount.signer)

  console.log('Deploying TestingApp...')
  const appFactory = algorand.client.getTypedAppFactory(TestingAppFactory, {
    defaultSender: testAccount.addr,
  })

  // Deploy the application with template variables
  const { appClient } = await appFactory.send.create.bare({
    deployTimeParams: {
      TMPL_UPDATABLE: 1, // App is updatable
      TMPL_DELETABLE: 1, // App is deletable
      TMPL_VALUE: 123, // Initial value
    },
  })
  console.log(`App deployed with ID: ${appClient.appId}\n`)

  // ===================================================================
  // Example 1: Default Argument from Global State
  // ===================================================================
  console.log('--- Example 1: Default Argument from Global State ---')

  // First, set a value in global state that will be used as a default argument
  const globalInt1 = 456n
  console.log(`Setting global state value to: ${globalInt1}`)

  await appClient.send.setGlobal({
    args: [globalInt1, 2, 'asdf', new Uint8Array([1, 2, 3, 4])],
  })
  console.log('Global state updated successfully')

  // Now call a method that uses the global state value as a default argument
  // When we don't provide the argument, it will use the value from global state
  console.log('Calling method that uses default value from global state...')
  const resultFromGlobal = await appClient.send.defaultValueFromGlobalState({
    args: [undefined], // Only providing undefined to use the default from global state
  })

  console.log(`Result: ${resultFromGlobal.return}`)
  console.log(`Expected: ${globalInt1} (value from global state)\n`)

  // ===================================================================
  // Example 2: Default Argument from Local State
  // ===================================================================
  console.log('--- Example 2: Default Argument from Local State ---')

  // First, opt into the application to enable local state
  console.log('Opting in to enable local state...')
  await appClient.send.optIn.optIn({
    args: [],
  })
  console.log('Opted in successfully')

  // Set a value in local state that will be used as a default argument
  const localBytes1 = 'bananas'
  console.log(`Setting local state value to: "${localBytes1}"`)

  await appClient.send.setLocal({
    args: [1, 2, localBytes1, new Uint8Array([1, 2, 3, 4])],
  })
  console.log('Local state updated successfully')

  // Call a method with an explicit value (overrides the default)
  console.log('Calling method with explicit argument (overrides default)...')
  const resultWithExplicit = await appClient.send.defaultValueFromLocalState({
    args: ['defined value'],
  })
  console.log(`Result: "${resultWithExplicit.return}"`)
  console.log('Expected: "Local state, defined value"\n')

  // Call the same method without providing the argument
  // It will use the value from local state as the default
  console.log('Calling method that uses default value from local state...')
  const resultFromLocal = await appClient.send.defaultValueFromLocalState({
    args: [undefined], // undefined arg will use local state value
  })
  console.log(`Result: "${resultFromLocal.return}"`)
  console.log(`Expected: "Local state, ${localBytes1}"\n`)

  console.log('✅ All examples completed successfully!')
  console.log('\nKey Takeaways:')
  console.log('- ABI methods can have default arguments sourced from global or local state')
  console.log('- Global state defaults are shared across all users of the app')
  console.log('- Local state defaults are specific to each opted-in user')
  console.log('- Explicit arguments always override default values')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
