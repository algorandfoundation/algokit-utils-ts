import {
  encodeSignedTransaction,
  encodeTransaction,
  Transaction,
  TransactionType,
  type SignedTransaction,
} from '@algorandfoundation/algokit-transact'
import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { localnetConfig } from './config'
import { getLocalNetDefaultAccount } from './fixtures'
import { PostTransactionsResponse } from './schemas'

describe('POST v2_transactions', () => {
  // Polytest Suite: POST v2_transactions

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      // Get funded account from LocalNet default wallet
      const account = await getLocalNetDefaultAccount()

      // Get transaction params
      const params = await client.suggestedParams()

      // Create payment transaction (send to self, 0 amount)
      const txn = new Transaction({
        type: TransactionType.Payment,
        sender: account.address,
        payment: {
          receiver: account.address,
          amount: 0n,
        },
        fee: params.minFee,
        firstValid: params.firstValid,
        lastValid: params.lastValid,
        genesisHash: params.genesisHash,
        genesisId: params.genesisId,
      })

      // Sign transaction
      const signature = await account.sign(encodeTransaction(txn))
      const signedTxn: SignedTransaction = { txn, sig: signature }

      // Send transaction
      const result = await client.sendRawTransaction(encodeSignedTransaction(signedTxn))

      PostTransactionsResponse.parse(result)
      expect(result).toMatchSnapshot({
        txId: expect.any(String),
      })
    })
  })
})
