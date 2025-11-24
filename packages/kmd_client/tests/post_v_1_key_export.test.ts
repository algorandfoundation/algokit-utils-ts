import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { PostKeyExportResponse } from '../src/models/post-key-export-response'
import { PostKeyExportResponseMeta } from '../src/models/post-key-export-response'
import { localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { generateTestKey, getWalletHandle, releaseWalletHandle } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v1_key_export', () => {
  // Polytest Suite: POST v1_key_export

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Generate a key first
        const address = await generateTestKey(client, walletHandleToken)

        const result = await client.exportKey({
          walletHandleToken,
          address,
          walletPassword: TEST_WALLET_PASSWORD,
        })

        // Assert response structure
        expectTypeOf(result).toEqualTypeOf<PostKeyExportResponse>()
        const PostKeyExportResponseSchema = modelMetadataToZodSchema(PostKeyExportResponseMeta)
        expect(() => PostKeyExportResponseSchema.parse(result)).not.toThrow()
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})