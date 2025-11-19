import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to opt out of assets to free up minimum balance.
 * Opt-out is only possible when the account has zero balance of the asset.
 * Each asset opt-in increases minimum balance requirement by 0.1 ALGO.
 */
async function optOutOfAssets() {
  // Initialize Algorand client for local development
  const algorand = AlgorandClient.defaultLocalNet()

  // Get dispenser account
  const dispenser = await algorand.account.localNetDispenser()

  // Create a new account for the asset creator
  const creator = algorand.account.random()
  await algorand.account.ensureFunded(creator, dispenser, (10).algos())

  // Create a new account that will opt in/out of assets
  const account = algorand.account.random()
  await algorand.account.ensureFunded(account, dispenser, (1).algos())

  // Step 1: Create two test assets (with 0 initial supply to ensure account has 0 balance)
  console.log('Creating test assets...')
  const assetCreate1 = await algorand.send.assetCreate({
    sender: creator.addr,
    total: 0n, // Zero total means no one will have any balance
    decimals: 0,
    assetName: 'Test Asset 1',
  })
  const assetId1 = BigInt(assetCreate1.confirmation.assetIndex!)

  const assetCreate2 = await algorand.send.assetCreate({
    sender: creator.addr,
    total: 0n,
    decimals: 0,
    assetName: 'Test Asset 2',
  })
  const assetId2 = BigInt(assetCreate2.confirmation.assetIndex!)

  const assetIds = [assetId1, assetId2]
  console.log(`Created assets with IDs: ${assetId1}, ${assetId2}`)

  // Step 2: Check account state before opt-in
  const accountInfoBefore = await algorand.account.getInformation(account.addr)
  console.log(`\nAccount assets opted in before: ${accountInfoBefore.totalAssetsOptedIn}`)

  // Step 3: Opt into both assets
  console.log(`\nOpting into ${assetIds.length} assets...`)
  await algorand.asset.bulkOptIn(account, assetIds, { validityWindow: 100 })

  const accountInfoAfterOptIn = await algorand.account.getInformation(account.addr)
  console.log(`Account assets opted in after opt-in: ${accountInfoAfterOptIn.totalAssetsOptedIn}`)

  // Step 4: Opt out of both assets (freeing up minimum balance)
  console.log(`\nOpting out of ${assetIds.length} assets...`)
  await algorand.asset.bulkOptOut(account, assetIds, { validityWindow: 100 })

  // Step 5: Verify opt-out was successful
  const accountInfoAfterOptOut = await algorand.account.getInformation(account.addr)
  console.log(`Account assets opted in after opt-out: ${accountInfoAfterOptOut.totalAssetsOptedIn}`)

  if (accountInfoAfterOptOut.totalAssetsOptedIn === 0) {
    console.log('\n✅ Successfully freed up minimum balance by opting out!')
    console.log(`The account no longer holds any asset opt-ins.`)
    console.log(`Each opt-out freed 0.1 ALGO from the minimum balance requirement.`)
  } else {
    console.log('\n❌ Opt-out incomplete')
  }
}

// Run the example
optOutOfAssets().catch(console.error)
