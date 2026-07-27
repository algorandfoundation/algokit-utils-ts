import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config } from './config'
import { BlockHeadersResponse } from './schemas'

describe('GET v2_block-headers', () => {
  // Polytest Suite: GET v2_block-headers

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      const result = await client.searchForBlockHeaders({ limit: 1 })

      BlockHeadersResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})