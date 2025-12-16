import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config } from './config'
import { AccountsResponse } from './schemas'

describe('GET v2_accounts', () => {
  // Polytest Suite: GET v2_accounts

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.searchForAccounts({ limit: 1 })

      AccountsResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})