import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { LookupAccountCreatedApplications } from '../src/models/lookup-account-created-applications'
import { LookupAccountCreatedApplicationsMeta } from '../src/models/lookup-account-created-applications'
import { config, TEST_ADDRESS } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_accounts_ACCOUNT-ID_created-applications', () => {
  // Polytest Suite: GET v2_accounts_ACCOUNT-ID_created-applications

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAccountCreatedApplications(TEST_ADDRESS)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<LookupAccountCreatedApplications>()
      const LookupAccountCreatedApplicationsSchema = modelMetadataToZodSchema(LookupAccountCreatedApplicationsMeta)
      expect(() => LookupAccountCreatedApplicationsSchema.parse(result)).not.toThrow()
    })
  })
})