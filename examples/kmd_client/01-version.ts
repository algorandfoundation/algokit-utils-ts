/**
 * Example: KMD Version Information
 *
 * This example demonstrates how to retrieve version information from the KMD
 * (Key Management Daemon) server using the version() method.
 *
 * Prerequisites:
 * - LocalNet running (via `algokit localnet start`)
 */

import { createKmdClient, printError, printHeader, printInfo, printStep, printSuccess } from '../shared/utils.js'

async function main() {
  printHeader('KMD Version Information Example')

  // Create a KMD client connected to LocalNet
  const kmd = createKmdClient()

  // =========================================================================
  // Step 1: Get Version Information
  // =========================================================================
  printStep(1, 'Getting KMD version information with version()')

  try {
    const versionInfo = await kmd.version()

    printSuccess('Version information retrieved successfully!')
    printInfo('')
    printInfo('Supported API versions:')

    if (versionInfo.versions.length === 0) {
      printInfo('  (No versions reported)')
    } else {
      versionInfo.versions.forEach((version) => {
        printInfo(`  - ${version}`)
      })
    }

    // =========================================================================
    // Summary
    // =========================================================================
    printHeader('Summary')
    printInfo('This example demonstrated:')
    printInfo('  1. version() - Retrieves KMD server version information')
    printInfo('')
    printInfo('Key fields in VersionsResponse:')
    printInfo('  - versions: Array of supported API version strings')
    printInfo('')
    printInfo('The KMD (Key Management Daemon) is responsible for:')
    printInfo('  - Managing wallets and their keys')
    printInfo('  - Signing transactions securely')
    printInfo('  - Storing keys in encrypted wallet files')
  } catch (error) {
    printError(`Failed to get version information: ${error instanceof Error ? error.message : String(error)}`)
    printInfo('')
    printInfo('Troubleshooting:')
    printInfo('  - Ensure LocalNet is running: algokit localnet start')
    printInfo('  - Check that KMD is accessible on port 4002')
    printInfo('  - Verify the KMD token is correct')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
