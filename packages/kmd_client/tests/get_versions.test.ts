import { describe, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetConfig } from './config'
import { VersionsResponse } from './schemas'

describe('GET versions', () => {
  // Polytest Suite: GET versions

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)

      const result = await client.getVersion()

      VersionsResponse.parse(result)
    })
  })
})