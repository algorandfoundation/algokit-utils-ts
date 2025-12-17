import { describe, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig } from './config'
import { generateTestKey, getWalletHandle, releaseWalletHandle } from './fixtures'
import { ListKeysResponse } from './schemas'

describe('POST v1_key_list', () => {
  // Polytest Suite: POST v1_key_list

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Generate at least one key
        await generateTestKey(client, walletHandleToken)

        const result = await client.listKeysInWallet({
          walletHandleToken,
        })

        ListKeysResponse.parse(result)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})