/**
 * Example: Test Data Constants
 *
 * This example demonstrates the test data constants available in the
 * @algorandfoundation/algokit-utils/testing package. These constants match
 * the pre-recorded HAR file responses used by the mock server.
 *
 * No mock server is required - this example just displays the constants.
 *
 * Prerequisites:
 * - No LocalNet required
 */

import {
  TEST_ADDRESS,
  TEST_APP_ID,
  TEST_APP_ID_WITH_BOXES,
  TEST_ASSET_ID,
  TEST_BOX_NAME,
  TEST_ROUND,
  TEST_TXID,
} from '@algorandfoundation/algokit-utils/testing'
import { printHeader, printInfo, printStep, printSuccess } from '../shared/utils.js'

async function main() {
  printHeader('Test Data Constants Example')

  printInfo('These constants match pre-recorded HAR file responses in the mock server.')
  printInfo('Use them in your tests to ensure consistent, reproducible test data.')

  // Step 1: TEST_ADDRESS constant
  printStep(1, 'TEST_ADDRESS - Algorand account address')
  printInfo(`Address: ${TEST_ADDRESS}`)
  printInfo(`Length: ${TEST_ADDRESS.length} characters`)
  printInfo('Purpose: Standard Algorand address format for account-related tests.')

  // Step 2: TEST_APP_ID constant
  printStep(2, 'TEST_APP_ID - Application ID for smart contract tests')
  printInfo(`App ID: ${TEST_APP_ID}`)
  printInfo('Purpose: Use this app ID when testing application calls and state queries.')

  // Step 3: TEST_APP_ID_WITH_BOXES constant
  printStep(3, 'TEST_APP_ID_WITH_BOXES - Application ID with box storage')
  printInfo(`App ID: ${TEST_APP_ID_WITH_BOXES}`)
  printInfo('Purpose: Use this app ID when testing box storage operations.')

  // Step 4: TEST_BOX_NAME constant
  printStep(4, 'TEST_BOX_NAME - Base64-encoded box name')
  printInfo(`Box name: ${TEST_BOX_NAME}`)
  printInfo('Purpose: Pre-recorded box name for testing box read/write operations.')

  // Step 5: TEST_ASSET_ID constant
  printStep(5, 'TEST_ASSET_ID - Asset ID for ASA tests')
  printInfo(`Asset ID: ${TEST_ASSET_ID}`)
  printInfo('Purpose: Use this asset ID when testing Algorand Standard Asset operations.')

  // Step 6: TEST_TXID constant
  printStep(6, 'TEST_TXID - Transaction ID string')
  printInfo(`Transaction ID: ${TEST_TXID}`)
  printInfo(`Length: ${TEST_TXID.length} characters`)
  printInfo('Purpose: Use this transaction ID when testing transaction lookups and confirmations.')

  // Step 7: TEST_ROUND constant
  printStep(7, 'TEST_ROUND - Block round number')
  printInfo(`Round: ${TEST_ROUND}`)
  printInfo('Purpose: Use this round number when testing block and round-based queries.')

  // Summary
  printStep(8, 'Summary - Why these constants matter')
  printInfo('The mock server uses HAR (HTTP Archive) files to replay recorded responses.')
  printInfo('These constants match the data in those recordings, ensuring:')
  printInfo('  - Tests always use valid, consistent identifiers')
  printInfo('  - Mock server can match requests to recorded responses')
  printInfo('  - Tests are reproducible across different environments')
  printInfo('')
  printInfo('Example usage in a test:')
  printInfo('  const accountInfo = await algod.accountInformation(TEST_ADDRESS).do()')
  printInfo('  const appInfo = await algod.getApplicationByID(TEST_APP_ID).do()')
  printInfo('  const assetInfo = await algod.getAssetByID(TEST_ASSET_ID).do()')

  printSuccess('Test data constants example completed!')
}

main().catch(console.error)
