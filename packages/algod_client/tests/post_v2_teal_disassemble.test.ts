import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { localnetConfig } from './config'
import { DisassembleResponse } from './schemas'

describe('POST v2_teal_disassemble', () => {
  // Polytest Suite: POST v2_teal_disassemble

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      const tealSource = `#pragma version 8
int 1
return`

      // First compile to get program bytes
      const compiled = await client.tealCompile(tealSource)

      // Decode base64 to bytes
      const programBytes = Buffer.from(compiled.result, 'base64')

      // Disassemble the program bytes
      const result = await client.tealDisassemble(programBytes)

      DisassembleResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
