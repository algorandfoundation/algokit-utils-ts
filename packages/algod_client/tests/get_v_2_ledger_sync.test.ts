import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { config } from './config'

describe('GET v2_ledger_sync', () => {
  // Polytest Suite: GET v2_ledger_sync

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getSyncRound()

      expect(result).toMatchSnapshot()
    })
  })
})