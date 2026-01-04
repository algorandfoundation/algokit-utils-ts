import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config } from './config'

describe('GET health', () => {
  // Polytest Suite: GET health

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      // healthCheck returns void on success
      const result = await client.healthCheck()

      expect(result).toBeUndefined()
    })
  })
})
