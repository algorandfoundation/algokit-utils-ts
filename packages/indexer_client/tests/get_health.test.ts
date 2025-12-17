import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config } from './config'
import { HealthCheck } from './schemas'

describe('GET health', () => {
  // Polytest Suite: GET health

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.makeHealthCheck()

      HealthCheck.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})