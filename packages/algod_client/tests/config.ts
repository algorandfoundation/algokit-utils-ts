import {
  DEFAULT_TOKEN,
  MOCK_PORTS,
  TEST_ADDRESS,
  TEST_APP_ID,
  TEST_APP_ID_WITH_BOXES,
  TEST_ASSET_ID,
  TEST_BOX_NAME,
  TEST_ROUND,
  TEST_ROUND_PROOF,
  TEST_TXID,
  TEST_TXID_PROOF,
} from '@algorandfoundation/algokit-testing'
import type { ClientConfig } from '../src/core/client-config'

function getMockServerUrl(): string {
  return process.env.MOCK_ALGOD_URL || process.env.MOCK_ALGOD_SERVER || `http://127.0.0.1:${MOCK_PORTS.algod.host}`
}

export const config: ClientConfig = {
  baseUrl: getMockServerUrl(),
  token: process.env.MOCK_ALGOD_TOKEN || DEFAULT_TOKEN,
}

const algodServer = process.env.ALGOD_SERVER || 'http://localhost'
const algodPort = process.env.ALGOD_PORT || '4001'
const algodBaseUrl = `${algodServer}:${algodPort}`

export const localnetConfig: ClientConfig = {
  baseUrl: algodBaseUrl,
  token: process.env.ALGOD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}

// Localnet KMD configuration
const kmdServer = process.env.KMD_SERVER || 'http://localhost'
const kmdPort = process.env.KMD_PORT || '4002'
const kmdBaseUrl = `${kmdServer}:${kmdPort}`

export const localnetKmdConfig: ClientConfig = {
  baseUrl: kmdBaseUrl,
  token: process.env.KMD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
}

export const DEFAULT_WALLET_NAME = 'unencrypted-default-wallet'
export const DEFAULT_WALLET_PASSWORD = ''

export const TEST_ACCOUNT_MNEMONIC =
  'auction inquiry lava second expand liberty glass involve ginger illness length room item discover ahead table doctor term tackle cement bonus profit right above catch'

export {
  TEST_ADDRESS,
  TEST_APP_ID,
  TEST_APP_ID_WITH_BOXES,
  TEST_ASSET_ID,
  TEST_BOX_NAME,
  TEST_ROUND,
  TEST_ROUND_PROOF,
  TEST_TXID,
  TEST_TXID_PROOF,
}
