import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to use custom error transformers
 * to provide meaningful, user-friendly error messages when transactions fail.
 *
 * Error transformers allow you to:
 * - Catch cryptic blockchain errors
 * - Transform them into readable messages
 * - Provide better debugging information
 * - Improve user experience in dApps
 */

/**
 * Custom error transformer that catches asset-related errors
 * and transforms them into user-friendly messages
 */
async function assetErrorTransformer(error: Error): Promise<Error> {
  // Convert error to string to check all nested messages
  const errorString = error.toString() + ' ' + error.message

  // Check if the error message contains asset-related issues
  if (errorString.includes('asset') && errorString.includes('1337')) {
    // Return a new error with a clearer message
    return new Error('ASSET MISSING! The asset with ID 1337 does not exist on this network.')
  }

  // Check for invalid asset errors or missing asset errors
  if (errorString.toLowerCase().includes('asset') && errorString.toLowerCase().includes('missing')) {
    return new Error('ASSET MISSING! Please check that the asset ID is correct and exists.')
  }

  // Return the original error if we don't handle it
  return error
}

/**
 * Another error transformer for account balance errors
 */
async function balanceErrorTransformer(error: Error): Promise<Error> {
  const errorString = error.toString() + ' ' + error.message

  if (errorString.includes('overspend') || errorString.toLowerCase().includes('insufficient')) {
    return new Error('INSUFFICIENT BALANCE! Your account does not have enough funds for this transaction.')
  }

  // Return the original error if we don't handle it
  return error
}

async function demonstrateErrorTransformers() {
  console.log('=== Custom Error Transformer Example ===')
  console.log()

  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a test account
  const sender = await algorand.account.fromEnvironment('SENDER')

  console.log('Sender address:', sender.addr.toString())
  console.log()

  // Example 1: Error transformation during simulation
  console.log('--- Example 1: Simulate with Error Transformer ---')
  try {
    // Create a new transaction group
    const composer = algorand.newGroup()

    // Add an asset transfer for a non-existent asset (ID 1337)
    composer.addAssetTransfer({
      amount: 1n,
      assetId: 1337n,  // This asset doesn't exist
      sender: sender.addr,
      receiver: sender.addr,
    })

    // Register our custom error transformers
    console.log('Registering error transformers...')
    composer.registerErrorTransformer(assetErrorTransformer)
    composer.registerErrorTransformer(balanceErrorTransformer)

    // Try to simulate - this will fail with our custom error message
    console.log('Simulating transaction (will fail)...')
    await composer.simulate()

  } catch (error) {
    console.log('✓ Caught transformed error:', (error as Error).message)
  }
  console.log()

  // Example 2: Error transformation during send
  console.log('--- Example 2: Send with Error Transformer ---')
  try {
    // Create another transaction group
    const composer = algorand.newGroup()

    // Add the same invalid asset transfer
    composer.addAssetTransfer({
      amount: 1n,
      assetId: 1337n,  // This asset doesn't exist
      sender: sender.addr,
      receiver: sender.addr,
    })

    // Register error transformers
    console.log('Registering error transformers...')
    composer.registerErrorTransformer(assetErrorTransformer)
    composer.registerErrorTransformer(balanceErrorTransformer)

    // Try to send - this will fail with our custom error message
    console.log('Sending transaction (will fail)...')
    await composer.send()

  } catch (error) {
    console.log('✓ Caught transformed error:', (error as Error).message)
  }
  console.log()

  // Example 3: Chain multiple transformers
  console.log('--- Example 3: Multiple Error Transformers ---')
  console.log('When multiple transformers are registered, they are called in order.')
  console.log('Each transformer can modify the error or pass it through unchanged.')
  console.log('This allows you to create a hierarchy of error handling.')
  console.log('Transformers should return the original error if they don\'t handle it.')
}

// Run the example
demonstrateErrorTransformers()
  .then(() => {
    console.log('\n✅ Error transformer demonstration complete')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Unexpected error:', error.message)
    process.exit(1)
  })
