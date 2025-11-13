import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to configure an Indexer client using environment variables.
 * The Indexer is used to query historical blockchain data, transactions, accounts, and assets.
 * Using environment variables allows you to easily switch between different networks and environments.
 *
 * Prerequisites:
 * - Node.js and npm installed
 * - Environment variables set (INDEXER_SERVER, INDEXER_PORT, INDEXER_TOKEN)
 */

async function main() {
  console.log('=== Indexer Client Configuration Example ===\n')

  // Example 1: Configure Indexer from environment variables
  console.log('1. Configuring Indexer client with environment variables:')

  // Set the required environment variables for Indexer
  // These would typically be set in your .env file or deployment configuration
  process.env.INDEXER_SERVER = 'http://localhost'
  process.env.INDEXER_PORT = '8980'
  process.env.INDEXER_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

  try {
    // Create an Algorand client from environment variables
    const algorand = AlgorandClient.fromEnvironment()

    console.log('  ✓ AlgorandClient created successfully from environment variables')

    // Get the indexer client to verify configuration
    const indexerClient = algorand.client.indexer

    // Test the connection by getting indexer health
    const health = await indexerClient.makeHealthCheck().do()

    console.log('  ✓ Successfully connected to Indexer:')
    console.log(`    - Server: ${process.env.INDEXER_SERVER}:${process.env.INDEXER_PORT}`)
    console.log(`    - Token: ${process.env.INDEXER_TOKEN.substring(0, 10)}...`)
    console.log(`    - Round: ${health.round}`)
    console.log()
  } catch (error) {
    console.error('  ✗ Failed to create client or connect:', error)
  }

  // Example 2: What you can do with Indexer
  console.log('2. Indexer capabilities:')
  console.log('  The Indexer allows you to:')
  console.log('    • Query account information and balances')
  console.log('    • Search for transactions by various criteria')
  console.log('    • Look up asset information')
  console.log('    • Retrieve application state and history')
  console.log('    • Access block information')
  console.log()

  // Example 3: Custom Indexer client
  console.log('3. Creating custom Indexer client:')

  try {
    // You can also create a custom indexer client directly
    const customIndexerClient = new algosdk.Indexer(
      process.env.INDEXER_TOKEN!,
      process.env.INDEXER_SERVER!,
      process.env.INDEXER_PORT!
    )

    // When using fromClients, you need to provide both algod and indexer
    // or use the indexer client directly
    const health = await customIndexerClient.makeHealthCheck().do()

    console.log('  ✓ Custom Indexer client created successfully:')
    console.log(`    - Round: ${health.round}`)
    console.log()
  } catch (error) {
    console.error('  ✗ Failed to create custom indexer client:', error)
  }

  // Example 4: Network-specific configurations
  console.log('=== Environment Setup Tips ===')
  console.log('For LocalNet (development):')
  console.log('  INDEXER_SERVER=http://localhost')
  console.log('  INDEXER_PORT=8980')
  console.log('  INDEXER_TOKEN=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
  console.log()

  console.log('For TestNet:')
  console.log('  INDEXER_SERVER=https://testnet-idx.algonode.cloud')
  console.log('  INDEXER_PORT=443')
  console.log('  INDEXER_TOKEN= (leave empty for public nodes)')
  console.log()

  console.log('For MainNet:')
  console.log('  INDEXER_SERVER=https://mainnet-idx.algonode.cloud')
  console.log('  INDEXER_PORT=443')
  console.log('  INDEXER_TOKEN= (leave empty for public nodes)')
  console.log()

  console.log('=== Key Takeaways ===')
  console.log('• Set INDEXER_SERVER, INDEXER_PORT, and INDEXER_TOKEN environment variables')
  console.log('• Use AlgorandClient.fromEnvironment() to create client with indexer')
  console.log('• Indexer is essential for querying historical blockchain data')
  console.log('• This pattern works great for different deployment environments')
  console.log('• You can also create custom indexer clients with algosdk.Indexer')
}

main().catch(console.error)
