import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to connect to Algorand MainNet using AlgoNode.
 * AlgoNode provides free, public API endpoints for MainNet and TestNet.
 *
 * Prerequisites:
 * - Internet connection (no local node required)
 * - No API keys needed for basic usage
 */

async function main() {
  try {
    console.log('=== Connect to MainNet Using AlgoNode ===\n')

    console.log('1. Connecting to Algorand MainNet via AlgoNode...')

    // Create an AlgorandClient configured for MainNet using AlgoNode
    // AlgoNode provides free, reliable public API endpoints
    const algorand = AlgorandClient.mainNet()

    console.log('  ✓ Successfully connected to MainNet')
    console.log('    - Algod: https://mainnet-api.algonode.cloud:443')
    console.log('    - Using AlgoNode public infrastructure')
    console.log()

    // Access the algod client
    const algod = algorand.client.algod

    // Verify the connection by fetching the current network status
    console.log('2. Fetching network status...')
    const status = await algod.status().do()

    console.log('  ✓ Network status retrieved')
    console.log()
    console.log('  Network Information:')
    console.log(`    - Last Round: ${status.lastRound}`)
    console.log(`    - Time Since Last Round: ${status.timeSinceLastRound}ms`)
    console.log(`    - Catchup Time: ${status.catchupTime}ms`)
    console.log(`    - Last Version: ${status.lastVersion}`)
    console.log()

    // Fetch additional network parameters
    console.log('3. Fetching transaction parameters...')
    const params = await algod.getTransactionParams().do()

    console.log('  ✓ Transaction parameters retrieved')
    console.log()
    console.log('  Transaction Parameters:')
    console.log(`    - Genesis ID: ${params.genesisID}`)
    console.log(`    - Genesis Hash: ${params.genesisHash}`)
    console.log(`    - Min Fee: ${params.minFee} microAlgos`)
    console.log(`    - Consensus Version: ${params.consensusVersion}`)
    console.log()

    console.log('=== Summary ===')
    console.log('✅ Successfully connected to Algorand MainNet!')
    console.log()
    console.log('You can now use this client to:')
    console.log('  • Query account balances and information')
    console.log('  • Submit transactions to MainNet')
    console.log('  • Read application and asset data')
    console.log('  • Monitor blockchain activity')
    console.log()
    console.log('=== Key Takeaways ===')
    console.log('• Use AlgorandClient.mainNet() to connect to MainNet')
    console.log('• AlgoNode provides free public API access')
    console.log('• No authentication required for public AlgoNode services')
    console.log('• MainNet contains real ALGO with real value')
    console.log()
    console.log('Note: For production applications with high request volumes,')
    console.log('consider running your own node or using a rate-limited API service.')
  } catch (error) {
    console.error('\n❌ Error connecting to MainNet:')
    console.error(error)
    console.error('\nPlease check your internet connection and try again.')
    process.exit(1)
  }
}

main()
