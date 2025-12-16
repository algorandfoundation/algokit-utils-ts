import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config, TEST_ADDRESS } from './config'
import { ApplicationLocalStatesResponse } from './schemas'

describe('GET v2_accounts_ACCOUNT-ID_apps-local-state', () => {
  // Polytest Suite: GET v2_accounts_ACCOUNT-ID_apps-local-state

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.lookupAccountAppLocalStates(TEST_ADDRESS)

      ApplicationLocalStatesResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})