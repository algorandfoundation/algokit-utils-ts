import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { PostWalletInitResponse } from '../src/models/post-wallet-init-response'
import { PostWalletInitResponseMeta } from '../src/models/post-wallet-init-response'
import { localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { createTestWallet } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v1_wallet_init', () => {
  // Polytest Suite: POST v1_wallet_init

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)

      // Create a wallet first
      const { walletId } = await createTestWallet(client, TEST_WALLET_PASSWORD)

      const result = await client.initWalletHandleToken({
        walletId,
        walletPassword: TEST_WALLET_PASSWORD,
      })

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<PostWalletInitResponse>()
      const PostWalletInitResponseSchema = modelMetadataToZodSchema(PostWalletInitResponseMeta)
      expect(() => PostWalletInitResponseSchema.parse(result)).not.toThrow()
    })
  })
})