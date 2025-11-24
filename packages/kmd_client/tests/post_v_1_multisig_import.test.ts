import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { PostMultisigImportResponse } from '../src/models/post-multisig-import-response'
import { PostMultisigImportResponseMeta } from '../src/models/post-multisig-import-response'
import { localnetConfig, MULTISIG_THRESHOLD, MULTISIG_VERSION } from './config'
import { addressToPublicKey, generateMultipleKeys, getWalletHandle, releaseWalletHandle } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v1_multisig_import', () => {
  // Polytest Suite: POST v1_multisig_import

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Generate multiple keys for multisig
        const addresses = await generateMultipleKeys(client, walletHandleToken, 3)
        // Convert to number[] instead of bigint[] - while types say bigint[],
        // the serializer can't handle BigInt and expects numbers (bytes are 0-255)
        const publicKeys = addresses.map((addr) => {
          const pk = addressToPublicKey(addr)
          return Array.from(pk).map((byte) => Number(byte))
        })

        // Types say bigint but runtime expects number - cast to bypass type errors
        const result = await client.importMultisig({
          walletHandleToken,
          multisigVersion: MULTISIG_VERSION as unknown as bigint,
          threshold: MULTISIG_THRESHOLD as unknown as bigint,
          pks: publicKeys as unknown as bigint[][],
        })

        // Assert response structure
        expectTypeOf(result).toEqualTypeOf<PostMultisigImportResponse>()
        const PostMultisigImportResponseSchema = modelMetadataToZodSchema(PostMultisigImportResponseMeta)
        expect(() => PostMultisigImportResponseSchema.parse(result)).not.toThrow()
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})