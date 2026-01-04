import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { localnetConfig } from './config'

describe('POST v2_ledger_sync_ROUND', () => {
  // Polytest Suite: POST v2_ledger_sync_ROUND

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // Skipped: The POST /v2/ledger/sync/{round} endpoint requires algod to run in follower mode.
    // Standard localnet does not have follower mode enabled by default.
    test.skip('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      // Set sync round to 1000
      const result = await client.setSyncRound(1000)

      // Should return void (undefined)
      expect(result).toBeUndefined()
    })
  })
})
