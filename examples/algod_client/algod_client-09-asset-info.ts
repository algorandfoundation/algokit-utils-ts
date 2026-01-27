/**
 * Example: Asset Information
 *
 * This example demonstrates how to retrieve asset information using
 * the AlgodClient method: assetById()
 *
 * Prerequisites:
 * - LocalNet running (via `algokit localnet start`)
 */

import {
  createAlgodClient,
  createAlgorandClient,
  getFundedAccount,
  printError,
  printHeader,
  printInfo,
  printStep,
  printSuccess,
  shortenAddress,
} from './shared/utils.js'

/**
 * @example
 * ### Run the example
 * ```bash
 * npx tsx examples/algod_client/algod_client-09-asset-info.ts
 * ```
 *
 * {@includeCode ./algod_client-09-asset-info.ts}
 */
async function main() {
  printHeader('Asset Information Example')

  // Create an Algod client connected to LocalNet
  const algod = createAlgodClient()

  // Create an AlgorandClient for asset creation
  const algorand = createAlgorandClient()

  // =========================================================================
  // Step 1: Get a Funded Account from LocalNet
  // =========================================================================
  printStep(1, 'Getting a funded account from LocalNet')

  let creator: Awaited<ReturnType<typeof getFundedAccount>>
  try {
    creator = await getFundedAccount(algorand)
    printSuccess(`Got funded account: ${shortenAddress(creator.addr.toString())}`)
  } catch (error) {
    printError(`Failed to get funded account: ${error instanceof Error ? error.message : String(error)}`)
    printInfo('Make sure LocalNet is running with `algokit localnet start`')
    printInfo('If issues persist, try `algokit localnet reset`')
    process.exit(1)
  }

  // =========================================================================
  // Step 2: Create a Test Asset using AlgorandClient
  // =========================================================================
  printStep(2, 'Creating a test asset using AlgorandClient')

  const assetTotal = 1_000_000_000_000n // 1 million units with 6 decimals
  const assetDecimals = 6
  const assetName = 'Test Asset'
  const assetUnitName = 'TEST'
  const assetUrl = 'https://example.com/test-asset'
  const metadataHash = new Uint8Array(32).fill(0xab) // 32-byte metadata hash

  try {
    printInfo(`Creating asset: ${assetName} (${assetUnitName})`)
    printInfo(`Total supply: ${assetTotal.toLocaleString('en-US')} base units`)
    printInfo(`Decimals: ${assetDecimals}`)

    const result = await algorand.send.assetCreate({
      sender: creator.addr,
      total: assetTotal,
      decimals: assetDecimals,
      assetName: assetName,
      unitName: assetUnitName,
      url: assetUrl,
      metadataHash: metadataHash,
      defaultFrozen: false,
      manager: creator.addr,
      reserve: creator.addr,
      freeze: creator.addr,
      clawback: creator.addr,
    })

    const assetId = result.assetId
    printSuccess(`Asset created with ID: ${assetId}`)
    printInfo('')

    // =========================================================================
    // Step 3: Get Asset Information using assetById()
    // =========================================================================
    printStep(3, 'Getting asset information with assetById()')

    const asset = await algod.assetById(assetId)

    printSuccess('Asset information retrieved successfully!')
    printInfo('')

    // =========================================================================
    // Step 4: Display Asset Params
    // =========================================================================
    printStep(4, 'Displaying asset parameters')

    printInfo('Asset Identification:')
    printInfo(`  Asset ID: ${asset.id}`)
    printInfo('')

    printInfo('Asset Parameters:')
    printInfo(`  Creator:    ${asset.params.creator}`)
    printInfo(`              ${shortenAddress(asset.params.creator)} (shortened)`)
    printInfo(`  Total:      ${asset.params.total.toLocaleString('en-US')} base units`)

    // Calculate human-readable total
    const humanReadableTotal = Number(asset.params.total) / Math.pow(10, asset.params.decimals)
    printInfo(`              ${humanReadableTotal.toLocaleString('en-US')} ${asset.params.unitName ?? 'units'}`)
    printInfo(`  Decimals:   ${asset.params.decimals}`)
    printInfo(`  Unit Name:  ${asset.params.unitName ?? '(not set)'}`)
    printInfo(`  Asset Name: ${asset.params.name ?? '(not set)'}`)
    printInfo(`  URL:        ${asset.params.url ?? '(not set)'}`)

    // Display metadata hash if present
    if (asset.params.metadataHash) {
      const hashHex = Buffer.from(asset.params.metadataHash).toString('hex')
      printInfo(`  Metadata Hash: ${hashHex.substring(0, 16)}...${hashHex.substring(hashHex.length - 16)} (${asset.params.metadataHash.length} bytes)`)
    } else {
      printInfo(`  Metadata Hash: (not set)`)
    }

    printInfo(`  Default Frozen: ${asset.params.defaultFrozen ?? false}`)
    printInfo('')

    // =========================================================================
    // Step 5: Display Asset Addresses (Manager, Reserve, Freeze, Clawback)
    // =========================================================================
    printStep(5, 'Displaying asset management addresses')

    printInfo('Asset Management Addresses:')
    printInfo(`  Manager:  ${asset.params.manager ?? '(immutable - not set)'}`)
    if (asset.params.manager) {
      printInfo(`            ${shortenAddress(asset.params.manager)} (shortened)`)
      printInfo('Manager can modify manager, reserve, freeze, and clawback addresses')
    }

    printInfo(`  Reserve:  ${asset.params.reserve ?? '(not set)'}`)
    if (asset.params.reserve) {
      printInfo(`            ${shortenAddress(asset.params.reserve)} (shortened)`)
      printInfo('Reserve holds non-minted/non-circulating units')
    }

    printInfo(`  Freeze:   ${asset.params.freeze ?? '(not set - freezing disabled)'}`)
    if (asset.params.freeze) {
      printInfo(`            ${shortenAddress(asset.params.freeze)} (shortened)`)
      printInfo('Freeze address can freeze/unfreeze asset holdings')
    }

    printInfo(`  Clawback: ${asset.params.clawback ?? '(not set - clawback disabled)'}`)
    if (asset.params.clawback) {
      printInfo(`            ${shortenAddress(asset.params.clawback)} (shortened)`)
      printInfo('Clawback address can revoke assets from any account')
    }
    printInfo('')

    // =========================================================================
    // Step 6: Note about Round Information
    // =========================================================================
    printStep(6, 'Note about data validity')

    printInfo('The assetById() method returns the current asset state.')
    printInfo('Unlike some other endpoints, it does not include a round field.')
    printInfo('To get the current round, use status() or other round-aware methods.')

    // Get current round for reference
    const status = await algod.status()
    printInfo(`  Current network round: ${status.lastRound.toLocaleString('en-US')}`)
    printInfo('')

    // =========================================================================
    // Step 7: Handle Asset Not Found
    // =========================================================================
    printStep(7, 'Demonstrating error handling for non-existent asset')

    const nonExistentAssetId = 999999999n
    try {
      printInfo(`Querying non-existent asset ID: ${nonExistentAssetId}`)
      await algod.assetById(nonExistentAssetId)
      printError('Expected an error but none was thrown')
    } catch (error) {
      printSuccess('Correctly caught error for non-existent asset')
      if (error instanceof Error) {
        printInfo(`  Error message: ${error.message}`)
      }
      printInfo('Always handle the case where an asset may not exist or has been destroyed')
    }
    printInfo('')

    // =========================================================================
    // Step 8: Create Asset with Minimal Parameters (for comparison)
    // =========================================================================
    printStep(8, 'Creating a minimal asset (no optional addresses)')

    const minimalResult = await algorand.send.assetCreate({
      sender: creator.addr,
      total: 1000n,
      decimals: 0,
      assetName: 'Minimal Asset',
      unitName: 'MIN',
      // Note: No manager, reserve, freeze, or clawback addresses set
    })

    const minimalAsset = await algod.assetById(minimalResult.assetId)

    printInfo('Minimal Asset Configuration:')
    printInfo(`  Asset ID: ${minimalAsset.id}`)
    printInfo(`  Creator:  ${shortenAddress(minimalAsset.params.creator)}`)
    printInfo(`  Total:    ${minimalAsset.params.total}`)
    printInfo(`  Manager:  ${minimalAsset.params.manager ?? '(not set - asset is immutable)'}`)
    printInfo(`  Reserve:  ${minimalAsset.params.reserve ?? '(not set)'}`)
    printInfo(`  Freeze:   ${minimalAsset.params.freeze ?? '(not set - freezing disabled)'}`)
    printInfo(`  Clawback: ${minimalAsset.params.clawback ?? '(not set - clawback disabled)'}`)
    printInfo('Without a manager address, asset parameters cannot be changed')
    printInfo('')
  } catch (error) {
    printError(`Failed to create or query asset: ${error instanceof Error ? error.message : String(error)}`)
    printInfo('If LocalNet errors occur, try `algokit localnet reset`')
    process.exit(1)
  }

  // =========================================================================
  // Summary
  // =========================================================================
  printHeader('Summary')
  printInfo('This example demonstrated:')
  printInfo('  1. Creating a test asset using AlgorandClient.send.assetCreate()')
  printInfo('  2. assetById(assetId) - Get complete asset information')
  printInfo('  3. Asset params: creator, total, decimals, unitName, name, url, metadataHash')
  printInfo('  4. Asset addresses: manager, reserve, freeze, clawback')
  printInfo('  5. Error handling for non-existent assets')
  printInfo('  6. Minimal asset creation (without optional addresses)')
  printInfo('')
  printInfo('Key Asset fields:')
  printInfo('  - id: Unique asset identifier (bigint)')
  printInfo('  - params.creator: Address that created the asset')
  printInfo('  - params.total: Total supply in base units (bigint)')
  printInfo('  - params.decimals: Number of decimal places (0-19)')
  printInfo('  - params.unitName: Short name for asset unit (e.g., "ALGO")')
  printInfo('  - params.name: Full asset name')
  printInfo('  - params.url: URL with more information')
  printInfo('  - params.metadataHash: 32-byte commitment to metadata')
  printInfo('  - params.defaultFrozen: Whether new holdings are frozen by default')
  printInfo('')
  printInfo('Management addresses (optional):')
  printInfo('  - manager: Can reconfigure or destroy the asset')
  printInfo('  - reserve: Holds non-circulating units')
  printInfo('  - freeze: Can freeze/unfreeze holdings')
  printInfo('  - clawback: Can revoke assets from any account')
  printInfo('')
  printInfo('Use cases:')
  printInfo('  - Verify asset parameters before opt-in')
  printInfo('  - Check management addresses for trust evaluation')
  printInfo('  - Display asset information in wallets/explorers')
  printInfo('  - Validate asset metadata for compliance')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

export { main as AlgodClientAssetInfoExample }