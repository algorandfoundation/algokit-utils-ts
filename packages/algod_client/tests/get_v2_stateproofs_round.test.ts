import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_ROUND_STATEPROOF } from './config'
import { StateProof } from './schemas'

describe('GET v2_stateproofs_ROUND', () => {
  // Polytest Suite: GET v2_stateproofs_ROUND

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // Skipped: State proofs are only available on mainnet/testnet for specific rounds
    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.stateProof(TEST_ROUND_STATEPROOF)

      StateProof.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
