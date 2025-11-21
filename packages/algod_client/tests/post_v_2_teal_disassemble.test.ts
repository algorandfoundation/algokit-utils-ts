import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { TealDisassemble, TealDisassembleMeta } from '../src/models/teal-disassemble'
import { localnetConfig } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v2_teal_disassemble', () => {
  // Polytest Suite: POST v2_teal_disassemble

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      const tealSource = `#pragma version 8
int 1
return`

      const compiled = await client.tealCompile(tealSource)

      const programBytes = Buffer.from(compiled.result, 'base64')

      const result = await client.tealDisassemble(programBytes)

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<TealDisassemble>()
      const TealDisassembleSchema = modelMetadataToZodSchema(TealDisassembleMeta)
      expect(() => TealDisassembleSchema.parse(result)).not.toThrow()
    })
  })
})
