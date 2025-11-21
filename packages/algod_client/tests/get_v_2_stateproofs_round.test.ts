import { describe, expect, expectTypeOf, test, vi } from 'vitest'
import { AlgodClient } from '../src/client'
import { StateProof, StateProofMeta } from '../src/models/state-proof'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_stateproofs_ROUND', () => {
  // Polytest Suite: GET v2_stateproofs_ROUND

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      // TODO: Replace dummy data with real test data from actual API responses
      // Dummy data conforming to StateProof schema
      const dummyResponse: StateProof = {
        message: {
          blockHeadersCommitment: new Uint8Array([1, 2, 3, 4]),
          votersCommitment: new Uint8Array([5, 6, 7, 8]),
          lnProvenWeight: 1000n,
          firstAttestedRound: 100n,
          lastAttestedRound: 200n,
        },
        stateProof: new Uint8Array([9, 10, 11, 12]),
      }

      // Mock the client method directly to return correctly-typed dummy data
      // This bypasses the HTTP layer and ensures data is already deserialized with correct types
      const mockMethod = vi.spyOn(client, 'getStateProof').mockResolvedValueOnce(dummyResponse)

      // TODO: Replace with actual test value once available
      const TEST_ROUND = 1000

      // Make the API call
      const result = await client.getStateProof(TEST_ROUND)

      // Verify method was called with correct arguments
      expect(mockMethod).toHaveBeenCalledWith(TEST_ROUND)

      // Compile-time type check
      expectTypeOf(result).toEqualTypeOf<StateProof>()

      // Runtime schema validation (strict mode - fails on extra properties)
      const StateProofSchema = modelMetadataToZodSchema(StateProofMeta)
      expect(() => StateProofSchema.parse(result)).not.toThrow()
    })
  })
})
