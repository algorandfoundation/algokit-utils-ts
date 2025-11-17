import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { config, TEST_ADDRESS } from './config'

describe('GET v2_accounts_ADDRESS', () => {
  // Polytest Suite: GET v2_accounts_ADDRESS

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.accountInformation(TEST_ADDRESS)

      expect(result).toMatchSnapshot()
    })
  })
})