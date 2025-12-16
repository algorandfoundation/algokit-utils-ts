import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_ROUND } from './config'

describe('GET v2_deltas_ROUND', () => {
  // Polytest Suite: GET v2_deltas_ROUND

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // Skipped: Requires experimental/archival node features and msgpack response handling
    test.skip('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getLedgerStateDelta(TEST_ROUND)

      expect(result).toMatchSnapshot()
    })
  })
})
