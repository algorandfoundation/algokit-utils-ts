import type { ClientConfig } from '../src/core/client-config'
import {
  DEFAULT_TOKEN,
  MOCK_PORTS,
  TEST_ADDRESS,
  TEST_APP_ID,
  TEST_APP_ID_WITH_BOXES,
  TEST_BOX_NAME,
  TEST_ASSET_ID,
  TEST_TXID,
  TEST_ROUND,
} from '@algorandfoundation/algokit-testing'

function getMockServerUrl(): string {
  return process.env.MOCK_KMD_URL || process.env.MOCK_KMD_SERVER || `http://127.0.0.1:${MOCK_PORTS.kmd.host}`
}

// Mock server configuration
export const config: ClientConfig = {
  baseUrl: getMockServerUrl(),
  token: process.env.MOCK_KMD_TOKEN || DEFAULT_TOKEN,
}

// Localnet KMD configuration
const kmdServer = process.env.KMD_SERVER || 'http://localhost'
const kmdPort = process.env.KMD_PORT || '4002'
const kmdBaseUrl = `${kmdServer}:${kmdPort}`

export const localnetConfig: ClientConfig = {
  baseUrl: kmdBaseUrl,
  token: process.env.KMD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}

// Test constants
export const TEST_WALLET_PASSWORD = 'test-password-123'
export const TEST_WALLET_DRIVER = 'sqlite'
export const MULTISIG_VERSION = 1
export const MULTISIG_THRESHOLD = 2
export const MULTISIG_KEY_COUNT = 3

export { TEST_ADDRESS, TEST_APP_ID, TEST_APP_ID_WITH_BOXES, TEST_BOX_NAME, TEST_ASSET_ID, TEST_TXID, TEST_ROUND }
