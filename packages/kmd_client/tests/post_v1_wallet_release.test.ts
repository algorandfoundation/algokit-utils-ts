import { describe, expect, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig } from './config'
import { getWalletHandle } from './fixtures'

describe('POST v1_wallet_release', () => {
  // Polytest Suite: POST v1_wallet_release

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      // Assert that releaseWalletHandleToken returns undefined
      await expect(
        client.releaseWalletHandleToken({
          walletHandleToken,
        }),
      ).resolves.toBeUndefined()

      // Verify the handle is now invalid by trying to use it
      await expect(client.walletInfo({ walletHandleToken })).rejects.toThrow()
    })
  })
})
