import { describe, expect, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig, TEST_WALLET_DRIVER, TEST_WALLET_PASSWORD } from './config'
import { generateWalletName } from './fixtures'
import { CreateWalletResponse } from './schemas'

describe('POST v1_wallet', () => {
  // Polytest Suite: POST v1_wallet

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)

      const walletName = generateWalletName()
      const result = await client.createWallet({
        walletName,
        walletPassword: TEST_WALLET_PASSWORD,
        walletDriverName: TEST_WALLET_DRIVER,
      })

      CreateWalletResponse.parse(result)

      // Verify the wallet was created
      const listResult = await client.listWallets()
      const createdWallet = listResult.wallets.find((w) => w.id === result.wallet.id)
      expect(createdWallet).toBeDefined()
      expect(createdWallet?.name).toBe(walletName)
    })
  })
})
