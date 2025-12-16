import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config } from './config'
import { Version } from './schemas'

describe('GET versions', () => {
  // Polytest Suite: GET versions

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    // Skipping this test because there is mismtach between the oas schema and what is returned for
    // genisisHashB64. The oas schema is a base64 encoded string, but the
    // returned value is a Uint8Array.
    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getVersion()

      // Validate response with Zod schema - throws if invalid
      Version.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
