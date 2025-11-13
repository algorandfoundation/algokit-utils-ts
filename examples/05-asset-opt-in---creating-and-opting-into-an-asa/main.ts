import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

/**
 * This example demonstrates how to create an Algorand Standard Asset (ASA)
 * and opt an account into holding that asset.
 * 
 * Asset opt-in is a required step before an account can receive or hold any ASA.
 * This is a security feature to prevent unwanted assets from being sent to accounts.
 */
async function assetOptInExample() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()
  
  // Get a funded account (in LocalNet, this gets a pre-funded test account)
  const alice = await algorand.account.fromEnvironment('ALICE')
  
  console.log('Creating a new Algorand Standard Asset (ASA)...')
  
  // Step 1: Create a new asset
  // The creator account (alice) automatically opts in during creation
  const assetCreateResult = await algorand.send.assetCreate({
    sender: alice,
    total: 1n, // Total supply of 1 unit
  })
  
  const assetId = assetCreateResult.assetId
  console.log(`✓ Asset created with ID: ${assetId}`)
  
  // Step 2: Opt the account into the asset
  // Note: In this example, alice is both the creator and the opt-in account
  // The creator is automatically opted in, but this demonstrates the explicit opt-in process
  console.log('\nOpting account into the asset...')
  
  await algorand.send.assetOptIn({
    sender: alice,
    assetId: assetId,
  })
  
  console.log(`✓ Account ${alice.addr} successfully opted into asset ${assetId}`)
  
  // Step 3: Verify the opt-in by checking account asset information
  const algod = algorand.client.algod
  const assetInfo = await algod.accountAssetInformation(alice.addr, Number(assetId)).do()

  console.log('\nAsset Information:')
  console.log(`  Asset ID: ${(assetInfo as any).assetHolding.assetId}`)
  console.log(`  Balance: ${(assetInfo as any).assetHolding.amount}`)
  console.log(`  Is Frozen: ${(assetInfo as any).assetHolding.isFrozen}`)
  
  console.log('\n✓ Asset opt-in completed successfully!')
}

// Run the example
assetOptInExample().catch(console.error)