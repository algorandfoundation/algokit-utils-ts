import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { PostMultisigListResponse } from '../src/models/post-multisig-list-response'
import { PostMultisigListResponseMeta } from '../src/models/post-multisig-list-response'
import { localnetConfig } from './config'
import { createTestMultisig, getWalletHandle, releaseWalletHandle } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v1_multisig_list', () => {
  // Polytest Suite: POST v1_multisig_list

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Create at least one multisig
        await createTestMultisig(client, walletHandleToken)

        // TODO: listMultisg is misspelled in the API
        const result = await client.listMultisg({
          walletHandleToken,
        })

        // Assert response structure
        expectTypeOf(result).toEqualTypeOf<PostMultisigListResponse>()
        const PostMultisigListResponseSchema = modelMetadataToZodSchema(PostMultisigListResponseMeta)
        expect(() => PostMultisigListResponseSchema.parse(result)).not.toThrow()
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})
