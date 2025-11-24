import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { PostKeyListResponse } from '../src/models/post-key-list-response'
import { PostKeyListResponseMeta } from '../src/models/post-key-list-response'
import { localnetConfig } from './config'
import { generateTestKey, getWalletHandle, releaseWalletHandle } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v1_key_list', () => {
  // Polytest Suite: POST v1_key_list

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Generate at least one key
        await generateTestKey(client, walletHandleToken)

        const result = await client.listKeysInWallet({
          walletHandleToken,
        })

        // Assert response structure
        expectTypeOf(result).toEqualTypeOf<PostKeyListResponse>()
        const PostKeyListResponseSchema = modelMetadataToZodSchema(PostKeyListResponseMeta)
        expect(() => PostKeyListResponseSchema.parse(result)).not.toThrow()
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})