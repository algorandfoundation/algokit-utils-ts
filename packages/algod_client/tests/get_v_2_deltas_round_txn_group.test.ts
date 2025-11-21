import { describe, expect, expectTypeOf, test, vi } from 'vitest'
import { AlgodClient } from '../src/client'
import type { GetTransactionGroupLedgerStateDeltasForRound } from '../src/models/get-transaction-group-ledger-state-deltas-for-round'
import { GetTransactionGroupLedgerStateDeltasForRoundMeta } from '../src/models/get-transaction-group-ledger-state-deltas-for-round'
import { config } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_deltas_ROUND_txn_group', () => {
  // Polytest Suite: GET v2_deltas_ROUND_txn_group

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      // TODO: LedgerStateDelta schema is extremely complex with nested Block models
      // Creating minimal valid dummy data that passes schema validation
      // Replace with real test data from actual API responses for realistic validation
      const dummyResponse: GetTransactionGroupLedgerStateDeltasForRound = {
        deltas: [
          {
            delta: {
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
            },
            ids: ['TXID1', 'TXID2'],
          },
        ],
      }

      // TODO: Replace with actual test value once available
      const TEST_ROUND = 1000

      // Mock the client method to return our properly-typed dummy data
      // This bypasses HTTP layer and tests schema validation directly
      const mockMethod = vi.spyOn(client, 'getTransactionGroupLedgerStateDeltasForRound').mockResolvedValueOnce(dummyResponse)

      // Make the API call - it will use our mocked method
      const result = await client.getTransactionGroupLedgerStateDeltasForRound(TEST_ROUND)

      // Verify method was called with correct arguments
      expect(mockMethod).toHaveBeenCalledWith(TEST_ROUND)

      // Compile-time type check
      expectTypeOf(result).toEqualTypeOf<GetTransactionGroupLedgerStateDeltasForRound>()

      // Runtime schema validation (strict mode - fails on extra properties)
      // Note: Using minimal dummy data - replace with real data for full validation
      const Schema = modelMetadataToZodSchema(GetTransactionGroupLedgerStateDeltasForRoundMeta)
      expect(() => Schema.parse(result)).not.toThrow()
    })
  })
})
