import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_ADDRESS, TEST_APP_ID } from './config'
import { AccountApplicationResponse } from './schemas'

describe('GET v2_accounts_ADDRESS_applications_APPLICATION-ID', () => {
  // Polytest Suite: GET v2_accounts_ADDRESS_applications_APPLICATION-ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.accountApplicationInformation(TEST_ADDRESS, TEST_APP_ID)

      AccountApplicationResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
