import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_ROUND } from './config'
import { BlockResponse } from './schemas'

describe('GET v2_blocks_ROUND', () => {
  // Polytest Suite: GET v2_blocks_ROUND

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getBlock(TEST_ROUND)

      BlockResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
