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
  return process.env.MOCK_INDEXER_URL || process.env.MOCK_INDEXER_SERVER || `http://127.0.0.1:${MOCK_PORTS.indexer.host}`
}

export const config: ClientConfig = {
  baseUrl: getMockServerUrl(),
  token: process.env.MOCK_INDEXER_TOKEN || DEFAULT_TOKEN,
}

export { TEST_ADDRESS, TEST_APP_ID, TEST_APP_ID_WITH_BOXES, TEST_BOX_NAME, TEST_ASSET_ID, TEST_TXID, TEST_ROUND }
