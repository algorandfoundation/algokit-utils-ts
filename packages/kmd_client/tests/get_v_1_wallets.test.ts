import { describe, expect, expectTypeOf, test } from 'vitest'
import { KmdClient } from '../src/client'
import type { GetWalletsResponse } from '../src/models/get-wallets-response'
import { GetWalletsResponseMeta } from '../src/models/get-wallets-response'
import { localnetConfig } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('GET v1_wallets', () => {
  // Polytest Suite: GET v1_wallets

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)

      const result = await client.listWallets()

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<GetWalletsResponse>()
      const GetWalletsResponseSchema = modelMetadataToZodSchema(GetWalletsResponseMeta)
      expect(() => GetWalletsResponseSchema.parse(result)).not.toThrow()
    })
  })
})