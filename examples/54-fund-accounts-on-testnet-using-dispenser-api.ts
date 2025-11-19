import { algo, AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to use the TestNet dispenser API
 * to automatically fund accounts on TestNet.
 *
 * The TestNet dispenser API provides a convenient way to get TestNet ALGO
 * without manually requesting funds or managing dispenser accounts.
 *
 * Prerequisites:
 * - ALGOKIT_DISPENSER_ACCESS_TOKEN environment variable set
 * - You can get an access token from the AlgoKit dispenser service
 */

async function main() {
  console.log('=== TestNet Dispenser API Funding ====')

  /**
   * Check for access token
   *
   * The ALGOKIT_DISPENSER_ACCESS_TOKEN environment variable is required
   * to authenticate with the TestNet dispenser API.
   */
  const accessToken = process.env.ALGOKIT_DISPENSER_ACCESS_TOKEN
  if (!accessToken) {
    console.error('❌ Error: ALGOKIT_DISPENSER_ACCESS_TOKEN environment variable not set')
    console.log('\nTo get an access token:')
    console.log('1. Visit the AlgoKit dispenser service')
    console.log('2. Register and obtain your access token')
    console.log('3. Set it as an environment variable: export ALGOKIT_DISPENSER_ACCESS_TOKEN=your_token')
    process.exit(1)
  }

  console.log('✅ Access token found')

  /**
   * Initialize AlgorandClient for TestNet
   */
  console.log('\n1. Connecting to TestNet...')
  const algorand = AlgorandClient.testNet()
  console.log('   Connected to TestNet')

  /**
   * Create a dispenser API client
   *
   * This client handles communication with the TestNet dispenser API.
   * The access token is automatically loaded from ALGOKIT_DISPENSER_ACCESS_TOKEN.
   */
  console.log('\n2. Initializing TestNet dispenser API client...')
  const dispenserClient = algorand.client.getTestNetDispenserFromEnvironment()
  console.log('   Dispenser API client ready')

  /**
   * Create a random account to fund
   */
  console.log('\n3. Creating a new account to fund...')
  const accountToFund = algorand.account.random()
  console.log(`   Account address: ${accountToFund.addr}`)

  /**
   * Fund the account using the TestNet dispenser API
   *
   * Parameters:
   * - Account to fund
   * - Dispenser API client
   * - Minimum balance (100 ALGO)
   * - Options: minFundingIncrement (0.1 ALGO minimum per transaction)
   */
  console.log('\n4. Requesting funds from TestNet dispenser API...')
  console.log('   Requested minimum: 100 ALGO')
  console.log('   Minimum funding increment: 0.1 ALGO')

  try {
    const result = await algorand.account.ensureFundedFromTestNetDispenserApi(
      accountToFund.addr,
      dispenserClient,
      algo(100),
      {
        minFundingIncrement: algo(0.1),
      }
    )

    if (result) {
      console.log('\n✅ Funding successful!')
      console.log(`   Transaction ID: ${result.transactionId}`)
      console.log(`   Amount funded: ${result.amountFunded.algo} ALGO (${result.amountFunded.microAlgo} microAlgos)`)
    } else {
      console.log('\n✅ Account already has sufficient funds')
    }

    /**
     * Verify the account balance on TestNet
     */
    console.log('\n5. Verifying account balance on TestNet...')
    const accountInfo = await algorand.account.getInformation(accountToFund.addr)
    console.log(`   Balance: ${accountInfo.balance.algo} ALGO`)

    console.log('\n📝 Key Takeaways:')
    console.log('   • TestNet dispenser API provides automated funding for TestNet development')
    console.log('   • Access token authentication ensures secure and rate-limited access')
    console.log('   • No need to manually request TestNet ALGO from faucets')
    console.log('   • Perfect for CI/CD pipelines and automated testing on TestNet')
    console.log('   • Respects minFundingIncrement to optimize funding amounts')

  } catch (error) {
    console.error('\n❌ Error funding account:', error)
    console.log('\nPossible issues:')
    console.log('   • Invalid access token')
    console.log('   • Rate limit exceeded')
    console.log('   • Network connectivity issues')
    console.log('   • Dispenser API temporarily unavailable')
  }
}

main().catch(console.error)
