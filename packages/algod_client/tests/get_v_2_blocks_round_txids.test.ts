import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { GetBlockTxIds, GetBlockTxIdsMeta } from '../src/models/get-block-tx-ids'
import { config, TEST_ROUND } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_blocks_ROUND_txids', () => {
  // Polytest Suite: GET v2_blocks_ROUND_txids

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getBlockTxIds(TEST_ROUND)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<GetBlockTxIds>()
      const GetBlockTxIdsSchema = modelMetadataToZodSchema(GetBlockTxIdsMeta)
      expect(() => GetBlockTxIdsSchema.parse(result)).not.toThrow()
    })
  })
})
