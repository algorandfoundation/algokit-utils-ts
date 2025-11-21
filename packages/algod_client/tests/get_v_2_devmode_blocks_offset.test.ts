import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { GetBlockTimeStampOffset, GetBlockTimeStampOffsetMeta } from '../src/models/get-block-time-stamp-offset'
import { localnetConfig } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_devmode_blocks_offset', () => {
  // Polytest Suite: GET v2_devmode_blocks_offset

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      const result = await client.getBlockTimeStampOffset()

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<GetBlockTimeStampOffset>()
      const GetBlockTimeStampOffsetSchema = modelMetadataToZodSchema(GetBlockTimeStampOffsetMeta)
      expect(() => GetBlockTimeStampOffsetSchema.parse(result)).not.toThrow()
    })
  })
})
