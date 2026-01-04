import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_TXID } from './config'
import { PendingTransactionResponse } from './schemas'

describe('GET v2_transactions_pending_TXID', () => {
  // Polytest Suite: GET v2_transactions_pending_TXID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests
    
    // Skipping because we still need to find a recording of this
    test.skip('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.pendingTransactionInformation(TEST_TXID)

      PendingTransactionResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
