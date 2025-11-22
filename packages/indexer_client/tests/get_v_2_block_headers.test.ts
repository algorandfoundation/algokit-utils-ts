import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { SearchForBlockHeaders } from '../src/models/search-for-block-headers'
import { SearchForBlockHeadersMeta } from '../src/models/search-for-block-headers'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_block-headers', () => {
  // Polytest Suite: GET v2_block-headers

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.searchForBlockHeaders({ limit: 1 })

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<SearchForBlockHeaders>()
      const SearchForBlockHeadersSchema = modelMetadataToZodSchema(SearchForBlockHeadersMeta)
      expect(() => SearchForBlockHeadersSchema.parse(result)).not.toThrow()
    })
  })
})