import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { config } from './config'

describe('GET health', () => {
  // Polytest Suite: GET health

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.healthCheck()

      expect(result).toMatchInlineSnapshot(`null`)
    })
  })
})
