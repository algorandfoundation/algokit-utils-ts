import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to opt an account into multiple assets at once
 * using the bulk opt-in method. This is much more efficient than individual opt-ins.
 */
async function bulkOptInToAssets() {
  // Initialize Algorand client for local development
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser account for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create a new account that will opt into multiple assets
  const account = algorand.account.random()

  // Fund the account with enough ALGOs for multiple opt-ins
  // Each asset opt-in requires 0.1 ALGO minimum balance increase
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: account.addr,
    amount: (3).algos(),
  })

  // Step 1: Create 20 test assets
  console.log('Creating 20 test assets...')
  const assetIds: bigint[] = []

  for (let i = 0; i < 20; i++) {
    const assetCreate = await algorand.send.assetCreate({
      sender: dispenser.addr,
      total: 1000n,
      decimals: 0,
      assetName: `Test Asset ${i + 1}`,
    })
    const assetId = BigInt(assetCreate.confirmation.assetIndex!)
    assetIds.push(assetId)
    console.log(`Created asset ${i + 1} with ID: ${assetId}`)
  }

  // Step 2: Check account info before opt-in
  const accountInfoBefore = await algorand.account.getInformation(account.addr)
  console.log(`\nAccount assets opted in before: ${accountInfoBefore.totalAssetsOptedIn}`)

  // Step 3: Bulk opt-in to all 20 assets at once
  console.log(`\nOpting account into ${assetIds.length} assets...`)
  await algorand.asset.bulkOptIn(account, assetIds, { validityWindow: 100 })
  console.log(`Successfully opted into ${assetIds.length} assets`)

  // Step 4: Verify all opt-ins were successful
  const accountInfoAfter = await algorand.account.getInformation(account.addr)
  console.log(`Account total assets opted in: ${accountInfoAfter.totalAssetsOptedIn}`)

  if (accountInfoAfter.totalAssetsOptedIn === 20) {
    console.log('\n✅ Bulk asset opt-in successful!')
    console.log(`The account is now opted into all ${assetIds.length} assets and can receive them.`)
  } else {
    console.log('\n❌ Bulk asset opt-in incomplete')
  }
}

// Run the example
bulkOptInToAssets().catch(console.error)
