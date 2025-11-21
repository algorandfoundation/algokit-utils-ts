import { EMPTY_SIGNATURE, Address } from '@algorandfoundation/algokit-common'
import { describe, expect, test } from 'vitest'
import { encodeSignedTransaction } from './signed-transaction'
import {
  Transaction,
  TransactionType,
  encodeTransaction,
  encodeTransactionRaw,
  estimateTransactionSize,
  getTransactionId,
  getTransactionIdRaw,
  validateTransaction,
} from './transaction'

const VALID_ADDRESS_1 = Address.fromString('424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI')

describe('Transaction Validation', () => {
  describe('Core transaction validation', () => {
    test('should throw error when no transaction type specific field is set', () => {
      const transaction: Transaction = {
        type: TransactionType.Payment,
        sender: VALID_ADDRESS_1,
        firstValid: 1000n,
        lastValid: 2000n,
      }

      expect(() => validateTransaction(transaction)).toThrow('No transaction type specific field is set')
    })

    test('should throw error when multiple transaction type specific fields are set', () => {
      const transaction: Transaction = {
        type: TransactionType.Payment,
        sender: VALID_ADDRESS_1,
        firstValid: 1000n,
        lastValid: 2000n,
        payment: {
          amount: 1000n,
          receiver: VALID_ADDRESS_1,
        },
        assetTransfer: {
          assetId: 123n,
          amount: 1000n,
          receiver: VALID_ADDRESS_1,
        },
      }

      expect(() => validateTransaction(transaction)).toThrow('Multiple transaction type specific fields set')
    })

    test('should validate valid payment transaction', () => {
      const transaction: Transaction = {
        type: TransactionType.Payment,
        sender: VALID_ADDRESS_1,
        firstValid: 1000n,
        lastValid: 2000n,
        payment: {
          amount: 1000n,
          receiver: VALID_ADDRESS_1,
        },
      }

      expect(() => validateTransaction(transaction)).not.toThrow()
    })

    test.each([
      ['encodeTransaction', encodeTransaction],
      ['encodeTransactionRaw', encodeTransactionRaw],
      ['estimateTransactionSize', estimateTransactionSize],
      ['getTransactionIdRaw', getTransactionIdRaw],
      ['getTransactionId', getTransactionId],
      ['encodeSignedTransaction', (transaction: Transaction) => encodeSignedTransaction({ txn: transaction, signature: EMPTY_SIGNATURE })],
    ])('should validate when calling %s', (_, sut) => {
      const transaction: Transaction = {
        type: TransactionType.AssetTransfer,
        sender: VALID_ADDRESS_1,
        firstValid: 1000n,
        lastValid: 2000n,
        assetTransfer: {
          assetId: 0n,
          amount: 1000n,
          receiver: VALID_ADDRESS_1,
        },
      }

      expect(() => sut(transaction)).toThrow('Asset transfer validation failed: Asset ID must not be 0')
    })
  })
})
