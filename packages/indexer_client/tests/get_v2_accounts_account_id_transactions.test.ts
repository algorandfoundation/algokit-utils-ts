import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config, TEST_ADDRESS } from './config'
import { TransactionsResponse } from './schemas'

describe('GET v2_accounts_ACCOUNT-ID_transactions', () => {
  // Polytest Suite: GET v2_accounts_ACCOUNT-ID_transactions

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAccountTransactions(TEST_ADDRESS)

      TransactionsResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})