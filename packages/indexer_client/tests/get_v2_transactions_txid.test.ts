import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config, TEST_TXID } from './config'
import { TransactionResponse } from './schemas'

describe('GET v2_transactions_TXID', () => {
  // Polytest Suite: GET v2_transactions_TXID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupTransactionById(TEST_TXID)

      TransactionResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})