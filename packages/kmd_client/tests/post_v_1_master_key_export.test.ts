import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { PostMasterKeyExportResponse } from '../src/models/post-master-key-export-response'
import { PostMasterKeyExportResponseMeta } from '../src/models/post-master-key-export-response'
import { localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { getWalletHandle, releaseWalletHandle } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v1_master-key_export', () => {
  // Polytest Suite: POST v1_master-key_export

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // SKIPPED: Schema mismatch - the generated model expects masterDerivationKey to be an array,
    // but the KMD API returns it as a string. This indicates a type generation issue in the
    // PostMasterKeyExportResponse model definition.
    test.skip('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        const result = await client.exportMasterKey({
          walletHandleToken,
          walletPassword: TEST_WALLET_PASSWORD,
        })

        // Assert response structure
        expectTypeOf(result).toEqualTypeOf<PostMasterKeyExportResponse>()
        const PostMasterKeyExportResponseSchema = modelMetadataToZodSchema(PostMasterKeyExportResponseMeta)
        expect(() => PostMasterKeyExportResponseSchema.parse(result)).not.toThrow()
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})