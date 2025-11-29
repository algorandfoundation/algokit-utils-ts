import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { config, TEST_ROUND } from './config'

describe('GET v2_blocks_ROUND_lightheader_proof', () => {
  // Polytest Suite: GET v2_blocks_ROUND_lightheader_proof

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getLightBlockHeaderProof(TEST_ROUND)

      expect(result).toMatchSnapshot()
    })
  })
})
