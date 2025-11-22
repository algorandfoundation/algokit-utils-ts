import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { LookupApplicationLogsById } from '../src/models/lookup-application-logs-by-id'
import { LookupApplicationLogsByIdMeta } from '../src/models/lookup-application-logs-by-id'
import { config, TEST_APP_ID } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_applications_APPLICATION-ID_logs', () => {
  // Polytest Suite: GET v2_applications_APPLICATION-ID_logs

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupApplicationLogsById(TEST_APP_ID)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<LookupApplicationLogsById>()
      const LookupApplicationLogsByIdSchema = modelMetadataToZodSchema(LookupApplicationLogsByIdMeta)
      expect(() => LookupApplicationLogsByIdSchema.parse(result)).not.toThrow()
    })
  })
})