import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how AlgoKit Utils automatically retries requests
 * when encountering HTTP 429 (Too Many Requests) rate limit errors.
 *
 * The SDK includes built-in retry logic with exponential backoff, which makes
 * your application more resilient when dealing with API rate limits from
 * Algorand nodes.
 */

async function main() {
  console.log('Starting concurrent requests to demonstrate retry mechanism...')
  console.log()

  // Initialize AlgorandClient for TestNet
  // This provides access to algod and indexer clients with automatic retry logic
  const algorand = AlgorandClient.testNet()

  // Example 1: Algod client with automatic retries
  console.log('Making 150 concurrent algod requests...')

  // Get the algod client from AlgorandClient
  const algod = algorand.client.algod

  // Make many concurrent requests to potentially trigger rate limiting
  // The SDK will automatically retry any failed requests due to rate limits
  const testAccount = 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'

  try {
    const algodResponses = await Promise.all(
      new Array(150).fill(0).map(async () => {
        // Each request gets account information
        // If rate limited, the SDK will automatically retry
        return await algod.accountInformation(testAccount).do()
      })
    )

    console.log(`Successfully completed ${algodResponses.length} algod requests`)
    console.log(`Account balance: ${algodResponses[0].amount} microAlgos`)
  } catch (error) {
    console.error('Error with algod requests:', error)
  }

  console.log()

  // Example 2: Indexer client with automatic retries
  console.log('Making 150 concurrent indexer requests...')

  // Get the indexer client from AlgorandClient
  const indexer = algorand.client.indexer

  try {
    const indexerResponses = await Promise.all(
      new Array(150).fill(0).map(async () => {
        // Each request looks up account information via indexer
        // If rate limited, the SDK will automatically retry
        return await indexer.lookupAccountByID(testAccount).do()
      })
    )

    console.log(`Successfully completed ${indexerResponses.length} indexer requests`)
    console.log(`Account address: ${indexerResponses[0].account.address}`)
  } catch (error) {
    console.error('Error with indexer requests:', error)
  }

  console.log()
  console.log('Note: If rate limits are hit, the SDK automatically retries the requests')
  console.log('You may see warning messages in the logs indicating retries are occurring')
  console.log('All requests completed successfully!')
}

// Run the example
main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
