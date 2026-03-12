import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_ROUND } from './config'
import { BlockTxidsResponse } from './schemas'

describe('GET v2_blocks_ROUND_txids', () => {
  // Polytest Suite: GET v2_blocks_ROUND_txids

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.blockTxIds(TEST_ROUND)

      BlockTxidsResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
