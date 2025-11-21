import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { GetBlockHash, GetBlockHashMeta } from '../src/models/get-block-hash'
import { config, TEST_ROUND } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_blocks_ROUND_hash', () => {
  // Polytest Suite: GET v2_blocks_ROUND_hash

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getBlockHash(TEST_ROUND)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<GetBlockHash>()
      const GetBlockHashSchema = modelMetadataToZodSchema(GetBlockHashMeta)
      expect(() => GetBlockHashSchema.parse(result)).not.toThrow()
    })
  })
})
