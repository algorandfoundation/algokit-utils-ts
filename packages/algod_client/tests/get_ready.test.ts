import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config } from './config'

describe('GET ready', () => {
  // Polytest Suite: GET ready

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      // getReady returns void when node is caught up
      const result = await client.getReady()

      expect(result).toBeUndefined()
    })
  })
})
