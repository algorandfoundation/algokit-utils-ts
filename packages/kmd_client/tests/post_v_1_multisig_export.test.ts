import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { PostMultisigExportResponse } from '../src/models/post-multisig-export-response'
import { PostMultisigExportResponseMeta } from '../src/models/post-multisig-export-response'
import { localnetConfig } from './config'
import { createTestMultisig, getWalletHandle, releaseWalletHandle } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v1_multisig_export', () => {
  // Polytest Suite: POST v1_multisig_export

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Create a multisig first
        const { multisigAddress } = await createTestMultisig(client, walletHandleToken)

        const result = await client.exportMultisig({
          walletHandleToken,
          address: multisigAddress,
        })

        // Assert response structure
        expectTypeOf(result).toEqualTypeOf<PostMultisigExportResponse>()
        const PostMultisigExportResponseSchema = modelMetadataToZodSchema(PostMultisigExportResponseMeta)
        expect(() => PostMultisigExportResponseSchema.parse(result)).not.toThrow()
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})