import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { DeleteMultisigResponse } from '../src/models/delete-multisig-response'
import { DeleteMultisigResponseMeta } from '../src/models/delete-multisig-response'
import { localnetConfig } from './config'
import { createTestMultisig, getWalletHandle, releaseWalletHandle } from './fixtures'
import { modelMetadataToZodSchema } from './zod-utils'

describe('DELETE v1_multisig', () => {
  // Polytest Suite: DELETE v1_multisig

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // SKIPPED: The generated deleteMultisig() method is missing the request body parameter.
    // According to the OAS spec, it should accept DeleteMultisigRequest with address,
    // walletHandleToken, and walletPassword.
    test.skip('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Create a multisig first
        const { multisigAddress } = await createTestMultisig(client, walletHandleToken)

        const result = await client.deleteMultisig()

        // Assert response structure
        expectTypeOf(result).toEqualTypeOf<DeleteMultisigResponse>()
        const DeleteMultisigResponseSchema = modelMetadataToZodSchema(DeleteMultisigResponseMeta)
        expect(() => DeleteMultisigResponseSchema.parse(result)).not.toThrow()
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})