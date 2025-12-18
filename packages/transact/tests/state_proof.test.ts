import { describe, test } from 'vitest'
import { testData } from './common'
import {
  assertAssignFee,
  assertDecodeWithoutPrefix,
  assertDecodeWithPrefix,
  assertEncode,
  assertEncodedTransactionType,
  assertEncodeWithSignature,
  assertExample,
  assertTransactionId,
} from './transaction_asserts'

const txnTestData = Object.entries({
  ['state proof']: testData.stateProof,
})

describe('State Proof', () => {
  // Polytest Suite: State Proof

  describe('Transaction Tests', () => {
    // Polytest Group: Transaction Tests

    for (const [label, testData] of txnTestData) {
      test('example', async () => {
        await assertExample(label, testData)
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

      test('encode with signature', async () => {
        await assertEncodeWithSignature(label, testData)
      })

      test('encode', () => {
        assertEncode(label, testData)
      })
    }
  })
})
