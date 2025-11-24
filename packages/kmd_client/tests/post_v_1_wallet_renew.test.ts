import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { PostWalletRenewResponse } from '../src/models/post-wallet-renew-response'
import { PostWalletRenewResponseMeta } from '../src/models/post-wallet-renew-response'
import { localnetConfig } from './config'
import { getWalletHandle, releaseWalletHandle } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v1_wallet_renew', () => {
  // Polytest Suite: POST v1_wallet_renew

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        const result = await client.renewWalletHandleToken({
          walletHandleToken,
        })

        // Assert response structure
        expectTypeOf(result).toEqualTypeOf<PostWalletRenewResponse>()
        const PostWalletRenewResponseSchema = modelMetadataToZodSchema(PostWalletRenewResponseMeta)
        expect(() => PostWalletRenewResponseSchema.parse(result)).not.toThrow()
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})