import { describe, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { getWalletHandle, releaseWalletHandle } from './fixtures'
import { ExportMasterKeyResponse } from './schemas'

describe('POST v1_master-key_export', () => {
  // Polytest Suite: POST v1_master-key_export

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // SKIPPED: Type mismatch between client model and Zod schema
    // Client returns masterDerivationKey as Uint8Array
    // Zod schema expects object with masterDerivationKey as number[] (z.array(z.number().int()))
    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        const result = await client.exportMasterKey({
          walletHandleToken,
          walletPassword: TEST_WALLET_PASSWORD,
        })

        ExportMasterKeyResponse.parse(result)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})
