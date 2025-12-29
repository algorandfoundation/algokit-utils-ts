import { Address } from '@algorandfoundation/algokit-common'
import { describe, expect, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { generateTestKey, getWalletHandle, releaseWalletHandle } from './fixtures'

describe('DELETE v1_key', () => {
  // Polytest Suite: DELETE v1_key

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Generate a key to delete
        const addressStr = await generateTestKey(client, walletHandleToken)

        // Verify key exists
        const listBefore = await client.listKeysInWallet({ walletHandleToken })
        expect(listBefore.addresses.map((a) => a.toString())).toContain(addressStr)

        // Delete the key (returns void)
        await expect(
          client.deleteKey({
            address: Address.fromString(addressStr),
            walletHandleToken,
            walletPassword: TEST_WALLET_PASSWORD,
          }),
        ).resolves.toBeUndefined()

        // Verify key was deleted
        const listAfter = await client.listKeysInWallet({ walletHandleToken })
        expect(listAfter.addresses.map((a) => a.toString())).not.toContain(addressStr)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})