/**
 * Example: Node Health and Status
 *
 * This example demonstrates how to check node health and status using
 * the AlgodClient methods: healthCheck(), ready(), status(), and statusAfterBlock().
 *
 * Prerequisites:
 * - LocalNet running (via `algokit localnet start`)
 */

import { createAlgodClient, printError, printHeader, printInfo, printStep, printSuccess } from '../shared/utils.js'

/**
 * Format nanoseconds to a human-readable string
 */
function formatNanoseconds(ns: bigint): string {
  const ms = Number(ns) / 1_000_000
  if (ms < 1000) {
    return `${ms.toFixed(2)} ms`
  }
  const seconds = ms / 1000
  if (seconds < 60) {
    return `${seconds.toFixed(2)} seconds`
  }
  const minutes = seconds / 60
  return `${minutes.toFixed(2)} minutes`
}

async function main() {
  printHeader('Node Health and Status Example')

  // Create an Algod client connected to LocalNet
  const algod = createAlgodClient()

  // =========================================================================
  // Step 1: Health Check
  // =========================================================================
  printStep(1, 'Checking node health with healthCheck()')

  try {
    // healthCheck() returns void if successful, throws an error if unhealthy
    await algod.healthCheck()
    printSuccess('Node is healthy!')
    printInfo('healthCheck() returns void when the node is healthy')
    printInfo('If the node is unhealthy, it throws an error')
  } catch (error) {
    printError(`Node health check failed: ${error instanceof Error ? error.message : String(error)}`)
  }

  // =========================================================================
  // Step 2: Ready Check
  // =========================================================================
  printStep(2, 'Checking if node is ready with ready()')

  try {
    // ready() returns void if the node is ready to accept transactions
    await algod.ready()
    printSuccess('Node is ready to accept transactions!')
    printInfo('ready() returns void when the node is ready')
    printInfo('If the node is not ready (e.g., catching up), it throws an error')
  } catch (error) {
    printError(`Node ready check failed: ${error instanceof Error ? error.message : String(error)}`)
  }

  // =========================================================================
  // Step 3: Get Node Status
  // =========================================================================
  printStep(3, 'Getting current node status with status()')

  try {
    const nodeStatus = await algod.status()

    printSuccess('Node status retrieved successfully!')
    printInfo('')
    printInfo('Key status fields:')
    printInfo(`  - lastRound: ${nodeStatus.lastRound}`)
    printInfo(`  - catchupTime: ${formatNanoseconds(nodeStatus.catchupTime)}`)
    printInfo(`  - timeSinceLastRound: ${formatNanoseconds(nodeStatus.timeSinceLastRound)}`)
    printInfo(`  - lastVersion: ${nodeStatus.lastVersion}`)
    printInfo(`  - stoppedAtUnsupportedRound: ${nodeStatus.stoppedAtUnsupportedRound}`)

    // Check if node has synced since startup (catchupTime === 0 means synced)
    const hasSyncedSinceStartup = nodeStatus.catchupTime === 0n
    printInfo(`  - hasSyncedSinceStartup: ${hasSyncedSinceStartup}`)

    if (nodeStatus.lastCatchpoint) {
      printInfo(`  - lastCatchpoint: ${nodeStatus.lastCatchpoint}`)
    }
  } catch (error) {
    printError(`Failed to get node status: ${error instanceof Error ? error.message : String(error)}`)
  }

  // =========================================================================
  // Step 4: Wait for Block After Round
  // =========================================================================
  printStep(4, 'Waiting for next block with statusAfterBlock(round)')

  try {
    // First, get the current round
    const currentStatus = await algod.status()
    const currentRound = currentStatus.lastRound

    printInfo(`Current round: ${currentRound}`)
    printInfo(`Waiting for block after round ${currentRound}...`)

    // Wait for a block after the current round
    // Note: On LocalNet in dev mode, blocks are produced on-demand,
    // so this may timeout if no transactions are submitted
    const startTime = Date.now()
    const newStatus = await algod.statusAfterBlock(currentRound)
    const elapsedTime = Date.now() - startTime

    printSuccess(`New block received!`)
    printInfo(`  - New round: ${newStatus.lastRound}`)
    printInfo(`  - Wait time: ${elapsedTime} ms`)
    printInfo(`  - timeSinceLastRound: ${formatNanoseconds(newStatus.timeSinceLastRound)}`)
  } catch (error) {
    // statusAfterBlock has a 1 minute timeout by default
    printError(`Failed to wait for block: ${error instanceof Error ? error.message : String(error)}`)
    printInfo('Note: On LocalNet in dev mode, blocks are only produced when transactions are submitted')
    printInfo('Try submitting a transaction in another terminal to trigger a new block')
  }

  // =========================================================================
  // Summary
  // =========================================================================
  printHeader('Summary')
  printInfo('This example demonstrated:')
  printInfo('  1. healthCheck() - Checks if the node is healthy (returns void or throws)')
  printInfo('  2. ready() - Checks if the node is ready to accept transactions')
  printInfo('  3. status() - Gets current node status including lastRound, catchupTime, etc.')
  printInfo('  4. statusAfterBlock(round) - Waits for a new block after the specified round')
  printInfo('')
  printInfo('Key status fields explained:')
  printInfo('  - lastRound: The most recent block the node has seen')
  printInfo('  - catchupTime: Time spent catching up (0 = fully synced)')
  printInfo('  - timeSinceLastRound: Time elapsed since the last block')
  printInfo('  - stoppedAtUnsupportedRound: True if node stopped due to unsupported consensus')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
