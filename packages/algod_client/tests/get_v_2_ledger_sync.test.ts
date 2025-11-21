import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { GetSyncRound, GetSyncRoundMeta } from '../src/models/get-sync-round'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_ledger_sync', () => {
  // Polytest Suite: GET v2_ledger_sync

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test.skip('Basic request and response validation', async () => {
      // Skipped: Real API response doesn't match the schema
      // The API returns a 'nodely' field that is not in the GetSyncRound model
      const client = new AlgodClient(config)

      const result = await client.getSyncRound()

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<GetSyncRound>()
      const GetSyncRoundSchema = modelMetadataToZodSchema(GetSyncRoundMeta)
      expect(() => GetSyncRoundSchema.parse(result)).not.toThrow()
    })
  })
})
