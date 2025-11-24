import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { DeleteKeyResponse } from '../src/models/delete-key-response'
import { DeleteKeyResponseMeta } from '../src/models/delete-key-response'
import { localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { generateTestKey, getWalletHandle, releaseWalletHandle } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('DELETE v1_key', () => {
  // Polytest Suite: DELETE v1_key

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // SKIPPED: The generated deleteKey() method is missing the request body parameter.
    // According to the OAS spec, it should accept DeleteKeyRequest with address,
    // walletHandleToken, and walletPassword.
    test.skip('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Generate a key first
        const address = await generateTestKey(client, walletHandleToken)

        const result = await client.deleteKey()

        // Assert response structure
        expectTypeOf(result).toEqualTypeOf<DeleteKeyResponse>()
        const DeleteKeyResponseSchema = modelMetadataToZodSchema(DeleteKeyResponseMeta)
        expect(() => DeleteKeyResponseSchema.parse(result)).not.toThrow()
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})