import { generateAccount } from '@algorandfoundation/sdk'
import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { PostKeyImportResponse } from '../src/models/post-key-import-response'
import { PostKeyImportResponseMeta } from '../src/models/post-key-import-response'
import { localnetConfig } from './config'
import { getWalletHandle, releaseWalletHandle } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v1_key_import', () => {
  // Polytest Suite: POST v1_key_import

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Generate a temporary account to import
        const tempAccount = generateAccount()

        const result = await client.importKey({
          walletHandleToken,
          privateKey: tempAccount.sk,
        })

        // Assert response structure
        expectTypeOf(result).toEqualTypeOf<PostKeyImportResponse>()
        const PostKeyImportResponseSchema = modelMetadataToZodSchema(PostKeyImportResponseMeta)
        expect(() => PostKeyImportResponseSchema.parse(result)).not.toThrow()
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})