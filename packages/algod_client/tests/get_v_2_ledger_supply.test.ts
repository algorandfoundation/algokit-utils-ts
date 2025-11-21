import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { GetSupply, GetSupplyMeta } from '../src/models/get-supply'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_ledger_supply', () => {
  // Polytest Suite: GET v2_ledger_supply

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getSupply()

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<GetSupply>()
      const GetSupplySchema = modelMetadataToZodSchema(GetSupplyMeta)
      expect(() => GetSupplySchema.parse(result)).not.toThrow()
    })
  })
})
