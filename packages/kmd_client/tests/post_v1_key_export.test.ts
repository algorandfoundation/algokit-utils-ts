import { Address } from '@algorandfoundation/algokit-common'
import { describe, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { generateTestKey, getWalletHandle, releaseWalletHandle } from './fixtures'
import { ExportKeyResponse } from './schemas'

describe('POST v1_key_export', () => {
  // Polytest Suite: POST v1_key_export

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Generate a key first
        const addressStr = await generateTestKey(client, walletHandleToken)

        const result = await client.exportKey({
          walletHandleToken,
          address: Address.fromString(addressStr),
          walletPassword: TEST_WALLET_PASSWORD,
        })

        ExportKeyResponse.parse(result)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})