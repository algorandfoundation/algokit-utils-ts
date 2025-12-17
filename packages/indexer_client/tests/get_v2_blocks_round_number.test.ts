import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config, TEST_ROUND } from './config'
import { Block } from './schemas'

describe('GET v2_blocks_ROUND-NUMBER', () => {
  // Polytest Suite: GET v2_blocks_ROUND-NUMBER

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupBlock(TEST_ROUND)

      Block.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})