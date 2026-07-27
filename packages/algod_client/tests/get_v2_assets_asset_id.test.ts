import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { config } from './config'

const TEST_ASSET_ID = 705457144

describe('GET v2_assets_ASSET-ID', () => {
  // Polytest Suite: GET v2_assets_ASSET-ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.assetById(TEST_ASSET_ID)

      expect(result).toMatchSnapshot()
    })
  })
})
