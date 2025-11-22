import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { Box } from '../src/models/box'
import { BoxMeta } from '../src/models/box'
import { config, TEST_APP_ID_WITH_BOXES, TEST_BOX_NAME } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_applications_APPLICATION-ID_box', () => {
  // Polytest Suite: GET v2_applications_APPLICATION-ID_box

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupApplicationBoxByIdAndName(TEST_APP_ID_WITH_BOXES, {
        name: TEST_BOX_NAME,
      })

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<Box>()
      const BoxSchema = modelMetadataToZodSchema(BoxMeta)
      expect(() => BoxSchema.parse(result)).not.toThrow()
    })
  })
})
