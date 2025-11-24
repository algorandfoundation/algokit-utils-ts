import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { PostWalletInfoResponse } from '../src/models/post-wallet-info-response'
import { PostWalletInfoResponseMeta } from '../src/models/post-wallet-info-response'
import { localnetConfig } from './config'
import { getWalletHandle, releaseWalletHandle } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v1_wallet_info', () => {
  // Polytest Suite: POST v1_wallet_info

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        const result = await client.getWalletInfo({
          walletHandleToken,
        })

        // Assert response structure
        expectTypeOf(result).toEqualTypeOf<PostWalletInfoResponse>()
        const PostWalletInfoResponseSchema = modelMetadataToZodSchema(PostWalletInfoResponseMeta)
        expect(() => PostWalletInfoResponseSchema.parse(result)).not.toThrow()
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})