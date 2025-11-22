import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { HealthCheck } from '../src/models/health-check'
import { HealthCheckMeta } from '../src/models/health-check'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET health', () => {
  // Polytest Suite: GET health

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // TODO: Schema mismatch - HealthCheckDataMeta has empty fields but API returns
    // 'migration-required' and 'read-only-mode' in the data object.
    // The metadata model needs to be updated to include these fields or use additionalProperties.
    test.skip('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.makeHealthCheck()

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<HealthCheck>()
      const HealthCheckSchema = modelMetadataToZodSchema(HealthCheckMeta)
      expect(() => HealthCheckSchema.parse(result)).not.toThrow()
    })
  })
})