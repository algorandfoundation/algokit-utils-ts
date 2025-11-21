import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { AccountApplicationInformation, AccountApplicationInformationMeta } from '../src/models/account-application-information'
import { config, TEST_ADDRESS, TEST_APP_ID } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_accounts_ADDRESS_applications_APPLICATION-ID', () => {
  // Polytest Suite: GET v2_accounts_ADDRESS_applications_APPLICATION-ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.accountApplicationInformation(TEST_ADDRESS, TEST_APP_ID)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<AccountApplicationInformation>()
      const AccountApplicationInformationSchema = modelMetadataToZodSchema(AccountApplicationInformationMeta)
      expect(() => AccountApplicationInformationSchema.parse(result)).not.toThrow()
    })
  })
})
