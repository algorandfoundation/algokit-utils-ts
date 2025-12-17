import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config, TEST_ADDRESS } from './config'
import { ApplicationsResponse } from './schemas'

describe('GET v2_accounts_ACCOUNT-ID_created-applications', () => {
  // Polytest Suite: GET v2_accounts_ACCOUNT-ID_created-applications

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAccountCreatedApplications(TEST_ADDRESS)

      ApplicationsResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})