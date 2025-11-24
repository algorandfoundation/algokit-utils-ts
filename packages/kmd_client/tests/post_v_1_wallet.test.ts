import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { PostWalletResponse } from '../src/models/post-wallet-response'
import { PostWalletResponseMeta } from '../src/models/post-wallet-response'
import { localnetConfig, TEST_WALLET_PASSWORD, TEST_WALLET_DRIVER } from './config'
import { generateWalletName } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v1_wallet', () => {
  // Polytest Suite: POST v1_wallet

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)

      const result = await client.createWallet({
        walletName: generateWalletName(),
        walletPassword: TEST_WALLET_PASSWORD,
        walletDriverName: TEST_WALLET_DRIVER,
      })

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<PostWalletResponse>()
      const PostWalletResponseSchema = modelMetadataToZodSchema(PostWalletResponseMeta)
      expect(() => PostWalletResponseSchema.parse(result)).not.toThrow()
    })
  })
})