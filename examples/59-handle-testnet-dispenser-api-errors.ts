import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to handle errors when the TestNet dispenser API
 * fails to fund an account. This is important for building robust applications
 * that can gracefully handle external API failures.
 *
 * Key concepts:
 * - Error handling with try-catch blocks
 * - Identifying different types of dispenser errors
 * - Implementing retry logic and fallback strategies
 * - Graceful degradation when external services fail
 */

async function handleDispenserErrors() {
  console.log('=== Handle TestNet Dispenser API Errors ===')
  console.log()

  // Check for dispenser access token
  const accessToken = process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN
  if (!accessToken) {
    console.log('⚠️  Note: ALGOKIT_DISPENSER_ACCESS_TOKEN not set')
    console.log('   This example will demonstrate error handling without a valid token.')
    console.log()
  } else {
    console.log('✅ Access token found')
    console.log()
  }

  // Create an Algorand client connected to TestNet
  console.log('1. Connecting to TestNet...')
  const algorand = AlgorandClient.testNet()
  console.log('   Connected to TestNet')
  console.log()

  // Create a random account that we want to fund
  const accountToFund = algorand.account.random()

  console.log('2. Attempting to fund account...')
  console.log(`   Account address: ${accountToFund.addr}`)
  console.log('   Requested amount: 100 ALGO')
  console.log('   Minimum funding increment: 1 ALGO')
  console.log()

  try {
    // Create a dispenser client for funding accounts on TestNet
    // This will throw an error if ALGOKIT_DISPENSER_ACCESS_TOKEN is not set
    const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()


    // Attempt to fund the account using the dispenser API
    // This will request 100 ALGO with a minimum funding increment of 1 ALGO
    const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
      accountToFund.addr,
      dispenserClient,
      algo(100),
      {
        minFundingIncrement: algo(1),
      }
    )

    if (result) {
      console.log('✅ Account funded successfully!')
      console.log(`   Transaction ID: ${result.transactionId}`)
      console.log(`   Amount funded: ${result.amountFunded.algo} ALGO`)
    } else {
      console.log('✅ Account already has sufficient funds')
    }
  } catch (error) {
    // Handle any errors that occur during the funding process
    console.log('❌ Failed to fund account from TestNet dispenser')
    console.log()

    const errorMessage = (error as Error).message

    // Identify common error types and provide appropriate feedback
    if (errorMessage.includes('ALGOKIT_DISPENSER_ACCESS_TOKEN') || errorMessage.includes('authToken')) {
      console.log('Error Type: Missing Access Token')
      console.log('Cause: ALGOKIT_DISPENSER_ACCESS_TOKEN environment variable not set')
      console.log('Solution: Set a valid access token from the AlgoKit dispenser service')
    } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || errorMessage.includes('authentication')) {
      console.log('Error Type: Authentication Error')
      console.log('Cause: Invalid or missing ALGOKIT_DISPENSER_ACCESS_TOKEN')
      console.log('Solution: Set a valid access token from the AlgoKit dispenser service')
    } else if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      console.log('Error Type: Rate Limit Exceeded')
      console.log('Cause: Too many requests to the dispenser API')
      console.log('Solution: Wait before retrying, or register refunds to increase your limit')
    } else if (errorMessage.includes('network') || errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ETIMEDOUT')) {
      console.log('Error Type: Network Error')
      console.log('Cause: Cannot connect to the dispenser API')
      console.log('Solution: Check internet connection and TestNet availability')
    } else if (errorMessage.includes('503') || errorMessage.includes('unavailable')) {
      console.log('Error Type: Service Unavailable')
      console.log('Cause: Dispenser service is temporarily down')
      console.log('Solution: Retry later or use an alternative funding method')
    } else {
      console.log('Error Type: Unknown Error')
      console.log('Cause: Unexpected error occurred')
    }

    console.log()
    console.log('Error Details:')
    console.log(`  ${errorMessage}`)
    console.log()

    // In a real application, you might want to:
    console.log('📝 Recommended Error Handling Strategies:')
    console.log('   1. Retry with exponential backoff for transient errors')
    console.log('   2. Fall back to manual funding instructions for the user')
    console.log('   3. Check if account already has sufficient funds before failing')
    console.log('   4. Log errors to monitoring service for alerting')
    console.log('   5. Implement circuit breaker pattern for repeated failures')
    console.log('   6. Provide clear user feedback about what went wrong')
  }
}

// Run the example
handleDispenserErrors().catch(console.error)
