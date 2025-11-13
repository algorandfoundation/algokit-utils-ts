import { AlgorandClient, algos } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to opt an account into an asset.
 * On Algorand, accounts must opt-in to assets before they can hold them.
 */
async function optInToAsset() {
  // Initialize Algorand client for local development
  const algorand = AlgorandClient.defaultLocalNet()

  // Get default accounts from LocalNet
  const dispenser = await algorand.account.dispenserFromEnvironment()
  const creator = await algorand.account.fromEnvironment('DISPENSER')

  // Create a new account that will opt into the asset
  const account = algorand.account.random()
  
  // Fund the new account (minimum balance required for transactions)
  await algorand.send.payment({
    sender: dispenser,
    receiver: account.addr,
    amount: algos(1),
  })

  // Step 1: Create a test asset
  console.log('Creating test asset...')
  const assetCreate = await algorand.send.assetCreate({
    sender: creator,
    total: 1000n,
    decimals: 0,
    assetName: 'Test Asset',
  })
  const assetId = BigInt(assetCreate.confirmation.assetIndex!)
  console.log(`Asset created with ID: ${assetId}`)

  // Step 2: Check account info before opt-in
  const accountInfoBefore = await algorand.account.getInformation(account.addr)
  console.log(`Account assets opted in before: ${accountInfoBefore.totalAssetsOptedIn}`)

  // Step 3: Opt the account into the asset
  console.log(`\nOpting account into asset ${assetId}...`)
  await algorand.asset.bulkOptIn(account, [assetId], { validityWindow: 100 })
  console.log(`Successfully opted into asset ${assetId}`)

  // Step 4: Verify the opt-in was successful
  const accountInfoAfter = await algorand.account.getInformation(account.addr)
  console.log(`Account assets opted in after: ${accountInfoAfter.totalAssetsOptedIn}`)

  if (accountInfoAfter.totalAssetsOptedIn === 1) {
    console.log('\n✅ Asset opt-in successful!')
  } else {
    console.log('\n❌ Asset opt-in failed')
  }
}

// Run the example
optInToAsset().catch(console.error)
