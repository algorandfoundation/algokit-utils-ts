import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { LookupAccountAssets } from '../src/models/lookup-account-assets'
import { LookupAccountAssetsMeta } from '../src/models/lookup-account-assets'
import { config, TEST_ADDRESS } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_accounts_ACCOUNT-ID_assets', () => {
  // Polytest Suite: GET v2_accounts_ACCOUNT-ID_assets

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAccountAssets(TEST_ADDRESS)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<LookupAccountAssets>()
      const LookupAccountAssetsSchema = modelMetadataToZodSchema(LookupAccountAssetsMeta)
      expect(() => LookupAccountAssetsSchema.parse(result)).not.toThrow()
    })
  })
})
