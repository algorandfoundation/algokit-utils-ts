import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to connect to LocalNet clients (algod, indexer, KMD)
 * for local development and testing with Algorand.
 *
 * Prerequisites:
 * - LocalNet running (use: algokit localnet start)
 * - Indexer and KMD services enabled
 */

async function main() {
  console.log('=== Connect to LocalNet Clients (Algod, Indexer, KMD) ===\n')

  try {
    // Create AlgorandClient for LocalNet
    // This automatically configures all three clients: algod, indexer, and kmd
    console.log('1. Creating LocalNet client configuration...')
    const algorand = AlgorandClient.defaultLocalNet()
    console.log('  ✓ LocalNet client created successfully\n')

    // 2. Connect to LocalNet Algod Client
    // Algod is the main API for interacting with the Algorand blockchain
    console.log('2. Testing algod client connection...')
    const algod = algorand.client.algod

    // Verify the connection by checking node status
    const status = await algod.status().do()
    console.log('  ✓ Successfully connected to LocalNet algod client')
    console.log(`    - Server: http://localhost:4001`)
    console.log(`    - Last Round: ${status.lastRound}`)
    console.log(`    - Time Since Last Round: ${status.timeSinceLastRound}ms`)
    console.log()

    // 3. Connect to LocalNet Indexer Client
    // Indexer provides a searchable database for blockchain data
    console.log('3. Testing indexer client connection...')
    const indexer = algorand.client.indexer

    // Verify the connection with a health check
    const health = await indexer.makeHealthCheck().do()
    console.log('  ✓ Successfully connected to LocalNet indexer client')
    console.log(`    - Server: http://localhost:8980`)
    console.log(`    - Indexer is healthy and ready for queries`)
    console.log(`    - Round: ${health.round}`)
    console.log()

    // 4. Connect to LocalNet KMD Client
    // KMD (Key Management Daemon) manages wallets and private keys
    console.log('4. Testing KMD client connection...')
    const kmd = algorand.client.kmd

    // Verify the connection by listing available wallets
    const wallets = await kmd.listWallets()
    console.log('  ✓ Successfully connected to LocalNet KMD client')
    console.log(`    - Server: http://localhost:4002`)
    console.log(`    - Found ${wallets.wallets.length} wallet(s):`)
    wallets.wallets.forEach((wallet) => {
      console.log(`      • ${wallet.name} (ID: ${wallet.id})`)
    })
    console.log()

    console.log('=== Summary ===')
    console.log('✅ All LocalNet clients connected successfully!')
    console.log()
    console.log('You can now use these clients for:')
    console.log('  • algod: Submit transactions, query blockchain state')
    console.log('  • indexer: Search and query historical blockchain data')
    console.log('  • kmd: Manage wallets and sign transactions')
    console.log()
    console.log('=== Key Takeaways ===')
    console.log('• Use AlgorandClient.defaultLocalNet() to connect to LocalNet')
    console.log('• Access clients via algorand.client.algod, .indexer, and .kmd')
    console.log('• LocalNet must be running: algokit localnet start')
    console.log('• Default ports: algod (4001), indexer (8980), kmd (4002)')
  } catch (error) {
    console.error('\n❌ Error connecting to LocalNet clients:')
    console.error(error)
    console.error('\nMake sure LocalNet is running with: algokit localnet start')
    process.exit(1)
  }
}

main()
