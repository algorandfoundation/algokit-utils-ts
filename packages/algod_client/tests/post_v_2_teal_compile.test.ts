import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { TealCompile, TealCompileMeta } from '../src/models/teal-compile'
import { localnetConfig } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v2_teal_compile', () => {
  // Polytest Suite: POST v2_teal_compile

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      const tealSource = `#pragma version 8
int 1
return`

      const result = await client.tealCompile(tealSource)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<TealCompile>()
      const TealCompileSchema = modelMetadataToZodSchema(TealCompileMeta)
      expect(() => TealCompileSchema.parse(result)).not.toThrow()
    })
  })
})
