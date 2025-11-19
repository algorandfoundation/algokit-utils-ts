import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to connect to Algorand MainNet indexer
 * using AlgoNode's public infrastructure and verify the connection.
 *
 * The indexer allows you to query historical blockchain data, search for
 * transactions, accounts, assets, and applications.
 */

async function main() {
  console.log('=== Connect to MainNet Indexer Using AlgoNode ===\n')

  // Create an AlgorandClient connected to MainNet via AlgoNode
  // This automatically configures both algod and indexer clients
  console.log('1. Creating MainNet client using AlgoNode...')
  const algorand = AlgorandClient.mainNet()

  console.log('  ✓ MainNet client created successfully')
  console.log('    - Indexer: https://mainnet-idx.algonode.cloud:443')
  console.log('    - Using AlgoNode public infrastructure')
  console.log()

  // Access the indexer client
  const indexer = algorand.client.indexer

  try {
    // Perform a health check to verify the connection is working
    console.log('2. Verifying indexer connection...')
    const health = await indexer.makeHealthCheck().do()

    console.log('  ✓ Successfully connected to MainNet indexer!')
    console.log()
    console.log('  Indexer Health:')
    console.log(`    - Current Round: ${health.round}`)
    console.log(`    - Version: ${health.version}`)
    console.log()

    console.log('=== Summary ===')
    console.log('✅ Connection verified - ready to query blockchain data!')
    console.log()
    console.log('You can now use the indexer to:')
    console.log('  • Query transaction history')
    console.log('  • Search for accounts and their balances')
    console.log('  • Look up asset information')
    console.log('  • Retrieve application state')
    console.log('  • Access historical blockchain data')
    console.log()
    console.log('=== Key Takeaways ===')
    console.log('• Use AlgorandClient.mainNet() to connect to MainNet')
    console.log('• AlgoNode provides free public indexer access')
    console.log('• No authentication required for public AlgoNode services')
    console.log('• Indexer is essential for querying historical data')
  } catch (error) {
    console.error('\n✗ Failed to connect to MainNet indexer:')
    console.error(error)
    throw error
  }
}

main().catch(console.error)
