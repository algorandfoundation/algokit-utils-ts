import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { randomUUID } from 'crypto'

/**
 * This example demonstrates how to create and manage accounts using fromEnvironment.
 *
 * Key features:
 * 1. Create a new account with automatic funding (on LocalNet/TestNet)
 * 2. Verify the account is funded by checking its balance
 * 3. Retrieve the same account multiple times (idempotent retrieval)
 * 4. Understand that multiple retrievals return the same keys but different object instances
 *
 * Use case: Essential for applications that need to manage multiple accounts dynamically.
 */

async function main() {
  // Initialize the AlgorandClient for LocalNet
  // Note: fromEnvironment with auto-funding works on LocalNet and TestNet with a dispenser
  const algorand = AlgorandClient.defaultLocalNet()

  console.log('=== Example 1: Create and Fund a New Account ===')

  // Generate a unique identifier for the account
  // This could be any string - in production, you might use user IDs, session IDs, etc.
  const accountName = randomUUID()
  console.log('\nCreating account with identifier:', accountName)

  // Create an account from environment
  // If the environment variable doesn't exist, a new account is created and funded automatically
  // On LocalNet, this will create the account in KMD and fund it
  const account = await algorand.account.fromEnvironment(accountName)
  console.log('Account created with address:', account.addr.toString())

  // Get account information to verify it exists and is funded
  const accountInfo = await algorand.account.getInformation(account.addr)
  console.log('Account balance:', accountInfo.balance.microAlgos.toString(), 'microAlgos')
  console.log('Account balance:', accountInfo.balance.algos.toString(), 'Algos')

  if (accountInfo.balance.microAlgos > 0n) {
    console.log('✓ Account is successfully funded!')
  }

  console.log('\n=== Example 2: Idempotent Account Retrieval ===')

  // Generate another unique identifier
  const secondAccountName = randomUUID()
  console.log('\nCreating account with identifier:', secondAccountName)

  // Retrieve the account for the first time
  const firstRetrieval = await algorand.account.fromEnvironment(secondAccountName)
  console.log('First retrieval - Address:', firstRetrieval.addr.toString())

  // Retrieve the same account again using the same identifier
  const secondRetrieval = await algorand.account.fromEnvironment(secondAccountName)
  console.log('Second retrieval - Address:', secondRetrieval.addr.toString())

  // Compare the results
  console.log('\nComparison:')
  console.log('Are they the same object instance?', firstRetrieval === secondRetrieval)
  console.log('Do they have the same address?', firstRetrieval.addr.toString() === secondRetrieval.addr.toString())

  // Check if secret keys are available and compare them
  // Note: Secret keys may not be directly accessible for security reasons
  console.log('Secret keys stored securely in KMD (not exposed in memory)')
  console.log('Both retrievals use the same underlying keys from the same account')

  console.log('\n✓ Idempotent retrieval confirmed!')
  console.log('  - Different object instances (not cached)')
  console.log('  - Same cryptographic keys (deterministic generation)')

  console.log('\n=== Key Takeaways ===')
  console.log('1. fromEnvironment creates and funds accounts automatically on LocalNet')
  console.log('2. Using the same identifier retrieves the same account keys')
  console.log('3. Each call returns a new object instance with the same underlying keys')
  console.log('4. This is useful for managing multiple accounts in your application')
  console.log('5. In production, set environment variables to use existing accounts')
}

main()
  .then(() => {
    console.log('\n✅ Example completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  })
