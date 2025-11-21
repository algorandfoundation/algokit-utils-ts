import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { GetStatus, GetStatusMeta } from '../src/models/get-status'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_status', () => {
  // Polytest Suite: GET v2_status

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getStatus()

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<GetStatus>()
      const GetStatusSchema = modelMetadataToZodSchema(GetStatusMeta)
      expect(() => GetStatusSchema.parse(result)).not.toThrow()
    })
  })
})
