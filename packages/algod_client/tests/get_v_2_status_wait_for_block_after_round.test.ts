import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { WaitForBlock, WaitForBlockMeta } from '../src/models/wait-for-block'
import { config, TEST_ROUND } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_status_wait-for-block-after_ROUND', () => {
  // Polytest Suite: GET v2_status_wait-for-block-after_ROUND

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.waitForBlock(TEST_ROUND)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<WaitForBlock>()
      const WaitForBlockSchema = modelMetadataToZodSchema(WaitForBlockMeta)
      expect(() => WaitForBlockSchema.parse(result)).not.toThrow()
    })
  })
})
