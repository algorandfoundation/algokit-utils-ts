import { describe, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { createTestWallet } from './fixtures'
import { InitWalletHandleTokenResponse } from './schemas'

describe('POST v1_wallet_init', () => {
  // Polytest Suite: POST v1_wallet_init

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)

      // Create a wallet first
      const { walletId } = await createTestWallet(client)

      const result = await client.initWalletHandle({
        walletId,
        walletPassword: TEST_WALLET_PASSWORD,
      })

      InitWalletHandleTokenResponse.parse(result)
    })
  })
})