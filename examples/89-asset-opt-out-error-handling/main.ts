import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates error handling for asset opt-out operations.
 * It shows two common error scenarios:
 * 1. Attempting to opt-out of assets that the account is not opted into
 * 2. Attempting to opt-out of assets with non-zero balances
 */

async function assetOptOutErrorHandling() {
  // Initialize AlgorandClient for localnet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the default test account (assumes LocalNet is running)
  const testAccount = await algorand.account.localNetDispenser()
  
  console.log('=== Asset Opt-Out Error Handling Example ===\n')

  // Scenario 1: Attempting to opt-out of assets not opted into
  console.log('--- Scenario 1: Opt-out of non-opted-in assets ---')
  
  // Create a test asset
  const assetCreate1 = await algorand.send.assetCreate({
    sender: testAccount.addr,
    total: 1000n,
    decimals: 0,
    assetName: 'Test Asset 1',
  })
  const asset1Id = BigInt(assetCreate1.confirmation.assetIndex!)
  console.log(`Created test asset with ID: ${asset1Id}`)
  
  // Create a second account
  const account1 = algorand.account.random()
  await algorand.account.ensureFunded(account1, testAccount, (1).algo())
  console.log(`Created account: ${account1.addr}\n`)
  
  // Opt the account into the first asset
  await algorand.asset.bulkOptIn(account1, [asset1Id], { validityWindow: 100 })
  
  const accountInfo1 = await algorand.account.getInformation(account1.addr)
  console.log(`Account opted into ${accountInfo1.totalAssetsOptedIn} asset(s)\n`)
  
  // Try to opt-out of assets the account is NOT opted into
  const invalidAssetIds = [asset1Id, 1234567n, 999999n]
  console.log(`Attempting to opt-out of assets: ${invalidAssetIds.join(', ')}`)
  
  try {
    await algorand.asset.bulkOptOut(account1, invalidAssetIds, { validityWindow: 100 })
    console.log('Opt-out succeeded (unexpected)')
  } catch (error) {
    console.log('✓ Expected error caught:')
    console.log(`  ${(error as Error).message}\n`)
  }
  
  const accountInfoAfter1 = await algorand.account.getInformation(account1.addr)
  console.log(`Account still opted into ${accountInfoAfter1.totalAssetsOptedIn} asset(s)\n`)

  // Scenario 2: Attempting to opt-out of assets with non-zero balance
  console.log('--- Scenario 2: Opt-out of asset with non-zero balance ---')
  
  // Create two test assets
  const assetCreate2 = await algorand.send.assetCreate({
    sender: testAccount.addr,
    total: 1000n,
    decimals: 0,
    assetName: 'Test Asset 2',
  })
  const asset2Id = BigInt(assetCreate2.confirmation.assetIndex!)
  
  const assetCreate3 = await algorand.send.assetCreate({
    sender: testAccount.addr,
    total: 1000n,
    decimals: 0,
    assetName: 'Test Asset 3',
  })
  const asset3Id = BigInt(assetCreate3.confirmation.assetIndex!)
  console.log(`Created test assets with IDs: ${asset2Id}, ${asset3Id}`)
  
  // Create another account
  const account2 = algorand.account.random()
  await algorand.account.ensureFunded(account2, testAccount, (1).algo())
  console.log(`Created account: ${account2.addr}\n`)
  
  // Opt the account into both assets
  await algorand.asset.bulkOptIn(account2, [asset2Id, asset3Id], { validityWindow: 100 })
  
  const accountInfo2 = await algorand.account.getInformation(account2.addr)
  console.log(`Account opted into ${accountInfo2.totalAssetsOptedIn} asset(s)\n`)
  
  // Transfer some of the first asset to the account (giving it a non-zero balance)
  await algorand.send.assetTransfer({
    sender: testAccount.addr,
    receiver: account2.addr,
    assetId: asset2Id,
    amount: 5n,
  })
  console.log(`Transferred 5 units of asset ${asset2Id} to account\n`)
  
  // Try to opt-out of both assets (should fail because one has non-zero balance)
  console.log(`Attempting to opt-out of assets: ${asset2Id}, ${asset3Id}`)
  
  try {
    await algorand.asset.bulkOptOut(account2, [asset2Id, asset3Id], { validityWindow: 100 })
    console.log('Opt-out succeeded (unexpected)')
  } catch (error) {
    console.log('✓ Expected error caught:')
    console.log(`  ${(error as Error).message}\n`)
  }
  
  const accountInfoAfter2 = await algorand.account.getInformation(account2.addr)
  console.log(`Account still opted into ${accountInfoAfter2.totalAssetsOptedIn} asset(s)`)
  console.log('(Both assets remain opted in due to validation failure)\n')
  
  console.log('=== Key Takeaways ===')
  console.log('1. You cannot opt-out of assets you have not opted into')
  console.log('2. You cannot opt-out of assets with non-zero balances')
  console.log('3. bulkOptOut validates all assets before processing')
  console.log('4. If any asset fails validation, the entire operation is rejected')
}

// Run the example
assetOptOutErrorHandling().catch(console.error)