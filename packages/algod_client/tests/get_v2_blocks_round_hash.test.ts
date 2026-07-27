import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { TEST_ROUND, config } from './config'

describe('GET v2_blocks_ROUND_hash', () => {
  // Polytest Suite: GET v2_blocks_ROUND_hash

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.blockHash(TEST_ROUND)

      expect(result).toMatchSnapshot()
    })
  })
})
