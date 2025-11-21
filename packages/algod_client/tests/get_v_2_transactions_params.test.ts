import { describe, expect, expectTypeOf, test } from 'vitest'
import { z } from 'zod'
import { AlgodClient } from '../src/client'
import { SuggestedParams } from '../src/models/suggested-params'
import { config } from './config'

// Manual Zod schema for SuggestedParams (composite type without ModelMetadata)
const SuggestedParamsSchema = z
  .object({
    flatFee: z.boolean(),
    fee: z.bigint(),
    firstValid: z.bigint(),
    lastValid: z.bigint(),
    genesisHash: z.instanceof(Uint8Array),
    genesisId: z.string(),
    minFee: z.bigint(),
    consensusVersion: z.string(),
  })
  .strict()

describe('GET v2_transactions_params', () => {
  // Polytest Suite: GET v2_transactions_params

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getTransactionParams()

      // Compile-time type check
      expectTypeOf(result).toEqualTypeOf<SuggestedParams>()

      // Runtime schema validation (strict mode - fails on extra properties)
      expect(() => SuggestedParamsSchema.parse(result)).not.toThrow()
    })
  })
})
