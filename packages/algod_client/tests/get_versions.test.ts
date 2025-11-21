import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { Version, VersionMeta } from '../src/models/version'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET versions', () => {
  // Polytest Suite: GET versions

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getVersion()

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<Version>()
      const VersionSchema = modelMetadataToZodSchema(VersionMeta)
      expect(() => VersionSchema.parse(result)).not.toThrow()
    })
  })
})
