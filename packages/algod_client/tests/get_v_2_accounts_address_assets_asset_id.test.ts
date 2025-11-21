import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { AccountAssetInformation, AccountAssetInformationMeta } from '../src/models/account-asset-information'
import { config, TEST_ADDRESS, TEST_ASSET_ID } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_accounts_ADDRESS_assets_ASSET-ID', () => {
  // Polytest Suite: GET v2_accounts_ADDRESS_assets_ASSET-ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.accountAssetInformation(TEST_ADDRESS, TEST_ASSET_ID)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<AccountAssetInformation>()
      const AccountAssetInformationSchema = modelMetadataToZodSchema(AccountAssetInformationMeta)
      expect(() => AccountAssetInformationSchema.parse(result)).not.toThrow()
    })
  })
})
