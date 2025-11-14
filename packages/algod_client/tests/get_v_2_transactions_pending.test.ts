import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { config } from './config'

describe('GET v2_transactions_pending', () => {
  // Polytest Suite: GET v2_transactions_pending

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // TODO: Fix msgpack response handling in PollyJS mock server
    test.skip('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getPendingTransactions()

      expect(result).toMatchSnapshot()
    })
  })
})