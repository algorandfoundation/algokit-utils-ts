import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { VersionsResponse } from '../src/models/versions-response'
import { VersionsResponseMeta } from '../src/models/versions-response'
import { localnetConfig } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET versions', () => {
  // Polytest Suite: GET versions

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)

      const result = await client.getVersion()

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<VersionsResponse>()
      const VersionsResponseSchema = modelMetadataToZodSchema(VersionsResponseMeta)
      expect(() => VersionsResponseSchema.parse(result)).not.toThrow()
    })
  })
})