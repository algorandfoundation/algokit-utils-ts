import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates bulk asset operations.
 *
 * Bulk opt-in and opt-out operations allow you to efficiently manage
 * multiple asset holdings at once. This is useful for:
 * - Setting up accounts to receive multiple tokens
 * - Cleaning up account state to reclaim minimum balance
 * - Managing portfolios of assets
 *
 * Each asset holding requires 0.1 ALGO minimum balance, so bulk opt-out
 * can reclaim significant funds when cleaning up many assets.
 */

async function bulkAssetOperationsExample() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  console.log('=== Bulk Asset Opt-In and Opt-Out Example ===')
  console.log()

  // Get the dispenser account for funding
  const dispenser = await algorand.account.localNetDispenser()

  // Create an account that will opt-in to multiple assets
  const assetHolder = algorand.account.random()
  console.log('Creating and funding asset holder account...')
  // Fund with 3 ALGO to cover minimum balance for 20 assets + transaction fees
  // Each asset requires 0.1 ALGO minimum balance
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: assetHolder.addr,
    amount: (3).algos(),
  })
  console.log(`Asset holder account created: ${assetHolder.addr}`)
  console.log()

  // Create 20 test assets
  console.log('Creating 20 test assets...')
  const assetIds: bigint[] = []

  for (let i = 1; i <= 20; i++) {
    const assetCreate = await algorand.send.assetCreate({
      sender: dispenser.addr,
      total: 1000n,
      decimals: 0,
      assetName: `Test Token ${i}`,
      unitName: `TT${i}`,
    })
    const assetId = BigInt(assetCreate.confirmation.assetIndex!)
    assetIds.push(assetId)
    console.log(`Created asset ${i} with ID: ${assetId}`)
  }
  console.log()
  console.log(`Total assets created: ${assetIds.length}`)
  console.log()

  // Perform bulk opt-in
  console.log('Performing bulk opt-in for 20 assets...')
  console.log('(This automatically batches transactions into groups as needed)')
  await algorand.asset.bulkOptIn(assetHolder, assetIds, { validityWindow: 100 })
  console.log('✓ Bulk opt-in completed successfully!')
  console.log()

  // Check account info after opt-in
  const accountInfoAfterOptIn = await algorand.account.getInformation(assetHolder.addr)
  console.log('Account info after bulk opt-in:')
  console.log(`  Address: ${accountInfoAfterOptIn.address}`)
  console.log(`  Balance: ${accountInfoAfterOptIn.balance.algos} ALGO`)
  console.log(`  Total assets opted in: ${accountInfoAfterOptIn.totalAssetsOptedIn}`)
  console.log(`  Min balance: ${accountInfoAfterOptIn.minBalance.algos} ALGO`)
  console.log()

  // Perform bulk opt-out
  console.log('Performing bulk opt-out for 20 assets...')
  console.log('(This will reclaim the minimum balance held by asset holdings)')
  await algorand.asset.bulkOptOut(assetHolder, assetIds, { validityWindow: 100 })
  console.log('✓ Bulk opt-out completed successfully!')
  console.log()

  // Check account info after opt-out
  const accountInfoAfterOptOut = await algorand.account.getInformation(assetHolder.addr)
  console.log('Account info after bulk opt-out:')
  console.log(`  Address: ${accountInfoAfterOptOut.address}`)
  console.log(`  Balance: ${accountInfoAfterOptOut.balance.algos} ALGO`)
  console.log(`  Total assets opted in: ${accountInfoAfterOptOut.totalAssetsOptedIn}`)
  console.log(`  Min balance: ${accountInfoAfterOptOut.minBalance.algos} ALGO`)
  console.log()

  // Calculate reclaimed balance
  const balanceChange = accountInfoAfterOptOut.balance.microAlgo - accountInfoAfterOptIn.balance.microAlgo
  console.log(`Balance change: +${Number(balanceChange) / 1_000_000} ALGO (reclaimed minimum balance minus fees)`)
  console.log('✓ Successfully cleaned up all asset holdings!')
}

// Run the example
bulkAssetOperationsExample().catch(console.error)