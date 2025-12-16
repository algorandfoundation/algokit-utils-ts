import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { config, TEST_APP_ID_WITH_BOXES, TEST_BOX_NAME } from './config'
import { Box } from './schemas'

// TEST_BOX_NAME is a base64 string prefixed with 'b64:', decode to Uint8Array
const boxNameBytes = Buffer.from(TEST_BOX_NAME.replace(/^b64:/, ''), 'base64')

describe('GET v2_applications_APPLICATION-ID_box', () => {
  // Polytest Suite: GET v2_applications_APPLICATION-ID_box

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getApplicationBoxByName(TEST_APP_ID_WITH_BOXES, boxNameBytes)

      Box.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
