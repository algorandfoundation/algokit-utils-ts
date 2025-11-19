import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to use the TestNet Dispenser API client
 * to fund accounts, check limits, and register refunds.
 *
 * The dispenser helps developers get TestNet Algos for testing purposes.
 *
 * Key concepts:
 * - The dispenser client automatically loads ALGOKIT_DISPENSER_ACCESS_TOKEN from environment
 * - Check your funding limit before requesting funds
 * - Register refunds to return unused funds and stay within limits
 */

async function main() {
  console.log('=== Fund and Manage TestNet Accounts with Dispenser API ===')
  console.log()

  // Check for access token
  const accessToken = process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN
  if (!accessToken) {
    console.error('❌ Error: ALGOKIT_DISPENSER_ACCESS_TOKEN environment variable not set')
    console.log()
    console.log('To get an access token:')
    console.log('1. Visit the AlgoKit dispenser service')
    console.log('2. Register and obtain your access token')
    console.log('3. Set it as an environment variable: export ALGOKIT_DISPENSER_ACCESS_TOKEN=your_token')
    process.exit(1)
  }

  console.log('✅ Access token found')
  console.log()

  // Initialize AlgorandClient for TestNet
  console.log('1. Connecting to TestNet...')
  const algorand = AlgorandClient.testNet()
  console.log('   Connected to TestNet')
  console.log()

  // Initialize the dispenser client
  // The access token is automatically loaded from ALGOKIT_DISPENSER_ACCESS_TOKEN
  console.log('2. Initializing TestNet dispenser API client...')
  const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()
  console.log('   Dispenser API client ready')
  console.log()

  /**
   * Step 3: Check current funding limit
   *
   * Before requesting funds, check how much you're allowed to dispense.
   * This helps you stay within rate limits.
   */
  console.log('3. Checking current funding limit...')
  try {
    const limitResponse = await dispenserClient.getLimit()
    console.log(`   Current available limit: ${limitResponse.amount} microAlgos`)
    console.log(`   That's ${limitResponse.amount / 1_000_000} Algos`)
  } catch (error) {
    console.error('   Error checking limit:', error)
    console.log()
    console.log('📝 Note: Limit checking requires valid authentication')
    process.exit(1)
  }
  console.log()

  /**
   * Step 4: Fund an account with Algos
   *
   * This demonstrates direct funding using the dispenser API.
   * You can fund any TestNet address with the specified amount.
   */
  console.log('4. Funding an account...')

  // For this example, we'll create a test address to fund
  // In real usage, replace with your actual recipient address
  const recipientAddress = 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'
  const amountToFund = 5_000_000 // 5 Algos in microAlgos

  console.log(`   Recipient address: ${recipientAddress}`)
  console.log(`   Amount to fund: ${amountToFund / 1_000_000} Algos (${amountToFund} microAlgos)`)

  try {
    const fundResponse = await dispenserClient.fund(recipientAddress, amountToFund)
    console.log(`   ✅ Successfully funded account!`)
    console.log(`   Transaction ID: ${fundResponse.txId}`)
    console.log(`   Amount sent: ${fundResponse.amount} microAlgos`)
  } catch (error) {
    console.error('   Error funding account:', error)
    console.log()
    console.log('📝 Note: Funding may fail if:')
    console.log('   • You have exceeded your rate limit')
    console.log('   • The recipient address is invalid')
    console.log('   • The dispenser service is temporarily unavailable')
  }
  console.log()

  /**
   * Step 5: Register a refund to return unused funds
   *
   * When you're done testing and have unused funds, you can register
   * a refund to return them to the dispenser. This helps you stay within
   * rate limits and makes funds available for other developers.
   *
   * To register a refund:
   * 1. Send a payment transaction from your funded account back to the dispenser
   * 2. Get the transaction ID of that payment
   * 3. Register the refund with that transaction ID
   */
  console.log('5. About refund registration...')
  console.log('   Refunds help you stay within rate limits by returning unused funds.')
  console.log()
  console.log('   To register a refund:')
  console.log('   1. Send payment from your funded account back to the dispenser address')
  console.log('   2. Get the transaction ID of that payment')
  console.log('   3. Call dispenserClient.refund(transactionId)')
  console.log()
  console.log('   Example (commented out - requires actual refund transaction):')
  console.log('   /*')
  console.log('   const refundTxId = "YOUR_REFUND_TRANSACTION_ID"')
  console.log('   await dispenserClient.refund(refundTxId)')
  console.log('   console.log(`Refund registered: ${refundTxId}`)')
  console.log('   */')
  console.log()

  console.log('✅ Example complete!')
  console.log()
  console.log('📝 Key Takeaways:')
  console.log('   • algorand.client.getTestNetDispenserFromEnvironment() creates dispenser client')
  console.log('   • getLimit() checks your current funding allowance')
  console.log('   • fund(address, amount) directly funds TestNet accounts')
  console.log('   • refund(txId) registers refunds to return unused funds')
  console.log('   • Always check limits before funding to avoid rate limit errors')
  console.log('   • Register refunds when done testing to help the community')
}

main().catch(console.error)
