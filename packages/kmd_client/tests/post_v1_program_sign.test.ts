import { Address } from '@algorandfoundation/algokit-common'
import { Buffer } from 'buffer'
import { AlgodClient } from '@algorandfoundation/algokit-algod-client'
import { describe, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetAlgodConfig, localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { generateTestKey, getWalletHandle, releaseWalletHandle } from './fixtures'
import { SignProgramResponse } from './schemas'

describe('POST v1_program_sign', () => {
  // Polytest Suite: POST v1_program_sign

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const algodClient = new AlgodClient(localnetAlgodConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Generate a key
        const addressStr = await generateTestKey(client, walletHandleToken)

        // Compile a simple TEAL program (always approves)
        const tealSource = '#pragma version 8\nint 1'
        const compileResult = await algodClient.tealCompile(tealSource)

        // Decode base64 result to Uint8Array
        const programBytes = new Uint8Array(Buffer.from(compileResult.result, 'base64'))

        // Sign the program
        const result = await client.signProgram({
          walletHandleToken,
          address: Address.fromString(addressStr),
          program: programBytes,
          walletPassword: TEST_WALLET_PASSWORD,
        })

        SignProgramResponse.parse(result)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})