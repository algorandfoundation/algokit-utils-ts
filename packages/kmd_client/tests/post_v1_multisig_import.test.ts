import { describe, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig, MULTISIG_KEY_COUNT, MULTISIG_THRESHOLD, MULTISIG_VERSION } from './config'
import { addressToPublicKey, generateMultipleKeys, getWalletHandle, releaseWalletHandle } from './fixtures'
import { ImportMultisigResponse } from './schemas'

describe('POST v1_multisig_import', () => {
  // Polytest Suite: POST v1_multisig_import

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Generate keys for multisig
        const addresses = await generateMultipleKeys(client, walletHandleToken, MULTISIG_KEY_COUNT)
        const publicKeys = addresses.map((addr) => addressToPublicKey(addr))

        const result = await client.importMultisig({
          walletHandleToken,
          multisigVersion: MULTISIG_VERSION,
          threshold: MULTISIG_THRESHOLD,
          publicKeys: publicKeys,
        })

        ImportMultisigResponse.parse(result)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})