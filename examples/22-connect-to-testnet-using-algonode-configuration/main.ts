import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to connect to Algorand TestNet using AlgoNode.
 *
 * AlgoNode provides free, public infrastructure for accessing Algorand networks.
 * TestNet is perfect for testing your applications with free test ALGO before
 * deploying to MainNet.
 */

async function main() {
  console.log('=== Connect to TestNet Using AlgoNode ===\n')

  console.log('1. Connecting to Algorand TestNet via AlgoNode...')

  // Create an AlgorandClient configured for TestNet using AlgoNode
  // This automatically configures both algod and indexer clients
  const algorand = AlgorandClient.testNet()

  console.log('  ✓ Successfully connected to TestNet')
  console.log('    - Algod: https://testnet-api.algonode.cloud:443')
  console.log('    - Indexer: https://testnet-idx.algonode.cloud:443')
  console.log('    - Using AlgoNode public infrastructure')
  console.log()

  // Access the algod and indexer clients
  const algod = algorand.client.algod
  const indexer = algorand.client.indexer

  try {
    // Verify algod connection
    console.log('2. Verifying algod connection...')
    const status = await algod.status().do()

    console.log('  ✓ Algod connection verified')
    console.log()
    console.log('  Network Status:')
    console.log(`    - Last Round: ${status.lastRound}`)
    console.log(`    - Time Since Last Round: ${status.timeSinceLastRound}ms`)
    console.log()

    // Verify indexer connection
    console.log('3. Verifying indexer connection...')
    const health = await indexer.makeHealthCheck().do()

    console.log('  ✓ Indexer connection verified')
    console.log()
    console.log('  Indexer Health:')
    console.log(`    - Current Round: ${health.round}`)
    console.log(`    - Version: ${health.version}`)
    console.log()

    // Get transaction parameters
    console.log('4. Fetching transaction parameters...')
    const params = await algod.getTransactionParams().do()

    console.log('  ✓ Transaction parameters retrieved')
    console.log()
    console.log('  Transaction Parameters:')
    console.log(`    - Genesis ID: ${params.genesisID}`)
    console.log(`    - Min Fee: ${params.minFee} microAlgos`)
    console.log()

    console.log('=== Summary ===')
    console.log('✅ Successfully connected to TestNet!')
    console.log()
    console.log('You can now use TestNet to:')
    console.log('  • Test your applications with free test ALGO')
    console.log('  • Deploy and test smart contracts')
    console.log('  • Practice transactions without risk')
    console.log('  • Get test ALGO from the dispenser')
    console.log('  • Validate before deploying to MainNet')
    console.log()
    console.log('=== Key Takeaways ===')
    console.log('• Use AlgorandClient.testNet() to connect to TestNet')
    console.log('• AlgoNode provides free public access')
    console.log('• TestNet uses free test ALGO (no real value)')
    console.log('• Perfect for testing before MainNet deployment')
  } catch (error) {
    console.error('\n❌ Error connecting to TestNet:')
    console.error(error)
    console.error('\nPlease check your internet connection and try again.')
    process.exit(1)
  }
}

main().catch(console.error)
