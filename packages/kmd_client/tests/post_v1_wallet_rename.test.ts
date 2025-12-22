import { describe, expect, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { getWalletHandle, releaseWalletHandle } from './fixtures'
import { RenameWalletResponse } from './schemas'

describe('POST v1_wallet_rename', () => {
  // Polytest Suite: POST v1_wallet_rename

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken, walletId, walletName } = await getWalletHandle(client)

      try {
        const newWalletName = `${walletName}-renamed`
        const result = await client.renameWallet({
          walletId,
          walletPassword: TEST_WALLET_PASSWORD,
          walletName: newWalletName,
        })

        RenameWalletResponse.parse(result)

        // Verify the wallet was renamed
        const walletInfo = await client.walletInfo({ walletHandleToken })
        expect(walletInfo.walletHandle.wallet.name).toBe(newWalletName)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})
