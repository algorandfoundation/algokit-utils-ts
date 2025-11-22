import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { Block } from '../src/models/block'
import { BlockMeta } from '../src/models/block'
import { config, TEST_ROUND } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_blocks_ROUND-NUMBER', () => {
  // Polytest Suite: GET v2_blocks_ROUND-NUMBER

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupBlock(TEST_ROUND)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<Block>()
      const BlockSchema = modelMetadataToZodSchema(BlockMeta)
      expect(() => BlockSchema.parse(result)).not.toThrow()
    })
  })
})