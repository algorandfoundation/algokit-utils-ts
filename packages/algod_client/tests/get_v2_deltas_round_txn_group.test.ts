import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_ROUND } from './config'

describe('GET v2_deltas_ROUND_txn_group', () => {
  // Polytest Suite: GET v2_deltas_ROUND_txn_group

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // Skipped: Requires experimental/archival node features with complex LedgerStateDelta schema
    test.skip('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.transactionGroupLedgerStateDeltasForRound(TEST_ROUND)

      expect(result).toMatchSnapshot()
    })
  })
})
