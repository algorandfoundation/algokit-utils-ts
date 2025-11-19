import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates asset opt-out validation.
 *
 * When opting out of an asset, you can use the ensureZeroBalance parameter
 * to prevent accidental loss of assets. If the account still holds any amount
 * of the asset, the opt-out will fail with a clear error message.
 */

async function assetOptOutValidationExample() {
  // Initialize AlgorandClient for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  console.log('=== Asset Opt-Out Validation Example ===')
  console.log()

  // Get dispenser account
  const dispenser = await algorand.account.localNetDispenser()

  // Create creator account
  const creator = algorand.account.random()
  await algorand.account.ensureFunded(creator, dispenser, (10).algos())

  // Create a second account to receive and hold the asset
  const secondAccount = algorand.account.random()
  console.log('Creating and funding second account...')
  await algorand.account.ensureFunded(secondAccount, dispenser, (1).algos())
  console.log(`Second account created: ${secondAccount.addr}`)
  console.log()

  // Create a test asset (fungible token with 0 decimals)
  console.log('Creating test asset...')
  const assetCreate = await algorand.send.assetCreate({
    sender: creator.addr,
    total: 1000n,
    decimals: 0,
    assetName: 'Test Token',
  })
  const assetId = BigInt(assetCreate.confirmation.assetIndex!)
  console.log(`Asset created with ID: ${assetId}`)
  console.log()

  // Second account opts into the asset
  console.log('Second account opting into asset...')
  await algorand.send.assetOptIn({
    sender: secondAccount.addr,
    assetId: assetId,
  })
  console.log(`Second account opted into asset ${assetId}`)
  console.log()

  // Transfer 5 units of the asset to the second account
  console.log('Transferring 5 units of asset to second account...')
  await algorand.send.assetTransfer({
    sender: creator.addr,
    receiver: secondAccount.addr,
    assetId: assetId,
    amount: 5n,
  })
  console.log(`Transferred 5 units of asset ${assetId} to second account`)
  console.log()

  // Verify the second account has the asset
  const accountInfo = await algorand.account.getInformation(secondAccount.addr)
  const assetHolding = accountInfo.assets?.find(a => BigInt(a.assetId) === assetId)
  console.log(`Second account asset balance: ${assetHolding?.amount || 0n}`)
  console.log(`Total assets opted in: ${accountInfo.totalAssetsOptedIn}`)
  console.log()

  // Attempt to opt-out with ensureZeroBalance=true (should fail)
  console.log('Attempting to opt-out with ensureZeroBalance=true...')
  try {
    await algorand.send.assetOptOut({
      sender: secondAccount.addr,
      creator: creator.addr,
      assetId: assetId,
      ensureZeroBalance: true, // This will prevent opt-out if balance > 0
    })
    console.log('ERROR: Opt-out should have failed but succeeded!')
  } catch (error) {
    console.log('✓ Error caught (expected):', (error as Error).message)
    console.log()
  }

  // Verify the account is still opted into the asset
  const accountInfoAfter = await algorand.account.getInformation(secondAccount.addr)
  console.log(`Account still opted into ${accountInfoAfter.totalAssetsOptedIn} asset(s)`)
  console.log('✓ Opt-out prevented successfully - assets are safe!')
  console.log()

  // To successfully opt-out, you would need to:
  // 1. Transfer the assets back to the creator or another holder
  // 2. Then call assetOptOut with ensureZeroBalance=true (or false)
  console.log('To opt-out successfully, you must first transfer all assets back:')
  console.log('1. Transfer assets: algorand.send.assetTransfer({ amount: 5n, ... })')
  console.log('2. Then opt-out: algorand.send.assetOptOut({ ensureZeroBalance: true })')
}

// Run the example
assetOptOutValidationExample().catch(console.error)
