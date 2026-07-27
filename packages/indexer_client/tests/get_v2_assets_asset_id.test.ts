import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config, TEST_ASSET_ID } from './config'
import { AssetResponse } from './schemas'

describe('GET v2_assets_ASSET-ID', () => {
  // Polytest Suite: GET v2_assets_ASSET-ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAssetById(TEST_ASSET_ID)

      AssetResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})