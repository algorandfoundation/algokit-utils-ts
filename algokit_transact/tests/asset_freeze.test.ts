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
  assertTransactionId,
} from './transaction_asserts'
import { Transaction, TransactionType, validateTransaction } from '../src/transactions/transaction'

const freezeTestData = Object.entries({
  freeze: testData.assetFreeze,
  unfreeze: testData.assetUnfreeze,
})

describe('Asset Freeze', () => {
  // Polytest Suite: Asset Freeze

  describe('Transaction Tests', () => {
    // Polytest Group: Transaction Tests

    for (const [label, testData] of freezeTestData) {
      test("example", async () => {
        await assertExample(label, testData)
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

  describe('Asset Freeze Validation', () => {
    test('should throw error when asset ID is zero', () => {
      const transaction: Transaction = {
        transactionType: TransactionType.AssetFreeze,
        sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
        firstValid: 1000n,
        lastValid: 2000n,
        assetFreeze: {
          assetId: 0n, // Invalid asset ID
          freezeTarget: 'ADSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK',
          frozen: true,
        },
      }

      expect(() => validateTransaction(transaction)).toThrow('Asset freeze validation failed: Asset ID must not be 0')
    })

    test('should validate valid asset freeze transaction', () => {
      const transaction: Transaction = {
        transactionType: TransactionType.AssetFreeze,
        sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
        firstValid: 1000n,
        lastValid: 2000n,
        assetFreeze: {
          assetId: 123n, // Valid asset ID
          freezeTarget: 'ADSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK',
          frozen: true,
        },
      }

      expect(() => validateTransaction(transaction)).not.toThrow()
    })

    test('should validate asset unfreeze transaction', () => {
      const transaction: Transaction = {
        transactionType: TransactionType.AssetFreeze,
        sender: 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA',
        firstValid: 1000n,
        lastValid: 2000n,
        assetFreeze: {
          assetId: 123n,
          freezeTarget: 'ADSFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFKJSDFK',
          frozen: false, // Unfreeze
        },
      }

      expect(() => validateTransaction(transaction)).not.toThrow()
    })

    test('should validate freezing the sender themselves', () => {
      const senderAddress = 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'
      const transaction: Transaction = {
        transactionType: TransactionType.AssetFreeze,
        sender: senderAddress,
        firstValid: 1000n,
        lastValid: 2000n,
        assetFreeze: {
          assetId: 123n,
          freezeTarget: senderAddress, // Freeze self
          frozen: true,
        },
      }

      expect(() => validateTransaction(transaction)).not.toThrow()
    })

    test('should validate unfreezing the sender themselves', () => {
      const senderAddress = 'XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'
      const transaction: Transaction = {
        transactionType: TransactionType.AssetFreeze,
        sender: senderAddress,
        firstValid: 1000n,
        lastValid: 2000n,
        assetFreeze: {
          assetId: 123n,
          freezeTarget: senderAddress, // Unfreeze self
          frozen: false,
        },
      }

      expect(() => validateTransaction(transaction)).not.toThrow()
    })
  })
})
