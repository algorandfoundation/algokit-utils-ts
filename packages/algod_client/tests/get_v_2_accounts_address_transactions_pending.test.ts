import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { config, TEST_ADDRESS } from './config'

describe('GET v2_accounts_ADDRESS_transactions_pending', () => {
  // Polytest Suite: GET v2_accounts_ADDRESS_transactions_pending

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // TODO: Fix msgpack response handling in PollyJS mock server
    test.skip('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getPendingTransactionsByAddress(TEST_ADDRESS)

      expect(result).toMatchSnapshot()
    })
  })
})
