import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { microAlgos } from '@algorandfoundation/algokit-utils'

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

async function main() {
  // Initialize the Algorand client for LocalNet
  const algorand = AlgorandClient.fromEnvironment()

  // Get a funded test account to create the asset
  const creator = algorand.account.localNet().dispenser

  console.log('Creating asset with full configuration...\n')

  // Step 1: Generate accounts for each role
  // These accounts will have different management capabilities for the asset
  const managerAccount = algorand.account.random()
  const reserveAccount = algorand.account.random()
  const freezeAccount = algorand.account.random()
  const clawbackAccount = algorand.account.random()

  console.log('Role accounts:')
  console.log(`- Manager: ${managerAccount.addr}`)
  console.log(`- Reserve: ${reserveAccount.addr}`)
  console.log(`- Freeze: ${freezeAccount.addr}`)
  console.log(`- Clawback: ${clawbackAccount.addr}\n`)

  // Step 2: Create metadata hash (32 bytes)
  // In production, this would typically be a hash of asset metadata stored off-chain
  const metadataHash = new Uint8Array(32).fill(1)

  // Step 3: Create the asset with full configuration
  const result = await algorand.send.assetCreate({
    sender: creator,
    total: 1000n, // Total supply of 1000 units
    decimals: 0, // No decimal places (whole units only)
    assetName: 'Test Asset', // Full asset name (up to 32 bytes)
    unitName: 'TEST', // Short ticker symbol (up to 8 bytes)
    url: 'https://example.com', // URL with more info about the asset
    metadataHash: metadataHash, // 32-byte hash of asset metadata
    manager: managerAccount, // Can change role addresses
    reserve: reserveAccount, // Holds non-minted assets (informational)
    freeze: freezeAccount, // Can freeze/unfreeze holdings
    clawback: clawbackAccount, // Can revoke assets from accounts
    defaultFrozen: true, // Accounts must be unfrozen before transfers
  })

  console.log('Asset created successfully!')
  console.log(`Asset ID: ${result.assetId}\n`)

  // Step 4: Retrieve and display the asset information
  const assetData = await algorand.asset.getById(result.assetId)

  console.log('Asset Details:')
  console.log(`- Creator: ${assetData.creator}`)
  console.log(`- Total supply: ${assetData.total}`)
  console.log(`- Decimals: ${assetData.decimals}`)
  console.log(`- Unit name: ${assetData.unitName}`)
  console.log(`- Asset name: ${assetData.assetName}`)
  console.log(`- URL: ${assetData.url}`)
  console.log(`- Metadata hash: ${Buffer.from(assetData.metadataHash || []).toString('hex')}`)
  console.log(`- Manager: ${assetData.manager}`)
  console.log(`- Reserve: ${assetData.reserve}`)
  console.log(`- Freeze: ${assetData.freeze}`)
  console.log(`- Clawback: ${assetData.clawback}`)
  console.log(`- Default frozen: ${assetData.defaultFrozen}\n`)

  console.log('✓ Asset created with all configuration options!')
  console.log('\nRole account capabilities:')
  console.log('- Manager can update the manager, reserve, freeze, and clawback addresses')
  console.log('- Reserve address is purely informational (no special permissions)')
  console.log('- Freeze can freeze/unfreeze asset holdings in specific accounts')
  console.log('- Clawback can revoke assets from accounts and send to another account')
  console.log('- Default frozen means new opt-ins start frozen until explicitly unfrozen')
}

main().catch(console.error)
