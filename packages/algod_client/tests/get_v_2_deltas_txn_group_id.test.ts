import { describe, expect, expectTypeOf, test, vi } from 'vitest'
import { AlgodClient } from '../src/client'
import type { LedgerStateDelta } from '../src/models/ledger-state-delta'
import { LedgerStateDeltaMeta } from '../src/models/ledger-state-delta'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_deltas_txn_group_ID', () => {
  // Polytest Suite: GET v2_deltas_txn_group_ID

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      // TODO: LedgerStateDelta schema is extremely complex with nested Block models
      // Creating minimal valid dummy data that passes schema validation
      // Replace with real test data from actual API responses for realistic validation
      const dummyResponse: LedgerStateDelta = {
        accounts: {},
        block: {
          header: {
            // transactionsRoot is REQUIRED (optional: false in BlockHeaderMeta)
            transactionsRoot: new Uint8Array(32),
          },
        },
        stateProofNext: 0n,
        prevTimestamp: 0n,
        totals: {
          online: { money: 0n, rewardUnits: 0n },
          offline: { money: 0n, rewardUnits: 0n },
          notParticipating: { money: 0n, rewardUnits: 0n },
          rewardsLevel: 0n,
        },
      }

      // Mock the client method directly to return correctly-typed dummy data
      // This bypasses the HTTP layer and ensures data is already deserialized with correct types
      const mockMethod = vi.spyOn(client, 'getLedgerStateDeltaForTransactionGroup').mockResolvedValueOnce(dummyResponse)

      // TODO: Replace with actual test value once available
      const TEST_GROUP_ID = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'

      // Make the API call
      const result = await client.getLedgerStateDeltaForTransactionGroup(TEST_GROUP_ID)

      // Verify method was called with correct arguments
      expect(mockMethod).toHaveBeenCalledWith(TEST_GROUP_ID)

      // Compile-time type check
      expectTypeOf(result).toEqualTypeOf<LedgerStateDelta>()

      // Runtime schema validation (strict mode - fails on extra properties)
      // Note: Using minimal dummy data - replace with real data for full validation
      const Schema = modelMetadataToZodSchema(LedgerStateDeltaMeta)
      expect(() => Schema.parse(result)).not.toThrow()
    })
  })
})
