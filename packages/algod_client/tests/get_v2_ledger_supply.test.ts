import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { config } from './config'

describe('GET v2_ledger_supply', () => {
  // Polytest Suite: GET v2_ledger_supply

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.supply()

      expect(result).toMatchSnapshot()
    })
  })
})
