import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { SearchForApplicationBoxes } from '../src/models/search-for-application-boxes'
import { SearchForApplicationBoxesMeta } from '../src/models/search-for-application-boxes'
import { config, TEST_APP_ID_WITH_BOXES } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_applications_APPLICATION-ID_boxes', () => {
  // Polytest Suite: GET v2_applications_APPLICATION-ID_boxes

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.searchForApplicationBoxes(TEST_APP_ID_WITH_BOXES)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<SearchForApplicationBoxes>()
      const SearchForApplicationBoxesSchema = modelMetadataToZodSchema(SearchForApplicationBoxesMeta)
      expect(() => SearchForApplicationBoxesSchema.parse(result)).not.toThrow()
    })
  })
})
