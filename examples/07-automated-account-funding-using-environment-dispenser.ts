import { AlgorandClient, algos, microAlgos } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to use the dispenser pattern for automated
 * account funding in development and testing environments.
 *
 * The dispenser account is configured through environment variables,
 * making it easy to fund accounts without manually specifying the funding source.
 */

async function main() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  console.log('=== Automated Account Funding with Dispenser ====')

  /**
   * Get the dispenser account from environment
   *
   * By default in LocalNet, this uses the default dispenser account
   * configured in the environment (typically the default LocalNet account)
   */
  console.log('\n1. Getting dispenser account from environment...')
  const dispenser = await algorand.account.dispenserFromEnvironment()
  console.log(`Dispenser address: ${dispenser.addr}`)

  /**
   * Create a new random account to fund
   */
  console.log('\n2. Creating a new random account...')
  const newAccount = algorand.account.random()
  console.log(`New account address: ${newAccount.addr}`)

  /**
   * Fund the account using ensureFundedFromEnvironment
   *
   * This method automatically uses the dispenser account from the environment,
   * so you don't need to explicitly specify the funding source.
   *
   * Parameters:
   * - Account to fund
   * - Minimum balance required (1 microAlgo)
   * - Options: minFundingIncrement set to 1 ALGO
   */
  console.log('\n3. Funding account using environment dispenser...')
  console.log('   Minimum balance: 1 microAlgo')
  console.log('   Minimum funding increment: 1 ALGO')

  const result = await algorand.account.ensureFundedFromEnvironment(
    newAccount.addr,
    microAlgos(1),
    {
      minFundingIncrement: algos(1),
    }
  )

  if (result) {
    console.log('\n✅ Funding successful!')
    console.log(`   Transaction ID: ${result.txIds[0]}`)
    console.log(`   Amount funded: ${result.amountFunded.algos} ALGO`)
  }

  /**
   * Check the final balance of the newly funded account
   */
  console.log('\n4. Verifying account balance...')
  const accountInfo = await algorand.account.getInformation(newAccount.addr)
  console.log(`   Final balance: ${accountInfo.balance.algos} ALGO (${accountInfo.balance.microAlgos} microAlgos)`)

  console.log('\n📝 Key Takeaways:')
  console.log('   • ensureFundedFromEnvironment automatically uses the configured dispenser')
  console.log('   • No need to manually manage funding source accounts')
  console.log('   • Perfect for automated testing and development workflows')
  console.log('   • Works seamlessly with LocalNet, TestNet, and custom configurations')
}

main().catch(console.error)
