import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { SearchForAssets } from '../src/models/search-for-assets'
import { SearchForAssetsMeta } from '../src/models/search-for-assets'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_assets', () => {
  // Polytest Suite: GET v2_assets

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.searchForAssets({ limit: 1 })

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<SearchForAssets>()
      const SearchForAssetsSchema = modelMetadataToZodSchema(SearchForAssetsMeta)
      expect(() => SearchForAssetsSchema.parse(result)).not.toThrow()
    })
  })
})
