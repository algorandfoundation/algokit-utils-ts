import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config } from './config'
import { SuggestedParams } from './schemas'

describe('GET v2_transactions_params', () => {
  // Polytest Suite: GET v2_transactions_params

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.suggestedParams()

      SuggestedParams.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
