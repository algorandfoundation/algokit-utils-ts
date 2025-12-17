import { describe, expect, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig } from './config'
import { createTestMultisig, getWalletHandle, releaseWalletHandle } from './fixtures'
import { ListMultisigResponse } from './schemas'

describe('POST v1_multisig_list', () => {
  // Polytest Suite: POST v1_multisig_list

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Create a multisig first
        const { multisigAddress } = await createTestMultisig(client, walletHandleToken)

        const result = await client.listMultisig({
          walletHandleToken,
        })

        ListMultisigResponse.parse(result)

        // Verify the multisig is in the list
        expect(result.addresses.map((a) => a.toString())).toContain(multisigAddress)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})