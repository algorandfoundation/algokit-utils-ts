import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_ROUND_PROOF, TEST_TXID_PROOF } from './config'
import { TransactionProof } from './schemas'

describe('GET v2_blocks_ROUND_transactions_TXID_proof', () => {
  // Polytest Suite: GET v2_blocks_ROUND_transactions_TXID_proof

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.transactionProof(TEST_ROUND_PROOF, TEST_TXID_PROOF)

      TransactionProof.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
