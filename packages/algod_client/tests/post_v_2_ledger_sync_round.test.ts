import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { localnetConfig } from './config'

describe('POST v2_ledger_sync_ROUND', () => {
  // Polytest Suite: POST v2_ledger_sync_ROUND

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // Skipped: The POST /v2/ledger/sync/{round} endpoint requires algod to run in follower mode.
    // Standard localnet does not have follower mode enabled by default.
    // To enable follower mode: algod -f -d <data_dir>
    test.skip('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      // Set sync round to 1000
      const result = await client.setSyncRound(1000)

      // Should return void (undefined)
      expect(result).toMatchSnapshot()
      expect(result).toBeUndefined()
    })

    // Skipped: The POST /v2/ledger/sync/{round} endpoint requires algod to run in follower mode.
    // Standard localnet does not have follower mode enabled by default.
    // To enable follower mode: algod -f -d <data_dir>
    test.skip('Set sync round and verify with GET', async () => {
      const client = new AlgodClient(localnetConfig)

      // Set sync round to 5000
      await client.setSyncRound(5000)

      // Verify it was set by reading it back
      const syncRound = await client.getSyncRound()
      expect(syncRound.round).toBe(5000n)
    })

    // Skipped: The POST /v2/ledger/sync/{round} endpoint requires algod to run in follower mode.
    // Standard localnet does not have follower mode enabled by default.
    // To enable follower mode: algod -f -d <data_dir>
    test.skip('Set sync round with bigint', async () => {
      const client = new AlgodClient(localnetConfig)

      // Test with bigint parameter
      await client.setSyncRound(10000n)

      // Verify it was set
      const syncRound = await client.getSyncRound()
      expect(syncRound.round).toBe(10000n)
    })
  })
})