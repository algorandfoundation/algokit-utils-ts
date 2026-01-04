import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config } from './config'
import { SupplyResponse } from './schemas'

describe('GET v2_ledger_supply', () => {
  // Polytest Suite: GET v2_ledger_supply

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.supply()

      SupplyResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
