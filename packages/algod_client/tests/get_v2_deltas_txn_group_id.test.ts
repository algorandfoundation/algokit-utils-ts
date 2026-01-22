import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config } from './config'

describe('GET v2_deltas_txn_group_ID', () => {
  // Polytest Suite: GET v2_deltas_txn_group_ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // Skipped: Requires experimental/archival node features with complex LedgerStateDelta schema
    test.skip('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const TEST_GROUP_ID = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'

      const result = await client.ledgerStateDeltaForTransactionGroup(TEST_GROUP_ID)

      expect(result).toMatchSnapshot()
    })
  })
})
