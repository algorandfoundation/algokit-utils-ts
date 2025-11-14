import { AlgorandClient } from '@algorandfoundation/algokit-utils'

/**
 * This example demonstrates how to create an Algorand Standard Asset (ASA)
 * with all possible configuration options.
 *
 * Key concepts:
 * - Asset creation with metadata (name, unit name, URL, metadata hash)
 * - Role accounts for asset management:
 *   - Manager: Can reconfigure the asset's role accounts
 *   - Reserve: Account holding non-minted assets (informational)
 *   - Freeze: Can freeze/unfreeze asset holdings in accounts
 *   - Clawback: Can revoke assets from accounts
 * - Default frozen state: If true, accounts must be unfrozen before transfers
 * - Total supply and decimals configuration
 */

async function createAssetWithFullConfiguration() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.defaultLocalNet()

  // Get the dispenser account to create the asset
  const dispenser = await algorand.account.localNetDispenser()

  // Create a creator account
  const creator = algorand.account.random()
  await algorand.account.ensureFunded(creator, dispenser, (5).algos())

  console.log('Creator address:', creator.addr.toString())
  console.log()

  console.log('=== Creating Asset with Full Configuration ===')
  console.log()

  // Step 1: Generate accounts for each role
  // These accounts will have different management capabilities for the asset
  const managerAccount = algorand.account.random()
  const reserveAccount = algorand.account.random()
  const freezeAccount = algorand.account.random()
  const clawbackAccount = algorand.account.random()

  console.log('Role accounts:')
  console.log(`  Manager:  ${managerAccount.addr}`)
  console.log(`  Reserve:  ${reserveAccount.addr}`)
  console.log(`  Freeze:   ${freezeAccount.addr}`)
  console.log(`  Clawback: ${clawbackAccount.addr}`)
  console.log()

  // Step 2: Create metadata hash (32 bytes)
  // In production, this would typically be a hash of asset metadata stored off-chain
  const metadataHash = new Uint8Array(32).fill(1)

  console.log('Asset parameters:')
  console.log('  Total supply: 1,000,000 units')
  console.log('  Decimals: 2 (allows 0.01 units)')
  console.log('  Name: MyToken')
  console.log('  Unit Name: MTK')
  console.log('  URL: https://example.com/token')
  console.log('  Default Frozen: true (requires unfreezing before transfers)')
  console.log()

  // Step 3: Create the asset with full configuration
  const result = await algorand.send.assetCreate({
    sender: creator.addr,
    total: 1_000_000n, // Total supply of 1,000,000 units
    decimals: 2, // 2 decimal places (allows 0.01 units)
    assetName: 'MyToken', // Full asset name (up to 32 bytes)
    unitName: 'MTK', // Short ticker symbol (up to 8 bytes)
    url: 'https://example.com/token', // URL with more info about the asset
    metadataHash: metadataHash, // 32-byte hash of asset metadata
    manager: managerAccount.addr, // Can change role addresses
    reserve: reserveAccount.addr, // Holds non-minted assets (informational)
    freeze: freezeAccount.addr, // Can freeze/unfreeze holdings
    clawback: clawbackAccount.addr, // Can revoke assets from accounts
    defaultFrozen: true, // Accounts must be unfrozen before transfers
  })

  const assetId = BigInt(result.confirmation.assetIndex!)

  console.log('✅ Asset created successfully!')
  console.log('Asset ID:', assetId)
  console.log('Transaction ID:', result.txIds[0])
  console.log()

  // Step 4: Retrieve and display the asset information
  const assetInfo = await algorand.asset.getById(assetId)

  console.log('=== Asset Information ===')
  console.log()
  console.log('Basic Details:')
  console.log(`  Asset ID: ${assetInfo.assetId}`)
  console.log(`  Creator: ${assetInfo.creator}`)
  console.log(`  Total Supply: ${assetInfo.total.toLocaleString()}`)
  console.log(`  Decimals: ${assetInfo.decimals}`)
  console.log(`  Unit Name: ${assetInfo.unitName || 'N/A'}`)
  console.log(`  Asset Name: ${assetInfo.assetName || 'N/A'}`)
  console.log(`  URL: ${assetInfo.url || 'N/A'}`)
  console.log(`  Metadata Hash: ${assetInfo.metadataHash ? Buffer.from(assetInfo.metadataHash).toString('hex') : 'N/A'}`)
  console.log()

  console.log('Role Accounts:')
  console.log(`  Manager: ${assetInfo.manager || 'None (immutable)'}`)
  console.log(`  Reserve: ${assetInfo.reserve || 'None'}`)
  console.log(`  Freeze: ${assetInfo.freeze || 'None (cannot freeze)'}`)
  console.log(`  Clawback: ${assetInfo.clawback || 'None (cannot clawback)'}`)
  console.log()

  console.log('Asset Settings:')
  console.log(`  Default Frozen: ${assetInfo.defaultFrozen}`)
  console.log()

  console.log('✅ Example completed successfully!')
  console.log()

  console.log('💡 Role Account Capabilities:')
  console.log('  • Manager: Can reconfigure manager, reserve, freeze, and clawback addresses')
  console.log('  • Reserve: Purely informational, no special permissions')
  console.log('  • Freeze: Can freeze/unfreeze asset holdings in specific accounts')
  console.log('  • Clawback: Can revoke assets from any account and send to another')
  console.log('  • Default Frozen: New opt-ins start frozen and must be explicitly unfrozen')
}

// Run the example
createAssetWithFullConfiguration().catch(console.error)
