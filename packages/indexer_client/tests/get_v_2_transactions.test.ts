import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { SearchForTransactions } from '../src/models/search-for-transactions'
import { SearchForTransactionsMeta } from '../src/models/search-for-transactions'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_transactions', () => {
  // Polytest Suite: GET v2_transactions

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.searchForTransactions({ limit: 1 })

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<SearchForTransactions>()
      const SearchForTransactionsSchema = modelMetadataToZodSchema(SearchForTransactionsMeta)
      expect(() => SearchForTransactionsSchema.parse(result)).not.toThrow()
    })
  })
})