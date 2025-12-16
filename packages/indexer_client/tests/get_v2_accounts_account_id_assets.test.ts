import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config, TEST_ADDRESS } from './config'
import { AssetHoldingsResponse } from './schemas'

describe('GET v2_accounts_ACCOUNT-ID_assets', () => {
  // Polytest Suite: GET v2_accounts_ACCOUNT-ID_assets

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAccountAssets(TEST_ADDRESS)

      AssetHoldingsResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})