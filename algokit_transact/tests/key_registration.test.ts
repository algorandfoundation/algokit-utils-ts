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
  ['online key registration']: testData.onlineKeyRegistration,
  ['offline key registration']: testData.offlineKeyRegistration,
  ['non-participation key registration']: testData.nonParticipationKeyRegistration,
})

describe('Key Registration', () => {
  // Polytest Suite: Key Registration

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

      test("encode with signature", async () => {
        await assertEncodeWithSignature(label, testData)
      })

      test("encode", () => {
        assertEncode(label, testData)
      })
    }
  })

  describe('Key Registration Validation', () => {
    describe('Online Key Registration Validation', () => {
      test('should throw error when vote key is missing for online registration', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            // voteKey: missing - should cause error
            selectionKey: new Uint8Array(32),
            stateProofKey: new Uint8Array(64),
            voteFirst: 1000n,
            voteLast: 2000n,
            voteKeyDilution: 10000n,
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Key registration validation failed: Vote key is required')
      })

      test('should throw error when selection key is missing for online registration', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            voteKey: new Uint8Array(32),
            // selectionKey: missing - should cause error
            stateProofKey: new Uint8Array(64),
            voteFirst: 1000n,
            voteLast: 2000n,
            voteKeyDilution: 10000n,
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Key registration validation failed: Selection key is required')
      })

      test('should throw error when state proof key is missing for online registration', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            voteKey: new Uint8Array(32),
            selectionKey: new Uint8Array(32),
            // stateProofKey: missing - should cause error
            voteFirst: 1000n,
            voteLast: 2000n,
            voteKeyDilution: 10000n,
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Key registration validation failed: State proof key is required')
      })

      test('should throw error when vote first is missing for online registration', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            voteKey: new Uint8Array(32),
            selectionKey: new Uint8Array(32),
            stateProofKey: new Uint8Array(64),
            // voteFirst: missing - should cause error
            voteLast: 2000n,
            voteKeyDilution: 10000n,
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Key registration validation failed: Vote first is required')
      })

      test('should throw error when vote last is missing for online registration', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            voteKey: new Uint8Array(32),
            selectionKey: new Uint8Array(32),
            stateProofKey: new Uint8Array(64),
            voteFirst: 1000n,
            // voteLast: missing - should cause error
            voteKeyDilution: 10000n,
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Key registration validation failed: Vote last is required')
      })

      test('should throw error when vote key dilution is missing for online registration', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            voteKey: new Uint8Array(32),
            selectionKey: new Uint8Array(32),
            stateProofKey: new Uint8Array(64),
            voteFirst: 1000n,
            voteLast: 2000n,
            // voteKeyDilution: missing - should cause error
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Key registration validation failed: Vote key dilution is required')
      })

      test('should throw error when vote first is equal to vote last', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            voteKey: new Uint8Array(32),
            selectionKey: new Uint8Array(32),
            stateProofKey: new Uint8Array(64),
            voteFirst: 2000n, // Equal to vote last
            voteLast: 2000n,
            voteKeyDilution: 10000n,
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Key registration validation failed: Vote first must be less than vote last')
      })

      test('should throw error when vote first is greater than vote last', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            voteKey: new Uint8Array(32),
            selectionKey: new Uint8Array(32),
            stateProofKey: new Uint8Array(64),
            voteFirst: 3000n, // Greater than vote last
            voteLast: 2000n,
            voteKeyDilution: 10000n,
          },
        }

        expect(() => validateTransaction(transaction)).toThrow('Key registration validation failed: Vote first must be less than vote last')
      })

      test('should throw error when non participation is set for online registration', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            voteKey: new Uint8Array(32),
            selectionKey: new Uint8Array(32),
            stateProofKey: new Uint8Array(64),
            voteFirst: 1000n,
            voteLast: 2000n,
            voteKeyDilution: 10000n,
            nonParticipation: true, // Invalid for online registration
          },
        }

        expect(() => validateTransaction(transaction)).toThrow(
          'Key registration validation failed: Online key registration cannot have non participation flag set',
        )
      })

      test('should throw multiple errors for online registration with multiple missing fields', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            // voteKey: missing - ERROR 1
            // selectionKey: missing - ERROR 2
            // stateProofKey: missing - ERROR 3
            voteFirst: 2000n, // Greater than vote last - ERROR 4
            voteLast: 1000n,
            // voteKeyDilution: missing - ERROR 5
            nonParticipation: true, // Invalid for online - ERROR 6
          },
        }

        try {
          validateTransaction(transaction)
        } catch (error) {
          const errorMessage = (error as Error).message
          expect(errorMessage).toContain('Key registration validation failed:')
          expect(errorMessage).toContain('Vote key is required')
          expect(errorMessage).toContain('Selection key is required')
          expect(errorMessage).toContain('State proof key is required')
          expect(errorMessage).toContain('Vote first must be less than vote last')
          expect(errorMessage).toContain('Vote key dilution is required')
          expect(errorMessage).toContain('Online key registration cannot have non participation flag set')
        }
      })

      test('should validate valid online key registration transaction', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            voteKey: new Uint8Array(32),
            selectionKey: new Uint8Array(32),
            stateProofKey: new Uint8Array(64),
            voteFirst: 1000n,
            voteLast: 2000n,
            voteKeyDilution: 10000n,
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })

      test('should validate online key registration with non participation false', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            voteKey: new Uint8Array(32),
            selectionKey: new Uint8Array(32),
            stateProofKey: new Uint8Array(64),
            voteFirst: 1000n,
            voteLast: 2000n,
            voteKeyDilution: 10000n,
            nonParticipation: false, // Explicitly false is OK
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })
    })

    describe('Offline Key Registration Validation', () => {
      test('should validate offline key registration (no fields)', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            // No fields set - this is a valid offline registration
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })

      test('should validate offline key registration with non participation', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            nonParticipation: true, // Valid for offline registration
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })

      test('should validate offline key registration with non participation false', () => {
        const transaction: Transaction = {
          transactionType: TransactionType.KeyRegistration,
          sender: '424ZV7KBBUJ52DUKP2KLQ6I5GBOHKBXOW7Q7UQIOOYNDWYRM4EKOSMVVRI',
          firstValid: 1000n,
          lastValid: 2000n,
          keyRegistration: {
            nonParticipation: false, // Valid for offline registration
          },
        }

        expect(() => validateTransaction(transaction)).not.toThrow()
      })
    })
  })
})
