import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { Box, BoxMeta } from '../src/models/box'
import { config, TEST_APP_ID_BOX_NAME, TEST_APP_ID_BOXES } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_applications_APPLICATION-ID_box', () => {
  // Polytest Suite: GET v2_applications_APPLICATION-ID_box

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      // Box name as Uint8Array (e.g., "test-box")
      const boxName = Buffer.from(TEST_APP_ID_BOX_NAME, 'base64')

      const result = await client.getApplicationBoxByName(TEST_APP_ID_BOXES, boxName)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<Box>()
      const BoxSchema = modelMetadataToZodSchema(BoxMeta)
      expect(() => BoxSchema.parse(result)).not.toThrow()
    })
  })
})
