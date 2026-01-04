import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_ASSET_ID } from './config'
import { Asset } from './schemas'

describe('GET v2_assets_ASSET-ID', () => {
  // Polytest Suite: GET v2_assets_ASSET-ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.assetById(TEST_ASSET_ID)

      Asset.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
