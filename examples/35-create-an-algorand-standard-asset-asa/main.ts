import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to create an Algorand Standard Asset (ASA).
 *
 * It covers:
 * - Initializing the Algorand client for LocalNet
 * - Getting a funded account
 * - Creating an asset with a total supply
 * - Verifying the asset creation
 * - Understanding asset IDs
 */

async function createAsset() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get a funded account (in LocalNet, we can use a dispenser account)
  const alice = await algorand.account.fromEnvironment('ALICE')

  console.log('Creating a new Algorand Standard Asset...')
  console.log(`Creator account: ${alice.addr.toString()}`)

  // Create a new asset with a total supply of 100 units
  const createResult = await algorand.send.assetCreate({
    sender: alice.addr,  // sender must be an address string
    total: 100n, // Total supply of 100 units
  })

  // The assetId is automatically assigned by the blockchain
  console.log(`\n✅ Asset created successfully!`)
  console.log(`Asset ID: ${createResult.assetId.toString()}`)
  console.log(`Transaction ID: ${createResult.txIds[0]}`)
  console.log(`Confirmation Round: ${createResult.confirmations?.[0]?.confirmedRound}`)

  // Verify the asset was created (assetId should be greater than 0)
  if (createResult.assetId > 0n) {
    console.log(`\n✓ Verification passed: Asset ID ${createResult.assetId.toString()} is valid`)
  }

  return createResult.assetId
}

// Run the example
createAsset()
  .then((assetId) => {
    console.log(`\nExample completed successfully! Asset ID: ${assetId.toString()}`)
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error:', error.message)
    process.exit(1)
  })