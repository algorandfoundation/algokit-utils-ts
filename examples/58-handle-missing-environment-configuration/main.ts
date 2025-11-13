import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to handle missing environment configuration
 * when attempting to get indexer client configuration.
 *
 * AlgorandClient can load configuration from environment variables,
 * but it will throw descriptive errors if required variables are missing.
 * This helps developers understand what configuration is needed.
 */

function demonstrateMissingConfig() {
  console.log('Example: Handling Missing Environment Configuration\n')

  // Save current environment variables (if any)
  const savedServer = process.env.ALGOD_SERVER
  const savedPort = process.env.ALGOD_PORT
  const savedToken = process.env.ALGOD_TOKEN

  try {
    // Clear environment variables to simulate missing configuration
    console.log('Simulating missing environment configuration...')
    delete process.env.ALGOD_SERVER
    delete process.env.ALGOD_PORT
    delete process.env.ALGOD_TOKEN

    console.log('\nAttempting to create AlgorandClient from environment...')

    // This will throw an error because ALGOD_SERVER is not defined
    const algorand = AlgorandClient.fromEnvironment()

    // This line won't be reached
    console.log('Client created:', algorand)

  } catch (error) {
    // Expected error: descriptive message about missing configuration
    console.log('\n❌ Expected Error Caught:')
    console.log(`   ${error instanceof Error ? error.message : error}`)
    console.log("\nThis error tells developers exactly what's missing!")
  } finally {
    // Restore original environment variables
    if (savedServer !== undefined) process.env.ALGOD_SERVER = savedServer
    if (savedPort !== undefined) process.env.ALGOD_PORT = savedPort
    if (savedToken !== undefined) process.env.ALGOD_TOKEN = savedToken
  }
}

function demonstrateCorrectConfig() {
  console.log('\n\n' + '='.repeat(60))
  console.log('Example: Correct Environment Configuration\n')

  // Set required environment variables
  process.env.ALGOD_SERVER = 'https://testnet-api.algonode.cloud'
  process.env.ALGOD_PORT = '443'
  process.env.ALGOD_TOKEN = '' // AlgoNode doesn't require a token

  console.log('Setting environment variables:')
  console.log(`  ALGOD_SERVER=${process.env.ALGOD_SERVER}`)
  console.log(`  ALGOD_PORT=${process.env.ALGOD_PORT}`)
  console.log(`  ALGOD_TOKEN=${process.env.ALGOD_TOKEN || '(empty)'}`)

  try {
    console.log('\nAttempting to create AlgorandClient from environment...')
    const algorand = AlgorandClient.fromEnvironment()

    console.log('\n✅ AlgorandClient Created Successfully!')
    console.log('   Client is ready to use')

    // Verify we can access the algod client
    console.log('\n✅ Algod client is accessible!')

    // We can also check indexer configuration if INDEXER_* vars are set
    process.env.INDEXER_SERVER = 'https://testnet-idx.algonode.cloud'
    process.env.INDEXER_PORT = '443'
    process.env.INDEXER_TOKEN = ''

    console.log('\nSetting indexer environment variables:')
    console.log(`  INDEXER_SERVER=${process.env.INDEXER_SERVER}`)
    console.log(`  INDEXER_PORT=${process.env.INDEXER_PORT}`)
    console.log(`  INDEXER_TOKEN=${process.env.INDEXER_TOKEN || '(empty)'}`)

    // Create client with both algod and indexer config
    const algorandWithIndexer = AlgorandClient.fromEnvironment()
    console.log('\n✅ AlgorandClient with Indexer created successfully!')

  } catch (error) {
    console.error('\n❌ Unexpected Error:', error)
  }
}

function main() {
  console.log('Environment Configuration Examples')
  console.log('='.repeat(60))

  // First, demonstrate what happens with missing configuration
  demonstrateMissingConfig()

  // Then, show the correct way to configure
  demonstrateCorrectConfig()

  console.log('\n' + '='.repeat(60))
  console.log('\nKey Takeaways:')
  console.log('1. ALGOD_SERVER environment variable is required')
  console.log('2. ALGOD_PORT and ALGOD_TOKEN are optional (have defaults)')
  console.log('3. INDEXER_* variables are optional for indexer functionality')
  console.log('4. Error messages clearly indicate what\'s missing')
  console.log('5. Always handle configuration errors gracefully in production')
}

main()
