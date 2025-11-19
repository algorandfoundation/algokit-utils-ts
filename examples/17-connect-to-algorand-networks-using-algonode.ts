import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to connect to Algorand networks using AlgoNode.
 *
 * AlgoNode provides free, public infrastructure for Algorand networks,
 * making it easy to connect to MainNet and TestNet for development and production.
 * AlgoKit Utils provides convenient methods to connect to these networks.
 *
 * Prerequisites:
 * - Node.js and npm installed
 * - Internet connection (to connect to AlgoNode services)
 */

async function main() {
  console.log('=== Connect to Algorand Networks Using AlgoNode ===\n')

  // Example 1: Connect to MainNet using AlgoNode
  console.log('1. Connecting to MainNet via AlgoNode:')
  try {
    const mainnet = AlgorandClient.mainNet()

    // Test the connection
    const status = await mainnet.client.algod.status().do()
    const health = await mainnet.client.indexer.makeHealthCheck().do()

    console.log('  ✓ Successfully connected to MainNet')
    console.log(`    - Algod: https://mainnet-api.algonode.cloud:443`)
    console.log(`    - Indexer: https://mainnet-idx.algonode.cloud:443`)
    console.log(`    - Current Round: ${status.lastRound}`)
    console.log(`    - Indexer Round: ${health.round}`)
    console.log()
  } catch (error) {
    console.error('  ✗ Failed to connect to MainNet:', error)
  }

  // Example 2: Connect to TestNet using AlgoNode
  console.log('2. Connecting to TestNet via AlgoNode:')
  try {
    const testnet = AlgorandClient.testNet()

    // Test the connection
    const status = await testnet.client.algod.status().do()
    const health = await testnet.client.indexer.makeHealthCheck().do()

    console.log('  ✓ Successfully connected to TestNet')
    console.log(`    - Algod: https://testnet-api.algonode.cloud:443`)
    console.log(`    - Indexer: https://testnet-idx.algonode.cloud:443`)
    console.log(`    - Current Round: ${status.lastRound}`)
    console.log(`    - Indexer Round: ${health.round}`)
    console.log()
  } catch (error) {
    console.error('  ✗ Failed to connect to TestNet:', error)
  }

  // Example 3: Why use AlgoNode?
  console.log('3. Benefits of using AlgoNode:')
  console.log('  • Free, public access to Algorand networks')
  console.log('  • No authentication required')
  console.log('  • High availability and reliability')
  console.log('  • Supports both algod (node) and indexer APIs')
  console.log('  • Perfect for development, testing, and production')
  console.log('  • No need to run your own node infrastructure')
  console.log()

  // Example 4: Network comparison
  console.log('4. Network configurations:')
  console.log('  MainNet (Production):')
  console.log('    - Use for real transactions with real ALGO')
  console.log('    - Algod: https://mainnet-api.algonode.cloud:443')
  console.log('    - Indexer: https://mainnet-idx.algonode.cloud:443')
  console.log()

  console.log('  TestNet (Testing):')
  console.log('    - Use for testing with free test ALGO')
  console.log('    - Get test ALGO from dispenser')
  console.log('    - Algod: https://testnet-api.algonode.cloud:443')
  console.log('    - Indexer: https://testnet-idx.algonode.cloud:443')
  console.log()

  console.log('  LocalNet (Development):')
  console.log('    - Use AlgorandClient.defaultLocalNet() or .fromEnvironment()')
  console.log('    - Runs on your local machine via Docker')
  console.log('    - Algod: http://localhost:4001')
  console.log('    - Indexer: http://localhost:8980')
  console.log()

  console.log('=== Key Takeaways ===')
  console.log('• Use AlgorandClient.mainNet() for MainNet connections')
  console.log('• Use AlgorandClient.testNet() for TestNet connections')
  console.log('• AlgoNode provides free, reliable infrastructure')
  console.log('• No authentication required for public AlgoNode services')
  console.log('• Both algod and indexer clients are automatically configured')
}

main().catch(console.error)
