import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { LookupAssetBalances } from '../src/models/lookup-asset-balances'
import { LookupAssetBalancesMeta } from '../src/models/lookup-asset-balances'
import { config, TEST_ASSET_ID } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_assets_ASSET-ID_balances', () => {
  // Polytest Suite: GET v2_assets_ASSET-ID_balances

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAssetBalances(TEST_ASSET_ID)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<LookupAssetBalances>()
      const LookupAssetBalancesSchema = modelMetadataToZodSchema(LookupAssetBalancesMeta)
      expect(() => LookupAssetBalancesSchema.parse(result)).not.toThrow()
    })
  })
})