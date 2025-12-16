import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { localnetConfig } from './config'
import { CompileResponse } from './schemas'

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

      CompileResponse.parse(result)
      expect(result).toMatchSnapshot()
    })
  })
})
