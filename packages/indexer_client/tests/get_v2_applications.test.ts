import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config } from './config'
import { ApplicationsResponse } from './schemas'

describe('GET v2_applications', () => {
  // Polytest Suite: GET v2_applications

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.searchForApplications({ limit: 1 })

      ApplicationsResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})