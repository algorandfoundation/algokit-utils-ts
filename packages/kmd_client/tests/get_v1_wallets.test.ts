import { describe, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig } from './config'
import { ListWalletsResponse } from './schemas'

describe('GET v1_wallets', () => {
  // Polytest Suite: GET v1_wallets

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)

      const result = await client.listWallets()

      ListWalletsResponse.parse(result)
    })
  })
})