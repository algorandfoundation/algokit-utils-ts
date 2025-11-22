import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { LookupAccountCreatedAssets } from '../src/models/lookup-account-created-assets'
import { LookupAccountCreatedAssetsMeta } from '../src/models/lookup-account-created-assets'
import { config, TEST_ADDRESS } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_accounts_ACCOUNT-ID_created-assets', () => {
  // Polytest Suite: GET v2_accounts_ACCOUNT-ID_created-assets

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAccountCreatedAssets(TEST_ADDRESS)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<LookupAccountCreatedAssets>()
      const LookupAccountCreatedAssetsSchema = modelMetadataToZodSchema(LookupAccountCreatedAssetsMeta)
      expect(() => LookupAccountCreatedAssetsSchema.parse(result)).not.toThrow()
    })
  })
})