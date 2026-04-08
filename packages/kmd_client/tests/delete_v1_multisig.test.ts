import { Address } from '@algorandfoundation/algokit-common'
import { describe, expect, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { createTestMultisig, getWalletHandle, releaseWalletHandle } from './fixtures'

describe('DELETE v1_multisig', () => {
  // Polytest Suite: DELETE v1_multisig

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Create a multisig first
        const { multisigAddress } = await createTestMultisig(client, walletHandleToken)

        // Verify multisig exists
        const listBefore = await client.listMultisig({ walletHandleToken })
        expect(listBefore.addresses.map((a) => a.toString())).toContain(multisigAddress)

        // Delete the multisig (returns void)
        await expect(
          client.deleteMultisig({
            address: Address.fromString(multisigAddress),
            walletHandleToken,
            walletPassword: TEST_WALLET_PASSWORD,
          }),
        ).resolves.toBeUndefined()

        // Verify multisig was deleted
        const listAfter = await client.listMultisig({ walletHandleToken })
        expect(listAfter.addresses.map((a) => a.toString())).not.toContain(multisigAddress)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})