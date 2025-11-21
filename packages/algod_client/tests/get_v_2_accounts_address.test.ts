import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { Account, AccountMeta } from '../src/models/account'
import { config, TEST_ADDRESS } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_accounts_ADDRESS', () => {
  // Polytest Suite: GET v2_accounts_ADDRESS

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.accountInformation(TEST_ADDRESS)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<Account>()
      const AccountSchema = modelMetadataToZodSchema(AccountMeta)
      expect(() => AccountSchema.parse(result)).not.toThrow()
    })
  })
})
