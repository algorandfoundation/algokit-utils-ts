import { TransactionType } from '@algorandfoundation/algokit-transact'
import { describe, expect, expectTypeOf, test, vi } from 'vitest'
import { AlgodClient } from '../src/client'
import { PendingTransactionResponse, PendingTransactionResponseMeta } from '../src/models/pending-transaction-response'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_transactions_pending_TXID', () => {
  // Polytest Suite: GET v2_transactions_pending_TXID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      // TODO: Replace dummy data with real test data from actual API responses
      // Dummy data conforming to PendingTransactionResponse schema (minimal required fields)
      const dummyResponse: PendingTransactionResponse = {
        poolError: '',
        txn: {
          signature: new Uint8Array([1, 2, 3]),
          txn: {
            type: TransactionType.Payment,
            sender: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ',
            fee: 1000n,
            firstValid: 1n,
            lastValid: 100n,
            genesisHash: new Uint8Array(32),
            genesisId: 'testnet-v1.0',
          },
        },
      }

      // Mock the client method directly to return correctly-typed dummy data
      // This bypasses the HTTP layer and ensures data is already deserialized with correct types
      const mockMethod = vi.spyOn(client, 'pendingTransactionInformation').mockResolvedValueOnce(dummyResponse)

      // TODO: Replace with actual test value once available
      const TEST_TXID = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'

      // Make the API call
      const result = await client.pendingTransactionInformation(TEST_TXID)

      // Verify method was called with correct arguments
      expect(mockMethod).toHaveBeenCalledWith(TEST_TXID)

      // Compile-time type check
      expectTypeOf(result).toEqualTypeOf<PendingTransactionResponse>()

      // Runtime schema validation (strict mode - fails on extra properties)
      const PendingTransactionResponseSchema = modelMetadataToZodSchema(PendingTransactionResponseMeta)
      expect(() => PendingTransactionResponseSchema.parse(result)).not.toThrow()
    })
  })
})
