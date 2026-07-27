import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config, TEST_ASSET_ID } from './config'
import { AssetBalancesResponse } from './schemas'

describe('GET v2_assets_ASSET-ID_balances', () => {
  // Polytest Suite: GET v2_assets_ASSET-ID_balances

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAssetBalances(TEST_ASSET_ID)

      AssetBalancesResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})