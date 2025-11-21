import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { GetApplicationBoxes, GetApplicationBoxesMeta } from '../src/models/get-application-boxes'
import { config, TEST_APP_ID_BOXES } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v2_applications_APPLICATION-ID_boxes', () => {
  // Polytest Suite: GET v2_applications_APPLICATION-ID_boxes

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(config)

      const result = await client.getApplicationBoxes(TEST_APP_ID_BOXES)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<GetApplicationBoxes>()
      const GetApplicationBoxesSchema = modelMetadataToZodSchema(GetApplicationBoxesMeta)
      expect(() => GetApplicationBoxesSchema.parse(result)).not.toThrow()
    })

    // TODO: the max param doesn't seem to work in the api. Needs to be fixed.
    test.skip('Request with max parameter', async () => {
      const client = new AlgodClient(config)

      const result = await client.getApplicationBoxes(TEST_APP_ID_BOXES, { max: 10 })

      expect(result).toMatchSnapshot()
    })
  })
})
