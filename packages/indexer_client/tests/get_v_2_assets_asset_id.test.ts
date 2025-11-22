import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { LookupAssetById } from '../src/models/lookup-asset-by-id'
import { LookupAssetByIdMeta } from '../src/models/lookup-asset-by-id'
import { config, TEST_ASSET_ID } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_assets_ASSET-ID', () => {
  // Polytest Suite: GET v2_assets_ASSET-ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAssetById(TEST_ASSET_ID)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<LookupAssetById>()
      const LookupAssetByIdSchema = modelMetadataToZodSchema(LookupAssetByIdMeta)
      expect(() => LookupAssetByIdSchema.parse(result)).not.toThrow()
    })
  })
})