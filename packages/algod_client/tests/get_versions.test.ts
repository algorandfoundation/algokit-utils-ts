import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { config } from './config'

describe('GET versions', () => {
  // Polytest Suite: GET versions

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.version()

      expect(result).toMatchSnapshot()
    })
  })
})
