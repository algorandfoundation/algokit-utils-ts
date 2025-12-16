import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_ROUND } from './config'
import { StateProof } from './schemas'

describe('GET v2_stateproofs_ROUND', () => {
  // Polytest Suite: GET v2_stateproofs_ROUND

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // Skipped: State proofs are only available on mainnet/testnet for specific rounds
    test.skip('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getStateProof(TEST_ROUND)

      StateProof.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
