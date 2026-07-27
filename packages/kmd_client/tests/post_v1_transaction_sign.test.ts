import { Address } from '@algorandfoundation/algokit-common'
import { AlgodClient } from '@algorandfoundation/algokit-algod-client'
import { Transaction, TransactionType } from '@algorandfoundation/algokit-transact'
import { describe, test } from 'vitest'
import { KmdClient } from '../src/client'
import { localnetAlgodConfig, localnetConfig, TEST_WALLET_PASSWORD } from './config'
import { generateTestKey, getWalletHandle, releaseWalletHandle } from './fixtures'
import { SignTransactionResponse } from './schemas'

describe('POST v1_transaction_sign', () => {
  // Polytest Suite: POST v1_transaction_sign

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new KmdClient(localnetConfig)
      const algodClient = new AlgodClient(localnetAlgodConfig)
      const { walletHandleToken } = await getWalletHandle(client)

      try {
        // Generate a key
        const addressStr = await generateTestKey(client, walletHandleToken)

        // Get suggested params from algod
        const suggestedParams = await algodClient.suggestedParams()

        // Create a simple payment transaction
        const transaction = new Transaction({
          type: TransactionType.Payment,
          sender: Address.fromString(addressStr),
          firstValid: suggestedParams.firstValid,
          lastValid: suggestedParams.lastValid,
          genesisHash: suggestedParams.genesisHash,
          genesisId: suggestedParams.genesisId,
          payment: {
            receiver: Address.fromString(addressStr), // Self-payment
            amount: 0n,
          },
        })

        // Sign the transaction
        const result = await client.signTransaction({
          walletHandleToken,
          transaction,
          walletPassword: TEST_WALLET_PASSWORD,
        })

        SignTransactionResponse.parse(result)
      } finally {
        await releaseWalletHandle(client, walletHandleToken)
      }
    })
  })
})