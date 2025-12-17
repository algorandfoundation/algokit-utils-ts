import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config } from './config'
import { TransactionsResponse } from './schemas'

describe('GET v2_transactions', () => {
  // Polytest Suite: GET v2_transactions

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.searchForTransactions({ limit: 1 })

      TransactionsResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})