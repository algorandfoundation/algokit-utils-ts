import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { localnetConfig } from './config'

describe('DELETE v2_ledger_sync', () => {
  // Polytest Suite: DELETE v2_ledger_sync

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // Skipped: The DELETE /v2/ledger/sync endpoint requires algod to run in follower mode.
    // Standard localnet does not have follower mode enabled by default.
    // To enable follower mode: algod -f -d <data_dir>
    test.skip('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      // First set a sync round
      await client.setSyncRound(2000)

      // Verify it was set
      const beforeUnset = await client.getSyncRound()
      expect(beforeUnset.round).toBe(2000n)

      // Unset it (DELETE)
      const result = await client.unsetSyncRound()

      // Should return void (undefined)
      expect(result).toMatchSnapshot()
      expect(result).toBeUndefined()

      // Verify it was unset (should return to 0)
      const afterUnset = await client.getSyncRound()
      expect(afterUnset.round).toBe(0n)
    })
  })
})