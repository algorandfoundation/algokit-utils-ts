import { AlgodClient } from '@algorandfoundation/algokit-algod-client'
import { Address } from '@algorandfoundation/algokit-common'
import { describe, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetAlgodConfig, localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { createTestMultisig, getWalletHandle, releaseWalletHandle } from './fixtures'
import { SignProgramMultisigResponse } from './schemas'

describe('POST v1_multisig_signprogram', () => {
  // Polytest Suite: POST v1_multisig_signprogram

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const algodClient = new AlgodClient(localnetAlgodConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Create a multisig account
        const { multisigAddress, publicKeys } = await createTestMultisig(client, walletHandleToken)

        // Compile a simple TEAL program (always approves)
        const tealSource = '#pragma version 8\nint 1'
        const compileResult = await algodClient.tealCompile(tealSource)
        const programBytes = new Uint8Array(Buffer.from(compileResult.result, 'base64'))

        // Sign the program with the first key
        const result = await client.signMultisigProgram({
          walletHandleToken,
          address: Address.fromString(multisigAddress),
          program: programBytes,
          publicKey: publicKeys[0],
          walletPassword: TEST_WALLET_PASSWORD,
        })

        SignProgramMultisigResponse.parse(result)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})
