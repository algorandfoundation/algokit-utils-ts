import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config, TEST_ASSET_ID } from './config'
import { TransactionsResponse } from './schemas'

describe('GET v2_assets_ASSET-ID_transactions', () => {
  // Polytest Suite: GET v2_assets_ASSET-ID_transactions

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAssetTransactions(TEST_ASSET_ID)

      TransactionsResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})