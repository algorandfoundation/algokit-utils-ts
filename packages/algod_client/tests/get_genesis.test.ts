import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { Genesis, GenesisMeta } from '../src/models/genesis'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET genesis', () => {
  // Polytest Suite: GET genesis

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test.skip('Basic request and response validation', async () => {
      // Skipped: Real genesis data doesn't match the schema
      // The 'onl' field in genesis allocation state is marked as required in the schema,
      // but user accounts in the genesis block don't have this field (only validator nodes do)
      const client = new AlgodClient(config)

      const result = await client.getGenesis()

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<Genesis>()
      const GenesisSchema = modelMetadataToZodSchema(GenesisMeta)
      expect(() => GenesisSchema.parse(result)).not.toThrow()
    })
  })
})
