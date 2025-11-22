import { describe, expect, expectTypeOf, test } from 'vitest'
import { IndexerClient } from '../src/client'
import type { LookupAccountAppLocalStates } from '../src/models/lookup-account-app-local-states'
import { LookupAccountAppLocalStatesMeta } from '../src/models/lookup-account-app-local-states'
import { config, TEST_ADDRESS } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_accounts_ACCOUNT-ID_apps-local-state', () => {
  // Polytest Suite: GET v2_accounts_ACCOUNT-ID_apps-local-state

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAccountAppLocalStates(TEST_ADDRESS)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<LookupAccountAppLocalStates>()
      const LookupAccountAppLocalStatesSchema = modelMetadataToZodSchema(LookupAccountAppLocalStatesMeta)
      expect(() => LookupAccountAppLocalStatesSchema.parse(result)).not.toThrow()
    })
  })
})