import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to connect to a local Algorand network (LocalNet)
 * for development and testing purposes.
 *
 * LocalNet is a local Algorand network that runs on your machine, typically using Docker.
 * It's perfect for development because it's fast, free, and you have complete control.
 *
 * Prerequisites:
 * - LocalNet must be running (use `algokit localnet start` to start it)
 */

async function main() {
  console.log('=== Connect to LocalNet for Development ===\n')

  console.log('1. Connecting to LocalNet...')

  // Step 1: Create an AlgorandClient connected to LocalNet
  // This automatically configures the client for local development
  const algorand = AlgorandClient.defaultLocalNet()

  console.log('  ✓ LocalNet client created successfully')
  console.log('    - Server: http://localhost:4001')
  console.log('    - Default configuration for local development')
  console.log()

  // Step 2: Access the algod client
  const algod = algorand.client.algod

  // Step 3: Verify the connection by checking the node status
  // This is a good way to ensure LocalNet is running and accessible
  try {
    console.log('2. Checking LocalNet status...')
    const status = await algod.status().do()

    console.log('  ✓ Successfully connected to LocalNet!')
    console.log()
    console.log('  LocalNet Status:')
    console.log(`    - Last Round: ${status.lastRound}`)
    console.log(`    - Last Consensus Version: ${status.lastVersion}`)
    console.log(`    - Next Consensus Version: ${status.nextVersion}`)
    console.log(`    - Next Version Round: ${status.nextVersionRound}`)
    console.log(`    - Next Version Supported: ${status.nextVersionSupported}`)
    console.log(`    - Time Since Last Round: ${status.timeSinceLastRound}ms`)
    console.log(`    - Catchup Time: ${status.catchupTime}ms`)
    console.log()

    // You can also get other useful information
    console.log('3. Getting network parameters...')
    const params = await algod.getTransactionParams().do()

    console.log('  ✓ Network parameters retrieved')
    console.log()
    console.log('  Network Parameters:')
    console.log(`    - Genesis ID: ${params.genesisID}`)
    console.log(`    - Genesis Hash: ${params.genesisHash}`)
    console.log(`    - Min Fee: ${params.minFee} microAlgos`)
    console.log()

    console.log('=== Summary ===')
    console.log('✅ LocalNet connection successful!')
    console.log()
    console.log('You can now use this client for:')
    console.log('  • Deploying and testing smart contracts')
    console.log('  • Creating and managing accounts')
    console.log('  • Submitting transactions')
    console.log('  • Testing application workflows')
    console.log()
    console.log('=== Key Takeaways ===')
    console.log('• Use AlgorandClient.defaultLocalNet() for local development')
    console.log('• LocalNet runs on http://localhost:4001')
    console.log('• Start LocalNet with: algokit localnet start')
    console.log('• LocalNet is perfect for fast, free development')
  } catch (error) {
    console.error('\n❌ Failed to connect to LocalNet:')
    console.error('Make sure LocalNet is running with: algokit localnet start')
    console.error('Error details:', error)
    process.exit(1)
  }
}

main().catch(console.error)
