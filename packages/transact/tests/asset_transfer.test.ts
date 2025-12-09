import { Address } from '@algorandfoundation/algokit-common'
import { describe, expect, test } from 'vitest'
import { Transaction, validateTransaction } from '../src/transactions/transaction'
import { TransactionType } from '../src/transactions/transaction-type'
import { testData } from './common'
import {
  assertAssignFee,
  assertDecodeWithPrefix,
  assertDecodeWithoutPrefix,
  assertEncode,
  assertEncodeWithAuthAddress,
  assertEncodeWithSignature,
  assertEncodedTransactionType,
  assertExample,
  assertMultisigExample,
  assertTransactionId,
} from './transaction_asserts'

const txnTestData = Object.entries({
  ['asset opt-in']: testData.optInAssetTransfer,
})

describe('AssetTransfer', () => {
  // Polytest Suite: AssetTransfer

  describe('Transaction Tests', () => {
    // Polytest Group: Transaction Tests

    for (const [label, testData] of txnTestData) {
      test('example', async () => {
        await assertExample(label, testData)
      })

      test('multisig example', async () => {
        await assertMultisigExample(label, testData)
      })

      test('get transaction id', () => {
        assertTransactionId(label, testData)
      })

      test('assign fee', () => {
        assertAssignFee(label, testData)
      })

      test('get encoded transaction type', () => {
        assertEncodedTransactionType(label, testData)
      })

      test('decode without prefix', () => {
        assertDecodeWithoutPrefix(label, testData)
      })

      test('decode with prefix', () => {
        assertDecodeWithPrefix(label, testData)
      })

      test('encode with auth address', async () => {
        await assertEncodeWithAuthAddress(label, testData)
      })

      test('encode with signature', () => {
        assertEncodeWithSignature(label, testData)
      })

      test('encode', () => {
        assertEncode(label, testData)
      })
    }
  })

  describe('Asset Transfer Validation', () => {
    test('should throw error when asset ID is zero', () => {
      const transaction = new Transaction({
        type: TransactionType.AssetTransfer,
        sender: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'),
        firstValid: 1000n,
        lastValid: 2000n,
        assetTransfer: {
          assetId: 0n, // Invalid asset ID
          amount: 1000n,
          receiver: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'),
        },
      })

      expect(() => validateTransaction(transaction)).toThrow('Asset transfer validation failed: Asset ID must not be 0')
    })

    test('should validate valid asset transfer transaction', () => {
      const transaction = new Transaction({
        type: TransactionType.AssetTransfer,
        sender: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'),
        firstValid: 1000n,
        lastValid: 2000n,
        assetTransfer: {
          assetId: 123n,
          amount: 1000n,
          receiver: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'),
        },
      })

      expect(() => validateTransaction(transaction)).not.toThrow()
    })

    test('should validate asset opt-in transaction', () => {
      const senderAddress = Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA')
      const transaction = new Transaction({
        type: TransactionType.AssetTransfer,
        sender: senderAddress,
        firstValid: 1000n,
        lastValid: 2000n,
        assetTransfer: {
          assetId: 123n,
          amount: 0n, // Opt-in has 0 amount
          receiver: senderAddress, // Self-opt-in
        },
      })

      expect(() => validateTransaction(transaction)).not.toThrow()
    })

    test('should validate asset transfer with clawback', () => {
      const transaction = new Transaction({
        type: TransactionType.AssetTransfer,
        sender: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'), // Clawback address
        firstValid: 1000n,
        lastValid: 2000n,
        assetTransfer: {
          assetId: 123n,
          amount: 1000n,
          receiver: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'),
          assetSender: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'), // Clawback from this address
        },
      })

      expect(() => validateTransaction(transaction)).not.toThrow()
    })

    test('should validate asset opt-out transaction', () => {
      const transaction = new Transaction({
        type: TransactionType.AssetTransfer,
        sender: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'),
        firstValid: 1000n,
        lastValid: 2000n,
        assetTransfer: {
          assetId: 123n,
          amount: 1000n,
          receiver: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'),
          closeRemainderTo: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'), // Close remainder to this address
        },
      })

      expect(() => validateTransaction(transaction)).not.toThrow()
    })

    test('should validate asset transfer with both clawback and close remainder', () => {
      const transaction = new Transaction({
        type: TransactionType.AssetTransfer,
        sender: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'),
        firstValid: 1000n,
        lastValid: 2000n,
        assetTransfer: {
          assetId: 123n,
          amount: 1000n,
          receiver: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'),
          assetSender: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'), // Clawback from this address
          closeRemainderTo: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'), // Close remainder to this address
        },
      })

      expect(() => validateTransaction(transaction)).not.toThrow()
    })

    test('should validate asset transfer to self', () => {
      const senderAddress = Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA')
      const transaction = new Transaction({
        type: TransactionType.AssetTransfer,
        sender: senderAddress,
        firstValid: 1000n,
        lastValid: 2000n,
        assetTransfer: {
          assetId: 123n,
          amount: 1000n,
          receiver: senderAddress, // Self-transfer
        },
      })

      expect(() => validateTransaction(transaction)).not.toThrow()
    })

    test('should validate asset close-out transaction (zero amount with close remainder)', () => {
      const transaction = new Transaction({
        type: TransactionType.AssetTransfer,
        sender: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'),
        firstValid: 1000n,
        lastValid: 2000n,
        assetTransfer: {
          assetId: 123n,
          amount: 0n, // Zero amount
          receiver: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'),
          closeRemainderTo: Address.fromString('XBYLS2E6YI6XXL5BWCAMOA4GTWHXWENZMX5UHXMRNWWUQ7BXCY5WC5TEPA'), // Close out asset holding
        },
      })

      expect(() => validateTransaction(transaction)).not.toThrow()
    })
  })
})
