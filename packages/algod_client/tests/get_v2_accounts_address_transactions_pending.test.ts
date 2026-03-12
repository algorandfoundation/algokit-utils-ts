import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_ADDRESS } from './config'
import { PendingTransactionsResponse } from './schemas'

describe('GET v2_accounts_ADDRESS_transactions_pending', () => {
  // Polytest Suite: GET v2_accounts_ADDRESS_transactions_pending

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.pendingTransactionsByAddress(TEST_ADDRESS)

      PendingTransactionsResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
