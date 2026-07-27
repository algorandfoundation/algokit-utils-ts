import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config, TEST_ADDRESS } from './config'
import { AccountResponse } from './schemas'

describe('GET v2_accounts_ACCOUNT-ID', () => {
  // Polytest Suite: GET v2_accounts_ACCOUNT-ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAccountById(TEST_ADDRESS)

      AccountResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})