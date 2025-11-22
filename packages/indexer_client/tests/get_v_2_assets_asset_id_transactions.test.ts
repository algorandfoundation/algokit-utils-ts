import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { LookupAssetTransactions } from '../src/models/lookup-asset-transactions'
import { LookupAssetTransactionsMeta } from '../src/models/lookup-asset-transactions'
import { config, TEST_ASSET_ID } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_assets_ASSET-ID_transactions', () => {
  // Polytest Suite: GET v2_assets_ASSET-ID_transactions

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAssetTransactions(TEST_ASSET_ID)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<LookupAssetTransactions>()
      const LookupAssetTransactionsSchema = modelMetadataToZodSchema(LookupAssetTransactionsMeta)
      expect(() => LookupAssetTransactionsSchema.parse(result)).not.toThrow()
    })
  })
})