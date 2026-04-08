import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config } from './config'
import { AssetsResponse } from './schemas'

describe('GET v2_assets', () => {
  // Polytest Suite: GET v2_assets

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.searchForAssets({ limit: 1 })

      AssetsResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})