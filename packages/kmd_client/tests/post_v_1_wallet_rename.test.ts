import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { PostWalletRenameResponse } from '../src/models/post-wallet-rename-response'
import { PostWalletRenameResponseMeta } from '../src/models/post-wallet-rename-response'
import { localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { generateWalletName, getWalletHandle, releaseWalletHandle } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v1_wallet_rename', () => {
  // Polytest Suite: POST v1_wallet_rename

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken, walletId } = await getWalletHandle(client)

      try {
        const newWalletName = generateWalletName()
        const result = await client.renameWallet({
          walletId,
          walletPassword: TEST_WALLET_PASSWORD,
          walletName: newWalletName,
        })

        // Assert response structure
        expectTypeOf(result).toEqualTypeOf<PostWalletRenameResponse>()
        const PostWalletRenameResponseSchema = modelMetadataToZodSchema(PostWalletRenameResponseMeta)
        expect(() => PostWalletRenameResponseSchema.parse(result)).not.toThrow()
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})