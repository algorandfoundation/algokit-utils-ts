import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { AppManager } from '@algorandfoundation/algokit-utils/types/app-manager'

/**
 * This example demonstrates how to use foreign references (apps, accounts, assets)
 * when calling application methods. Foreign references allow your smart contract to:
 * - Read state from other applications
 * - Access account information beyond the sender
 * - Query asset parameters and holdings
 * - Perform cross-app interactions
 */

async function foreignReferencesExample() {
  // Initialize AlgoKit and get clients
  const algorand = AlgorandClient.defaultLocalNet()
  const algod = algorand.client.algod
  const indexer = algorand.client.indexer

  // Get a test account
  const testAccount = await algorand.account.localNetDispenser()
  console.log(`Test account address: ${testAccount.addr}`)

  // Deploy the application
  console.log('\nDeploying application...')
  const { client } = await deployYourApp(testAccount, algod, indexer)
  console.log('Application deployed successfully')

  // Define foreign references to pass to the application
  // These are resources external to the application that it needs to access
  const foreignAppId = 345      // ID of another application
  const foreignAssetId = 567     // ID of an asset (ASA)
  const foreignAccount = testAccount.addr  // An account address

  console.log('\nCalling ABI method with foreign references:')
  console.log(`  - Foreign App ID: ${foreignAppId}`)
  console.log(`  - Foreign Asset ID: ${foreignAssetId}`)
  console.log(`  - Foreign Account: ${foreignAccount}`)

  // Call the ABI method with foreign references
  // The apps, accounts, and assets arrays make these resources available to the contract
  const result = await client.call({
    method: 'call_abi_foreign_refs',
    methodArgs: [],
    apps: [foreignAppId],           // Foreign application references
    accounts: [foreignAccount],     // Foreign account references
    assets: [foreignAssetId],       // Foreign asset references
  })

  console.log('\n✅ Method call successful!')
  console.log(`Transaction ID: ${result.transactions[0].txID()}`)

  // Decode and display the ABI return value
  if (result.confirmations && result.confirmations[0]) {
    const abiMethod = client.getABIMethod('call_abi_foreign_refs')
    if (abiMethod) {
      const returnValue = AppManager.getABIReturn(
        result.confirmations[0],
        abiMethod
      )

      console.log('\nReturn value from contract:')
      console.log(`  ${returnValue?.returnValue}`)

      // The contract can now access these foreign references:
      // - Read from the foreign app's global/local state
      // - Get account balance, assets held, etc.
      // - Query asset parameters (total supply, decimals, etc.)
    }
  }

  console.log('\nForeign references explained:')
  console.log('  • apps[]: Allows reading state from other applications')
  console.log('  • accounts[]: Provides access to account information')
  console.log('  • assets[]: Enables querying asset parameters and holdings')
  console.log('\nThese references are essential for cross-app interactions and composability!')
}

// Helper function placeholder - replace with your actual app deployment
async function deployYourApp(account: any, algod: any, indexer: any) {
  // This is a placeholder - implement your actual app deployment logic
  // The app should have a method like:
  // call_abi_foreign_refs() -> string
  // that accesses the foreign references passed in the transaction
  throw new Error('Implement your app deployment logic here')
}

// Run the example
foreignReferencesExample().catch(console.error)