import type { ClientConfig } from '../src/core/client-config'

// Mock server configuration
export const config: ClientConfig = {
  baseUrl: process.env.MOCK_KMD_SERVER || 'http://localhost:7777',
  apiToken: process.env.MOCK_KMD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}

// Localnet KMD configuration
const kmdServer = process.env.KMD_SERVER || 'http://localhost'
const kmdPort = process.env.KMD_PORT || '4002'
const kmdBaseUrl = `${kmdServer}:${kmdPort}`

export const localnetConfig: ClientConfig = {
  baseUrl: kmdBaseUrl,
  apiToken: process.env.KMD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}

// Test constants
export const TEST_WALLET_PASSWORD = 'test-password-123'
export const TEST_WALLET_DRIVER = 'sqlite'
export const MULTISIG_VERSION = 1
export const MULTISIG_THRESHOLD = 2
export const MULTISIG_KEY_COUNT = 3