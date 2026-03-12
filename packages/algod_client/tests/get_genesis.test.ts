import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config } from './config'
import { Genesis } from './schemas'

describe('GET genesis', () => {
  // Polytest Suite: GET genesis

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.genesis()

      Genesis.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
