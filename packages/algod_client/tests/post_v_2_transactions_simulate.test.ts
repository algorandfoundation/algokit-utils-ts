import { type SignedTransaction, TransactionType } from '@algorandfoundation/algokit-transact'
import { describe, expect, expectTypeOf, test } from 'vitest'
import { AlgodClient } from '../src/client'
import { SimulateTransaction, SimulateTransactionMeta } from '../src/models/simulate-transaction'
import { localnetConfig, TEST_ADDRESS } from './config'
import { modelMetadataToZodSchema } from './zod-utils'

describe('POST v2_transactions_simulate', () => {
  // Polytest Suite: POST v2_transactions_simulate

  describe('Common Tests', () => {
    // Polytest Group: Common Tests

    test('Basic request and response validation', async () => {
      const client = new AlgodClient(localnetConfig)

      const params = await client.getTransactionParams()

      const signedTxn: SignedTransaction = {
        txn: {
          type: TransactionType.Payment,
          sender: TEST_ADDRESS,
          payment: {
            receiver: TEST_ADDRESS,
            amount: 0n,
          },
          fee: params.minFee,
          firstValid: params.firstValid,
          lastValid: params.lastValid,
          genesisHash: params.genesisHash,
          genesisId: params.genesisId,
        },
      }

      const simulateRequest = {
        txnGroups: [
          {
            txns: [signedTxn],
          },
        ],
        allowEmptySignatures: true,
      }

      const result = await client.simulateTransaction(simulateRequest)

      // Compile-time type check
      expectTypeOf(result).toEqualTypeOf<SimulateTransaction>()

      // Runtime schema validation (strict mode - fails on extra properties)
      const SimulateTransactionSchema = modelMetadataToZodSchema(SimulateTransactionMeta)
      expect(() => SimulateTransactionSchema.parse(result)).not.toThrow()
    })
  })
})
