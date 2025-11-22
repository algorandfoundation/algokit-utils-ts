import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { LookupTransaction } from '../src/models/lookup-transaction'
import { LookupTransactionMeta } from '../src/models/lookup-transaction'
import { config, TEST_TXID } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_transactions_TXID', () => {
  // Polytest Suite: GET v2_transactions_TXID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupTransaction(TEST_TXID)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<LookupTransaction>()
      const LookupTransactionSchema = modelMetadataToZodSchema(LookupTransactionMeta)
      expect(() => LookupTransactionSchema.parse(result)).not.toThrow()
    })
  })
})