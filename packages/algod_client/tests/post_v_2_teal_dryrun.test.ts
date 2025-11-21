import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { TealDryrun, TealDryrunMeta } from '../src/models/teal-dryrun'
import { localnetConfig } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v2_teal_dryrun', () => {
  // Polytest Suite: POST v2_teal_dryrun

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      const result = await client.tealDryrun({
        txns: [],
        accounts: [],
        apps: [],
        protocolVersion: '',
        round: 0n,
        latestTimestamp: 0,
        sources: [],
      })

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<TealDryrun>()
      const TealDryrunSchema = modelMetadataToZodSchema(TealDryrunMeta)
      expect(() => TealDryrunSchema.parse(result)).not.toThrow()
    })
  })
})
