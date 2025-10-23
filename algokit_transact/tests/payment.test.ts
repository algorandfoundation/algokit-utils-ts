import { describe, expect, test } from 'vitest'
import { testData } from './common'
import {
  assertAssignFee,
  assertDecodeWithoutPrefix,
  assertDecodeWithPrefix,
  assertEncode,
  assertEncodedTransactionType,
  assertEncodeWithAuthAddress,
  assertEncodeWithSignature,
  assertExample,
  assertMultisigExample,
  assertTransactionId,
} from './transaction_asserts'
import { Transaction, TransactionType, validateTransaction } from '../src/transactions/transaction'

const txnTestData = Object.entries({
  ['payment']: testData.simplePayment,
})

describe('Payment', () => {
  // Polytest Suite: Payment

  describe('Transaction Tests', () => {
    // Polytest Group: Transaction Tests

    for (const [label, testData] of txnTestData) {
      test("example", async () => {
        await assertExample(label, testData)
      })

      test("multisig example", async () => {
        await assertMultisigExample(label, testData)
      })

      test("get transaction id", () => {
        assertTransactionId(label, testData)
      })

      test("assign fee", () => {
        assertAssignFee(label, testData)
      })

      test("get encoded transaction type", () => {
        assertEncodedTransactionType(label, testData)
      })

      test("decode without prefix", () => {
        assertDecodeWithoutPrefix(label, testData)
      })

      test("decode with prefix", () => {
        assertDecodeWithPrefix(label, testData)
      })

      test("encode with auth address", async () => {
        await assertEncodeWithAuthAddress(label, testData)
      })

      test("encode with signature", () => {
        assertEncodeWithSignature(label, testData)
      })

      test("encode", () => {
        assertEncode(label, testData)
      })
    }
  })

  describe('Payment Transaction Validation', () => {
    test('should validate valid payment transaction', () => {
      const transaction: Transaction = {
        transactionType: TransactionType.Payment,
        sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
        firstValid: 1000n,
        lastValid: 2000n,
        payment: {
          amount: 1000000n, // 1 ALGO
          receiver: 'ADSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK',
        },
      }

      expect(() => validateTransaction(transaction)).not.toThrow()
    })

    test('should validate payment transaction with zero amount', () => {
      const transaction: Transaction = {
        transactionType: TransactionType.Payment,
        sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
        firstValid: 1000n,
        lastValid: 2000n,
        payment: {
          amount: 0n, // Zero payment is allowed
          receiver: 'ADSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK',
        },
      }

      expect(() => validateTransaction(transaction)).not.toThrow()
    })

    test('should validate payment transaction with close remainder', () => {
      const transaction: Transaction = {
        transactionType: TransactionType.Payment,
        sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
        firstValid: 1000n,
        lastValid: 2000n,
        payment: {
          amount: 500000n, // 0.5 ALGO
          receiver: 'ADSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK',
          closeRemainderTo: 'BNSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK', // Close account
        },
      }

      expect(() => validateTransaction(transaction)).not.toThrow()
    })

    test('should validate self-payment transaction', () => {
      const senderAddress = 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'
      const transaction: Transaction = {
        transactionType: TransactionType.Payment,
        sender: senderAddress,
        firstValid: 1000n,
        lastValid: 2000n,
        payment: {
          amount: 1000000n,
          receiver: senderAddress, // Self-payment
        },
      }

      expect(() => validateTransaction(transaction)).not.toThrow()
    })
  })
})
