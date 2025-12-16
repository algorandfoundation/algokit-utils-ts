import { seedFromMnemonic } from '@algorandfoundation/algokit-algo25'
import { Address } from '@algorandfoundation/algokit-common'
import {
  encodeSignedTransaction,
  encodeTransaction,
  Transaction,
  TransactionType,
  type SignedTransaction,
} from '@algorandfoundation/algokit-transact'
import * as ed from '@noble/ed25519'
import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { localnetConfig, TEST_ACCOUNT_MNEMONIC } from './config'
import { PostTransactionsResponse } from './schemas'

describe('POST v2_transactions', () => {
  // Polytest Suite: POST v2_transactions

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      // Get account from mnemonic
      const seed = seedFromMnemonic(TEST_ACCOUNT_MNEMONIC)
      const publicKey = await ed.getPublicKeyAsync(seed)
      const address = new Address(publicKey)

      // Get transaction params
      const params = await client.suggestedParams()

      // Create payment transaction (send to self, 0 amount)
      const txn = new Transaction({
        type: TransactionType.Payment,
        sender: address,
        payment: {
          receiver: address,
          amount: 0n,
        },
        fee: params.minFee,
        firstValid: params.firstValid,
        lastValid: params.lastValid,
        genesisHash: params.genesisHash,
        genesisId: params.genesisId,
      })

      // Sign transaction
      const signature = await ed.signAsync(encodeTransaction(txn), seed)
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
