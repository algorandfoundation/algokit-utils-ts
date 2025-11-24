import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { PostKeyResponse } from '../src/models/post-key-response'
import { PostKeyResponseMeta } from '../src/models/post-key-response'
import { localnetConfig } from './config'
import { getWalletHandle, releaseWalletHandle } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v1_key', () => {
  // Polytest Suite: POST v1_key

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        const result = await client.generateKey({
          walletHandleToken,
          displayMnemonic: false,
        })

        // Assert response structure
        expectTypeOf(result).toEqualTypeOf<PostKeyResponse>()
        const PostKeyResponseSchema = modelMetadataToZodSchema(PostKeyResponseMeta)
        expect(() => PostKeyResponseSchema.parse(result)).not.toThrow()
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})