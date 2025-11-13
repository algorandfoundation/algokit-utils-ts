import { AlgorandClient, microAlgos, algos } from '@algorandfoundation/algokit-utils'

/**
 * Example: Automatically Fund New Accounts
 * 
 * This example demonstrates:
 * 1. Creating a new random account
 * 2. Using ensureFunded to automatically fund the account
 * 3. Understanding minimum balance requirements
 * 4. Retrieving and verifying account information
 * 
 * The ensureFunded method intelligently handles:
 * - Checking if an account exists
 * - Calculating required funding including minimum balance
 * - Only sending funds if needed
 */

async function ensureFundedExample() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get a dispenser account with funds (funding source)
  const dispenser = await algorand.account.dispenserFromEnvironment()
  console.log('Funding source (dispenser) ready')
  
  // Create a new random account (not yet funded)
  const newAccount = algorand.account.random()
  console.log(`\nNew account created: ${newAccount.addr}`)
  console.log('Account does not yet exist on the blockchain')
  
  // Use ensureFunded to automatically fund the account
  // This will:
  // 1. Check if the account exists
  // 2. Determine how much funding is needed
  // 3. Send the appropriate amount (including minimum balance)
  console.log('\nFunding new account...')
  const fundingResult = await algorand.account.ensureFunded(
    newAccount,           // Account to fund
    dispenser,            // Funding source
    microAlgos(1)         // Requested amount: 1 microAlgo
  )
  
  // Display funding details
  if (fundingResult) {
    console.log('\nFunding completed!')
    console.log(`Transaction ID: ${fundingResult.txIds[0]}`)
    console.log(`Amount funded: ${fundingResult.amountFunded.microAlgos} microAlgos`)
    console.log(`\nNote: Amount funded includes minimum balance requirement (100,000 microAlgos)`)
  }
  
  // Retrieve and display account information
  const accountInfo = await algorand.account.getInformation(newAccount.addr)
  console.log('\nAccount information:')
  console.log(`  Address: ${accountInfo.address}`)
  console.log(`  Balance: ${accountInfo.balance.microAlgos} microAlgos`)
  console.log(`  Balance: ${accountInfo.balance.algos} ALGO`)
  console.log(`  Minimum balance: ${accountInfo.minBalance.microAlgos} microAlgos`)
  
  // Verify the funding was successful
  const expectedAmount = 100_001n // 1 microAlgo + 100,000 minimum balance
  if (accountInfo.balance.microAlgos === expectedAmount) {
    console.log('\n✅ Account funded successfully!')
    console.log(`   - Requested: 1 microAlgo`)
    console.log(`   - Minimum balance: 100,000 microAlgos`)
    console.log(`   - Total funded: ${expectedAmount} microAlgos`)
  }
  
  // Try funding again - ensureFunded will detect account already has sufficient funds
  console.log('\nAttempting to fund again with same amount...')
  const secondFundingResult = await algorand.account.ensureFunded(
    newAccount,
    dispenser,
    microAlgos(1)
  )
  
  if (!secondFundingResult) {
    console.log('✅ No additional funding needed - account already has sufficient balance')
  }
  
  // Example: Fund with a larger amount
  console.log('\nFunding account with additional 1 ALGO...')
  const additionalFunding = await algorand.account.ensureFunded(
    newAccount,
    dispenser,
    algos(1.1) // Request 1.1 ALGO total
  )

  if (additionalFunding) {
    console.log(`Additional funding sent: ${additionalFunding.amountFunded.algos} ALGO`)
    const updatedInfo = await algorand.account.getInformation(newAccount.addr)
    console.log(`New balance: ${updatedInfo.balance.algos} ALGO`)
  }
}

// Run the example
ensureFundedExample().catch(console.error)