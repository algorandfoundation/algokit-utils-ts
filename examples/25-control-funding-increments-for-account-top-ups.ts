import { algo, AlgorandClient, microAlgo } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to use the minFundingIncrement option
 * when funding accounts to optimize for transaction fees.
 *
 * The minFundingIncrement ensures that when topping up an account,
 * at least a specified amount is added, avoiding many small transactions.
 */

async function main() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the default dispenser account (for funding)
  const dispenser = await algorand.account.dispenserFromEnvironment()

  // Create two accounts for demonstration
  console.log('Creating test accounts...')
  const fundingAccount = await algorand.account.fromEnvironment('DISPENSER')
  const targetAccount = await algorand.account.random()

  // Give the target account some initial funds (100,000 microAlgos = 0.1 ALGO)
  console.log('\nFunding target account with initial amount (0.1 ALGO)...')
  await algorand.send.payment({
    sender: fundingAccount.addr,
    receiver: targetAccount.addr,
    amount: microAlgo(100_000)
  })

  // Check initial balance
  let accountInfo = await algorand.account.getInformation(targetAccount.addr)
  console.log(`Initial balance: ${accountInfo.balance.microAlgos} microAlgos (${accountInfo.balance.algos} ALGO)`)

  /**
   * Now use ensureFunded with minFundingIncrement.
   *
   * We specify:
   * - minSpending: 1 microAlgo (the minimum balance we want)
   * - minFundingIncrement: 1 ALGO (the minimum amount to add if funding is needed)
   *
   * Since the account already has 100,000 microAlgos, it needs more funds.
   * Instead of adding just 1 microAlgo, it will add at least 1 ALGO (1,000,000 microAlgos)
   */
  console.log('\nEnsuring account has at least 1 microAlgo with 1 ALGO minimum increment...')
  const result = await algorand.account.ensureFunded(
    targetAccount.addr,
    fundingAccount.addr,
    microAlgo(1),
    {
      minFundingIncrement: algo(1),
    }
  )

  if (result) {
    console.log(`\n✅ Account funded!`)
    console.log(`Amount added: ${result.amountFunded.algos} ALGO (${result.amountFunded.microAlgos} microAlgos)`)
    console.log(`Transaction ID: ${result.transaction.txID()}`)
  } else {
    console.log('\nAccount already had sufficient funds, no transaction needed')
  }

  // Check final balance
  accountInfo = await algorand.account.getInformation(targetAccount.addr)
  console.log(`\nFinal balance: ${accountInfo.balance.microAlgos} microAlgos (${accountInfo.balance.algos} ALGO)`)

  console.log('\n📝 Key Takeaway:')
  console.log('Using minFundingIncrement helps optimize funding by ensuring meaningful amounts')
  console.log('are added each time, reducing the total number of funding transactions needed.')
}

main().catch(console.error)
