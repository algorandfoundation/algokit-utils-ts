/**
 * Example: Indexer Health Check
 *
 * This example demonstrates how to check indexer health status using
 * the IndexerClient healthCheck() method.
 *
 * Prerequisites:
 * - LocalNet running (via `algokit localnet start`)
 */

import { createIndexerClient, printError, printHeader, printInfo, printStep, printSuccess } from './shared/utils.js'

async function main() {
  printHeader('Indexer Health Check Example')

  // Create an Indexer client connected to LocalNet
  const indexer = createIndexerClient()

  // =========================================================================
  // Step 1: Perform Health Check
  // =========================================================================
  printStep(1, 'Checking indexer health with healthCheck()')

  try {
    // healthCheck() returns a HealthCheck object with status information
    const health = await indexer.healthCheck()

    printSuccess('Indexer is healthy!')
    printInfo('')
    printInfo('Health check response:')
    printInfo(`  - version: ${health.version}`)
    printInfo(`  - dbAvailable: ${health.dbAvailable}`)
    printInfo(`  - isMigrating: ${health.isMigrating}`)
    printInfo(`  - message: ${health.message}`)
    printInfo(`  - round: ${health.round}`)

    // Display errors if any
    if (health.errors && health.errors.length > 0) {
      printInfo(`  - errors: ${health.errors.join(', ')}`)
    } else {
      printInfo('  - errors: none')
    }

    // =========================================================================
    // Step 2: Interpret the Health Check Results
    // =========================================================================
    printStep(2, 'Interpreting health check results')

    // Check if the database is available
    if (health.dbAvailable) {
      printSuccess('Database is available and accessible')
    } else {
      printError('Database is NOT available')
    }

    // Check if a migration is in progress
    if (health.isMigrating) {
      printInfo('Note: Database migration is in progress')
      printInfo('Some queries may be slower or unavailable during migration')
    } else {
      printSuccess('No database migration in progress')
    }

    // Display current round
    printInfo(`Indexer has processed blocks up to round ${health.round}`)
  } catch (error) {
    printError(`Health check failed: ${error instanceof Error ? error.message : String(error)}`)
    printInfo('')
    printInfo('Common causes of health check failures:')
    printInfo('  - Indexer service is not running')
    printInfo('  - Network connectivity issues')
    printInfo('  - Incorrect indexer URL or port')
    printInfo('')
    printInfo('To start LocalNet, run: algokit localnet start')
  }

  // =========================================================================
  // Summary
  // =========================================================================
  printHeader('Summary')
  printInfo('This example demonstrated:')
  printInfo('  1. healthCheck() - Checks if the indexer service is healthy')
  printInfo('')
  printInfo('Health check response fields explained:')
  printInfo('  - version: The version of the indexer software')
  printInfo('  - dbAvailable: Whether the database is accessible')
  printInfo('  - isMigrating: Whether a database migration is in progress')
  printInfo('  - message: A human-readable status message')
  printInfo('  - round: The latest block round the indexer has processed')
  printInfo('  - errors: Any error messages from the indexer')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
