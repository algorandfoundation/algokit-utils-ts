import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { localnetConfig } from './config'

describe('DELETE v2_ledger_sync', () => {
  // Polytest Suite: DELETE v2_ledger_sync

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // Skipped: The DELETE /v2/ledger/sync endpoint requires algod to run in follower mode.
    // Standard localnet does not have follower mode enabled by default.
    test.skip('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      // Unset sync round
      const result = await client.unsetSyncRound()

      // Should return void (undefined)
      expect(result).toBeUndefined()
    })
  })
})
