import { Address } from '@algorandfoundation/algokit-common'
import { AlgodClient } from '@algorandfoundation/algokit-algod-client'
import { Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import { describe, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetAlgodConfig, localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { createTestMultisig, getWalletHandle, releaseWalletHandle } from './fixtures'
import { SignMultisigResponse } from './schemas'

describe('POST v1_multisig_sign', () => {
  // Polytest Suite: POST v1_multisig_sign

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const algodClient = new AlgodClient(localnetAlgodConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Create a multisig account
        const { multisigAddress, publicKeys } = await createTestMultisig(client, walletHandleToken)

        // Get suggested params from algod
        const suggestedParams = await algodClient.suggestedParams()

        // Create a simple payment transaction from the multisig address
        const transaction = new Transaction({
          type: TransactionType.Payment,
          sender: Address.fromString(multisigAddress),
          firstValid: suggestedParams.firstValid,
          lastValid: suggestedParams.lastValid,
          genesisHash: suggestedParams.genesisHash,
          genesisId: suggestedParams.genesisId,
          payment: {
            receiver: Address.fromString(multisigAddress), // Self-payment
            amount: 0n,
          },
        })

        // Sign with the first key
        const result = await client.signMultisigTransaction({
          walletHandleToken,
          transaction,
          publicKey: publicKeys[0],
          walletPassword: TEST_WALLET_PASSWORD,
        })

        SignMultisigResponse.parse(result)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})