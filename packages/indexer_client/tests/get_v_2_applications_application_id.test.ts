import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { LookupApplicationById } from '../src/models/lookup-application-by-id'
import { LookupApplicationByIdMeta } from '../src/models/lookup-application-by-id'
import { config, TEST_APP_ID } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_applications_APPLICATION-ID', () => {
  // Polytest Suite: GET v2_applications_APPLICATION-ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupApplicationById(TEST_APP_ID)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<LookupApplicationById>()
      const LookupApplicationByIdSchema = modelMetadataToZodSchema(LookupApplicationByIdMeta)
      expect(() => LookupApplicationByIdSchema.parse(result)).not.toThrow()
    })
  })
})