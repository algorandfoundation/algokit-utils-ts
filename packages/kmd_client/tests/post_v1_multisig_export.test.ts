import { Address } from '@algorandfoundation/algokit-common'
import { describe, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig } from './config'
import { createTestMultisig, getWalletHandle, releaseWalletHandle } from './fixtures'
import { ExportMultisigResponse } from './schemas'

describe('POST v1_multisig_export', () => {
  // Polytest Suite: POST v1_multisig_export

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Create a multisig first
        const { multisigAddress } = await createTestMultisig(client, walletHandleToken)

        const result = await client.exportMultisig({
          walletHandleToken,
          address: Address.fromString(multisigAddress),
        })

        ExportMultisigResponse.parse(result)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})
