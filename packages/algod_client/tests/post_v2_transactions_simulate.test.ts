import { Address } from '@algorandfoundation/algokit-common'
import { Transaction, TransactionType, type SignedTransaction } from '@algorandfoundation/algokit-transact'
import { describe, expect, test } from 'vitest'
import { AlgodClient } from '../src'
import { localnetConfig, TEST_ADDRESS } from './config'
import { SimulateResponse } from './schemas'

describe('POST v2_transactions_simulate', () => {
  // Polytest Suite: POST v2_transactions_simulate

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      const params = await client.suggestedParams()
      const address = Address.fromString(TEST_ADDRESS)

      // Create an unsigned transaction (signature not required with allowEmptySignatures)
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

      const signedTxn: SignedTransaction = { txn }

      const result = await client.simulateTransactions({
        txnGroups: [{ txns: [signedTxn] }],
        allowEmptySignatures: true,
      })

      SimulateResponse.parse(result)
      expect(result).toMatchSnapshot({
        lastRound: expect.any(BigInt),
        txnGroups: [
          {
            failureMessage: expect.any(String),
            txnResults: [
              {
                txnResult: {
                  txn: {
                    txn: {
                      firstValid: expect.any(BigInt),
                      lastValid: expect.any(BigInt),
                    },
                  },
                },
              },
            ],
          },
        ],
      })
    })
  })
})
