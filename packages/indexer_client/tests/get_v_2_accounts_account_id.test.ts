import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { LookupAccountById } from '../src/models/lookup-account-by-id'
import { LookupAccountByIdMeta } from '../src/models/lookup-account-by-id'
import { config, TEST_ADDRESS } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_accounts_ACCOUNT-ID', () => {
  // Polytest Suite: GET v2_accounts_ACCOUNT-ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAccountById(TEST_ADDRESS)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<LookupAccountById>()
      const LookupAccountByIdSchema = modelMetadataToZodSchema(LookupAccountByIdMeta)
      expect(() => LookupAccountByIdSchema.parse(result)).not.toThrow()
    })
  })
})