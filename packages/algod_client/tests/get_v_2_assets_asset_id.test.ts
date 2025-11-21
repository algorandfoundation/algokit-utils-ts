import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { Asset, AssetMeta } from '../src/models/asset'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

const TEST_ASSET_ID = 705457144

describe('GET v2_assets_ASSET-ID', () => {
  // Polytest Suite: GET v2_assets_ASSET-ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getAssetById(TEST_ASSET_ID)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<Asset>()
      const AssetSchema = modelMetadataToZodSchema(AssetMeta)
      expect(() => AssetSchema.parse(result)).not.toThrow()
    })
  })
})
