import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { Account } from 'algosdk'

/**
 * This example demonstrates how to call an ABI method with explicit foreign references.
 * Foreign references allow your smart contract to interact with other apps, accounts, and assets.
 * 
 * Key concepts:
 * - appReferences: Array of app IDs that the contract will reference
 * - accountReferences: Array of accounts that the contract will access
 * - assetReferences: Array of asset IDs that the contract will use
 * - populateAppCallResources: When false, you must explicitly provide all references
 */

async function callAbiWithForeignReferences() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get or create a test account
  const testAccount = await algorand.account.fromEnvironment('TEST_ACCOUNT')
  
  console.log('Test account address:', testAccount.addr)
  
  // Get the app client for your deployed contract
  // Replace with your actual app ID and app spec
  const appId = 123n // Replace with your deployed app ID
  const client = algorand.client.getAppClientById({
    appId: appId,
    defaultSender: testAccount.addr,
    // Add your app spec here
  })
  
  console.log('\nCalling ABI method with foreign references...')
  
  // Define the foreign references
  const appReference = 345n // App ID to reference
  const assetReference = 567n // Asset ID to reference
  const accountReference = testAccount.addr // Account to reference
  
  try {
    // Call the ABI method with explicit foreign references
    const result = await client.send.call({
      method: 'call_abi_foreign_refs',
      // Explicitly specify foreign app references
      appReferences: [appReference],
      // Explicitly specify foreign account references
      accountReferences: [accountReference],
      // Explicitly specify foreign asset references
      assetReferences: [assetReference],
      // Disable automatic resource population - we're providing everything explicitly
      populateAppCallResources: false,
    })
    
    console.log('\n✅ Transaction successful!')
    console.log('Transaction ID:', result.transactions[0].txID())
    console.log('Return value:', result.return)
    console.log('\nThe contract successfully accessed:')
    console.log(`  - App ID: ${appReference}`)
    console.log(`  - Asset ID: ${assetReference}`)
    console.log(`  - Account: ${accountReference}`)
    
    // The return value shows how the contract used these references
    console.log('\nFull result:', JSON.stringify(result.return, null, 2))
    
  } catch (error) {
    console.error('\n❌ Error calling method with foreign references:')
    console.error(error)
    throw error
  }
}

// Run the example
callAbiWithForeignReferences()
  .then(() => {
    console.log('\n✨ Example completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Example failed:', error)
    process.exit(1)
  })