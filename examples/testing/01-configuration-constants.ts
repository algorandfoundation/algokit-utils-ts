/**
 * Example: Configuration Constants
 *
 * This example demonstrates the configuration constants available in the
 * @algorandfoundation/algokit-utils/testing package. These constants are
 * used to configure mock servers for testing Algorand client integrations.
 *
 * No mock server is required - this example just displays the constants.
 */

import {
  type ClientType,
  DEFAULT_TOKEN,
  EXTERNAL_URL_ENV_VARS,
  MOCK_PORTS,
} from '@algorandfoundation/algokit-utils/testing'
import { printHeader, printInfo, printStep, printSuccess } from '../shared/utils.js'

async function main() {
  printHeader('Configuration Constants Example')

  // Step 1: DEFAULT_TOKEN constant
  printStep(1, 'DEFAULT_TOKEN - Authentication token for mock servers')
  printInfo(`Token value: "${DEFAULT_TOKEN}"`)
  printInfo(`Token length: ${DEFAULT_TOKEN.length} characters`)
  printInfo('Purpose: This token is used for authenticating requests to mock servers.')
  printInfo('         It matches the default token expected by algokit-polytest mock servers.')

  // Step 2: MOCK_PORTS constant
  printStep(2, 'MOCK_PORTS - Default port configurations for local mock servers')
  printInfo('Port configuration:')
  printInfo(`  - algod:   port ${MOCK_PORTS.algod.host}`)
  printInfo(`  - indexer: port ${MOCK_PORTS.indexer.host}`)
  printInfo(`  - kmd:     port ${MOCK_PORTS.kmd.host}`)
  printInfo('Purpose: These ports match the algokit-polytest defaults for local development.')
  printInfo('         Used when starting mock servers locally without environment variables.')

  // Step 3: EXTERNAL_URL_ENV_VARS mapping
  printStep(3, 'EXTERNAL_URL_ENV_VARS - Environment variable names for server URLs')
  printInfo('Environment variable mapping:')
  printInfo(`  - algod   -> ${EXTERNAL_URL_ENV_VARS.algod}`)
  printInfo(`  - indexer -> ${EXTERNAL_URL_ENV_VARS.indexer}`)
  printInfo(`  - kmd     -> ${EXTERNAL_URL_ENV_VARS.kmd}`)
  printInfo('Purpose: Set these environment variables to specify external mock server URLs.')
  printInfo('         The getMockServer() function reads these to connect to running servers.')

  // Step 4: ClientType union type
  printStep(4, 'ClientType - Union type for supported client types')
  const clientTypes: ClientType[] = ['algod', 'indexer', 'kmd']
  printInfo(`ClientType values: ${clientTypes.map((t) => `'${t}'`).join(' | ')}`)
  printInfo('Purpose: Type-safe way to specify which Algorand client type to use.')
  printInfo('         Used by getMockServer() and other testing utilities.')

  // Summary
  printStep(5, 'Summary - How these constants work together')
  printInfo('The mock server infrastructure works as follows:')
  printInfo('  1. Start mock servers externally (via CLI or GitHub Actions)')
  printInfo('  2. Set environment variables with server URLs:')
  printInfo(`     export ${EXTERNAL_URL_ENV_VARS.algod}=http://localhost:${MOCK_PORTS.algod.host}`)
  printInfo(`     export ${EXTERNAL_URL_ENV_VARS.indexer}=http://localhost:${MOCK_PORTS.indexer.host}`)
  printInfo(`     export ${EXTERNAL_URL_ENV_VARS.kmd}=http://localhost:${MOCK_PORTS.kmd.host}`)
  printInfo(`  3. Use DEFAULT_TOKEN ("${'a'.repeat(8)}...") for authentication`)
  printInfo('  4. Call getMockServer(clientType) to get a configured MockServer instance')

  printSuccess('Configuration constants example completed!')
}

main().catch(console.error)
