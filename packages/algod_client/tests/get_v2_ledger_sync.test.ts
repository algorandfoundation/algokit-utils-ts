import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { localnetConfig } from './config'
import { GetSyncRoundResponse } from './schemas'

describe('GET v2_ledger_sync', () => {
  // Polytest Suite: GET v2_ledger_sync

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // Skipped: The GET /v2/ledger/sync endpoint requires algod to run in follower mode.
    // Standard localnet does not have follower mode enabled by default.
    test.skip('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      const result = await client.syncRound()

      GetSyncRoundResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
