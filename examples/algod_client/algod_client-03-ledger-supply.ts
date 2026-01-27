/**
 * Example: Ledger Supply Information
 *
 * This example demonstrates how to retrieve ledger supply information using
 * the AlgodClient method: supply().
 *
 * Prerequisites:
 * - LocalNet running (via `algokit localnet start`)
 */

import { createAlgodClient, printError, printHeader, printInfo, printStep, printSuccess } from './shared/utils.js';

/**
 * Format microAlgos to both microAlgo and Algo representations
 */
function formatAmount(microAlgos: bigint): { microAlgo: string; algo: string } {
  const microAlgoStr = microAlgos.toLocaleString('en-US')
  const algoValue = Number(microAlgos) / 1_000_000
  const algoStr = algoValue.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })
  return {
    microAlgo: `${microAlgoStr} µALGO`,
    algo: `${algoStr} ALGO`,
  }
}

/**
 * Calculate percentage with specified decimal places
 */
function calculatePercentage(part: bigint, total: bigint, decimals = 2): string {
  if (total === 0n) {
    return '0%'
  }
  // Use high precision multiplication to avoid floating point issues
  const percentage = (Number(part) / Number(total)) * 100
  return `${percentage.toFixed(decimals)}%`
}

/**
 * @example
 * ### Run the example
 * ```bash
 * npx tsx examples/algod_client/algod_client-03-ledger-supply.ts
 * ```
 *
 * {@includeCode ./algod_client-03-ledger-supply.ts}
 */
async function main() {
  printHeader('Ledger Supply Information Example')

  // Create an Algod client connected to LocalNet
  const algod = createAlgodClient()

  // =========================================================================
  // Step 1: Get Ledger Supply Information
  // =========================================================================
  printStep(1, 'Getting ledger supply information with supply()')

  try {
    const supplyInfo = await algod.supply()

    printSuccess('Ledger supply information retrieved successfully!')
    printInfo('')

    // =========================================================================
    // Step 2: Display Total Money Supply
    // =========================================================================
    printStep(2, 'Displaying totalMoney (total Algos in the network)')

    const totalFormatted = formatAmount(supplyInfo.totalMoney)
    printInfo('Total money supply in the network:')
    printInfo(`  - In microAlgos: ${totalFormatted.microAlgo}`)
    printInfo(`  - In Algos:      ${totalFormatted.algo}`)
    printInfo('')
    printInfo('totalMoney represents the total amount of Algos in circulation')

    // =========================================================================
    // Step 3: Display Online Money
    // =========================================================================
    printStep(3, 'Displaying onlineMoney (Algos in online accounts for consensus)')

    const onlineFormatted = formatAmount(supplyInfo.onlineMoney)
    printInfo('Online money (participating in consensus):')
    printInfo(`  - In microAlgos: ${onlineFormatted.microAlgo}`)
    printInfo(`  - In Algos:      ${onlineFormatted.algo}`)
    printInfo('')
    printInfo('onlineMoney represents Algos held by accounts that are online and participating in consensus')

    // =========================================================================
    // Step 4: Calculate and Display Online Percentage
    // =========================================================================
    printStep(4, 'Calculating percentage of Algos that are online')

    const onlinePercentage = calculatePercentage(supplyInfo.onlineMoney, supplyInfo.totalMoney)
    const offlineMoney = supplyInfo.totalMoney - supplyInfo.onlineMoney
    const offlineFormatted = formatAmount(offlineMoney)
    const offlinePercentage = calculatePercentage(offlineMoney, supplyInfo.totalMoney)

    printInfo('Supply distribution:')
    printInfo(`  - Online:  ${onlinePercentage} (${onlineFormatted.algo})`)
    printInfo(`  - Offline: ${offlinePercentage} (${offlineFormatted.algo})`)
    printInfo('')

    printInfo('A higher online percentage indicates more stake participating in consensus')
    printInfo('This metric is important for network security and decentralization')

    // =========================================================================
    // Step 5: Display Current Round
    // =========================================================================
    printStep(5, 'Displaying the current round')

    printInfo(`Current round: ${supplyInfo.currentRound.toLocaleString('en-US')}`)
    printInfo('')
    printInfo('The supply information is accurate as of this round')
  } catch (error) {
    printError(`Failed to get ledger supply information: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }

  // =========================================================================
  // Summary
  // =========================================================================
  printHeader('Summary')
  printInfo('This example demonstrated:')
  printInfo('  1. supply() - Retrieves the ledger supply information')
  printInfo('  2. Displaying totalMoney in both microAlgos and Algos')
  printInfo('  3. Displaying onlineMoney in both microAlgos and Algos')
  printInfo('  4. Calculating the percentage of Algos participating in consensus')
  printInfo('')
  printInfo('Key supply fields:')
  printInfo('  - totalMoney: Total Algos in circulation on the network')
  printInfo('  - onlineMoney: Algos in accounts online for consensus')
  printInfo('  - currentRound: The round at which this supply info was calculated')
  printInfo('')
  printInfo('Use cases:')
  printInfo('  - Monitor network participation rate')
  printInfo('  - Track total supply for economic analysis')
  printInfo('  - Verify consensus security metrics')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})

export { main as AlgodClientLedgerSupplyExample }