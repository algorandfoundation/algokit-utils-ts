import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_ADDRESS } from './config'
import { Account } from './schemas'

describe('GET v2_accounts_ADDRESS', () => {
  // Polytest Suite: GET v2_accounts_ADDRESS

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.accountInformation(TEST_ADDRESS)

      Account.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
