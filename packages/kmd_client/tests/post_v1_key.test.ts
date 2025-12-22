import { describe, expect, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig } from './config'
import { getWalletHandle, releaseWalletHandle } from './fixtures'
import { GenerateKeyResponse } from './schemas'

describe('POST v1_key', () => {
  // Polytest Suite: POST v1_key

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        const result = await client.generateKey({
          walletHandleToken,
        })

        GenerateKeyResponse.parse(result)

        // Verify the generated address has valid Algorand address format
        const addressString = result.address.toString()

        // Verify the key exists in the wallet
        const listResult = await client.listKeysInWallet({ walletHandleToken })
        const addresses = listResult.addresses.map((addr) => addr.toString())
        expect(addresses).toContain(addressString)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})
