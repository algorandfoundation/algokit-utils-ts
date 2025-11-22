import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { SearchForAccounts } from '../src/models/search-for-accounts'
import { SearchForAccountsMeta } from '../src/models/search-for-accounts'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_accounts', () => {
  // Polytest Suite: GET v2_accounts

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.searchForAccounts({ limit: 1 })

      // Assert that exactly 1 account is returned
      expect(result.accounts).toHaveLength(1)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<SearchForAccounts>()
      const SearchForAccountsSchema = modelMetadataToZodSchema(SearchForAccountsMeta)
      expect(() => SearchForAccountsSchema.parse(result)).not.toThrow()
    })
  })
})
