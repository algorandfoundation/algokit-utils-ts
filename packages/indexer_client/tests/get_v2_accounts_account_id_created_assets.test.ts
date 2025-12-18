import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config, TEST_ADDRESS } from './config'
import { AssetsResponse } from './schemas'

describe('GET v2_accounts_ACCOUNT-ID_created-assets', () => {
  // Polytest Suite: GET v2_accounts_ACCOUNT-ID_created-assets

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAccountCreatedAssets(TEST_ADDRESS)

      AssetsResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})