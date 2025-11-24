import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { PostWalletReleaseResponse } from '../src/models/post-wallet-release-response'
import { PostWalletReleaseResponseMeta } from '../src/models/post-wallet-release-response'
import { localnetConfig } from './config'
import { getWalletHandle } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v1_wallet_release', () => {
  // Polytest Suite: POST v1_wallet_release

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      const result = await client.releaseWalletHandleToken({
        walletHandleToken,
      })

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<PostWalletReleaseResponse>()
      const PostWalletReleaseResponseSchema = modelMetadataToZodSchema(PostWalletReleaseResponseMeta)
      expect(() => PostWalletReleaseResponseSchema.parse(result)).not.toThrow()
    })
  })
})