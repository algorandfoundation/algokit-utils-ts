import {
  encodeSignedTransaction,
  encodeTransaction,
  type SignedTransaction,
  type Transaction,
  TransactionType,
} from '@algorandfoundation/algokit-transact'
import * as ed from '@noble/ed25519'
import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { RawTransaction, RawTransactionMeta } from '../src/models/raw-transaction'
import { ACCOUNT_A_MNEMONIC, getAccount, localnetConfig } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v2_transactions', () => {
  // Polytest Suite: POST v2_transactions

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      // Get funded test account
      const account = await getAccount(client, ACCOUNT_A_MNEMONIC)

      // Get transaction params
      const params = await client.getTransactionParams()

      // Create payment transaction (send to self, 0 amount)
      const txn: Transaction = {
        type: TransactionType.Payment,
        sender: account.addr.toString(),
        payment: {
          receiver: account.addr.toString(),
          amount: 0n,
        },
        firstValid: params.firstValid,
        lastValid: params.lastValid,
        genesisHash: params.genesisHash,
        genesisId: params.genesisId,
        fee: params.minFee,
      }

      // Sign transaction
      const encodedTxn = encodeTransaction(txn)
      const signature = await ed.signAsync(encodedTxn, account.sk.slice(0, 32))
      const signedTxn: SignedTransaction = {
        txn,
        signature,
      }

      // Send transaction
      const result = await client.sendRawTransaction(encodeSignedTransaction(signedTxn))

      // Assert response structure
      expectTypeOf(result).toEqualTypeOf<RawTransaction>()
      const RawTransactionSchema = modelMetadataToZodSchema(RawTransactionMeta)
      expect(() => RawTransactionSchema.parse(result)).not.toThrow()
    })
  })
})
