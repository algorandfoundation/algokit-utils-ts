import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to configure an Algod client using environment variables.
 * This is the recommended approach for managing configuration across different environments
 * (development, staging, production).
 *
 * Prerequisites:
 * - Node.js and npm installed
 * - Environment variables set (ALGOD_SERVER, ALGOD_PORT, ALGOD_TOKEN)
 */

async function main() {
  console.log('=== Algod Client Configuration Example ===\n')

  // Example 1: Successfully getting algod config from environment variables
  console.log('1. Configuring Algod client with environment variables:')

  // Set the required environment variables
  // In a real application, these would be set in your environment or .env file
  process.env.ALGOD_SERVER = 'http://localhost'
  process.env.ALGOD_PORT = '4001'
  process.env.ALGOD_TOKEN = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'

  try {
    // Create an Algorand client from environment variables
    const algorand = AlgorandClient.fromEnvironment()

    console.log('  ✓ AlgorandClient created successfully from environment variables')

    // Get the algod client to verify configuration
    const algodClient = algorand.client.algod

    // Test the connection by getting node status
    const status = await algodClient.status().do()

    console.log('  ✓ Successfully connected to Algod node:')
    console.log(`    - Server: ${process.env.ALGOD_SERVER}:${process.env.ALGOD_PORT}`)
    console.log(`    - Token: ${process.env.ALGOD_TOKEN.substring(0, 10)}...`)
    console.log(`    - Last Round: ${status.lastRound}`)
    console.log()
  } catch (error) {
    console.error('  ✗ Failed to create client or connect:', error)
  }

  // Example 2: Using default LocalNet configuration
  console.log('2. Using default LocalNet configuration:')
  console.log('  If environment variables are not set, AlgorandClient.fromEnvironment()')
  console.log('  will use default LocalNet settings (http://localhost:4001)')
  console.log('  For production, always set explicit environment variables.')
  console.log()

  // Example 3: Custom configuration with AlgorandClient
  console.log('3. Creating Algod client with custom configuration:')

  try {
    // You can also create a custom algod client directly
    const customAlgodClient = new algosdk.Algodv2(
      process.env.ALGOD_TOKEN!,
      process.env.ALGOD_SERVER!,
      process.env.ALGOD_PORT!
    )

    // Create AlgorandClient from the custom algod client
    const algorand = AlgorandClient.fromClients({ algod: customAlgodClient })

    const status = await algorand.client.algod.status().do()

    console.log('  ✓ Custom Algod client created successfully:')
    console.log(`    - Last Round: ${status.lastRound}`)
    console.log()
  } catch (error) {
    console.error('  ✗ Failed to create custom client:', error)
  }

  console.log('=== Key Takeaways ===')
  console.log('• Set ALGOD_SERVER, ALGOD_PORT, and ALGOD_TOKEN environment variables')
  console.log('• Use AlgorandClient.fromEnvironment() to create client from env vars')
  console.log('• Always handle potential errors when configuration is missing')
  console.log('• This pattern works great for different deployment environments')
  console.log('• You can also create custom algod clients with algosdk.Algodv2')
}

main().catch(console.error)
