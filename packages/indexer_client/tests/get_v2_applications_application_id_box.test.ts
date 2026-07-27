import { describe, expect, test } from 'vitest'
import { IndexerClient } from '../src'
import { config, TEST_APP_ID_WITH_BOXES, TEST_BOX_NAME } from './config'
import { Box } from './schemas'

describe('GET v2_applications_APPLICATION-ID_box', () => {
  // Polytest Suite: GET v2_applications_APPLICATION-ID_box

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new IndexerClient(config)

      // TEST_BOX_NAME is base64 encoded with 'b64:' prefix, decode it to Uint8Array
      const boxNameBase64 = TEST_BOX_NAME.replace(/^b64:/, '')
      const boxName = new Uint8Array(Buffer.from(boxNameBase64, 'base64'))

      const result = await client.lookupApplicationBoxByIdAndName(TEST_APP_ID_WITH_BOXES, boxName)

      Box.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})