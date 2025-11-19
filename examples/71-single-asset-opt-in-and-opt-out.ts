import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates the basic flow of opting into and out of a single asset.
 *
 * Asset opt-in is required before an account can receive or hold an asset.
 * Asset opt-out allows an account to remove an asset from its holdings (only with zero balance).
 */

async function singleAssetOptInOptOut() {
  // Initialize AlgorandClient for localnet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the default test account (assumes LocalNet is running)
  const testAccount = await algorand.account.localNetDispenser()

  console.log('=== Single Asset Opt-In and Opt-Out Example ===\n')

  // Step 1: Create a test asset
  console.log('Step 1: Creating a test asset...')
  const assetCreate = await algorand.send.assetCreate({
    sender: testAccount.addr,
    total: 1000n,
    decimals: 0,
    assetName: 'Demo Asset',
    unitName: 'DEMO',
  })

  const assetId = BigInt(assetCreate.confirmation.assetIndex!)
  console.log(`✓ Created asset with ID: ${assetId}\n`)

  // Step 2: Create a second account that will opt-in to the asset
  console.log('Step 2: Creating a second account...')
  const secondAccount = await algorand.account.random()

  // Fund the account with 1 ALGO (needed for minimum balance and transaction fees)
  await algorand.send.payment({
    sender: testAccount.addr,
    receiver: secondAccount.addr,
    amount: algo(1),
  })
  console.log(`✓ Created and funded account: ${secondAccount.addr.toString()}\n`)

  // Step 3: Check account info before opt-in
  console.log('Step 3: Checking account info before opt-in...')
  const accountInfoBefore = await algorand.account.getInformation(secondAccount.addr)
  const assetsBefore = accountInfoBefore.assets?.length || 0
  console.log(`Assets opted in: ${assetsBefore}\n`)

  // Step 4: Opt-in to the asset
  console.log('Step 4: Opting into the asset...')
  await algorand.send.assetOptIn({
    sender: secondAccount.addr,
    assetId: assetId,
  })
  console.log(`✓ Successfully opted into asset ${assetId}\n`)

  // Step 5: Verify the opt-in
  console.log('Step 5: Verifying opt-in...')
  const accountInfoAfterOptIn = await algorand.account.getInformation(secondAccount.addr)
  const assetsAfterOptIn = accountInfoAfterOptIn.assets?.length || 0
  console.log(`Assets opted in: ${assetsAfterOptIn}`)
  console.log('✓ Opt-in confirmed\n')

  // Step 6: Opt-out of the asset (only works with zero balance)
  console.log('Step 6: Opting out of the asset...')
  await algorand.send.assetOptOut({
    sender: secondAccount.addr,
    assetId: assetId,
    creator: testAccount.addr,
    ensureZeroBalance: true,
  })
  console.log(`✓ Successfully opted out of asset ${assetId}\n`)

  // Step 7: Verify the opt-out
  console.log('Step 7: Verifying opt-out...')
  const accountInfoAfterOptOut = await algorand.account.getInformation(secondAccount.addr)
  const assetsAfterOptOut = accountInfoAfterOptOut.assets?.length || 0
  console.log(`Assets opted in: ${assetsAfterOptOut}`)
  console.log('✓ Opt-out confirmed\n')

  console.log('=== Summary ===')
  console.log('• Asset opt-in allows an account to hold and receive an asset')
  console.log('• Asset opt-out removes the asset from the account (requires zero balance)')
  console.log('• Each opted-in asset increases the minimum balance requirement by 0.1 ALGO')
  console.log('• Opt-out is only possible when the asset balance is zero')
}

// Run the example
singleAssetOptInOptOut()
  .then(() => {
    console.log('\n✅ Example completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
