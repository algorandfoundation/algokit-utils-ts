import { describe, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig } from './config'
import { getWalletHandle, releaseWalletHandle } from './fixtures'
import { RenewWalletHandleTokenResponse } from './schemas'

describe('POST v1_wallet_renew', () => {
  // Polytest Suite: POST v1_wallet_renew

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        const result = await client.renewWalletHandleToken({
          walletHandleToken,
        })

        RenewWalletHandleTokenResponse.parse(result)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})