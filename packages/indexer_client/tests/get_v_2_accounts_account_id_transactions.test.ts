import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { LookupAccountTransactions } from '../src/models/lookup-account-transactions'
import { LookupAccountTransactionsMeta } from '../src/models/lookup-account-transactions'
import { config, TEST_ADDRESS } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_accounts_ACCOUNT-ID_transactions', () => {
  // Polytest Suite: GET v2_accounts_ACCOUNT-ID_transactions

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAccountTransactions(TEST_ADDRESS)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<LookupAccountTransactions>()
      const LookupAccountTransactionsSchema = modelMetadataToZodSchema(LookupAccountTransactionsMeta)
      expect(() => LookupAccountTransactionsSchema.parse(result)).not.toThrow()
    })
  })
})
