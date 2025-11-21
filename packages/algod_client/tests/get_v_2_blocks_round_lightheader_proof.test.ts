import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { LightBlockHeaderProof, LightBlockHeaderProofMeta } from '../src/models/light-block-header-proof'
import { config, TEST_ROUND } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_blocks_ROUND_lightheader_proof', () => {
  // Polytest Suite: GET v2_blocks_ROUND_lightheader_proof

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getLightBlockHeaderProof(TEST_ROUND)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<LightBlockHeaderProof>()
      const LightBlockHeaderProofSchema = modelMetadataToZodSchema(LightBlockHeaderProofMeta)
      expect(() => LightBlockHeaderProofSchema.parse(result)).not.toThrow()
    })
  })
})
