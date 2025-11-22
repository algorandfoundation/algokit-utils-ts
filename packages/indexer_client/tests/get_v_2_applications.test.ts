import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { SearchForApplications } from '../src/models/search-for-applications'
import { SearchForApplicationsMeta } from '../src/models/search-for-applications'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_applications', () => {
  // Polytest Suite: GET v2_applications

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.searchForApplications({ limit: 1 })

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<SearchForApplications>()
      const SearchForApplicationsSchema = modelMetadataToZodSchema(SearchForApplicationsMeta)
      expect(() => SearchForApplicationsSchema.parse(result)).not.toThrow()
    })
  })
})