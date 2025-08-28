import { describe, test } from 'vitest'
import { testData } from '../../../../tests/core/common'
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
} from '../../../../tests/core/transaction_asserts'

const freezeTestData = Object.entries({
  freeze: testData.assetFreeze,
  unfreeze: testData.assetUnfreeze,
})

describe('Asset Freeze', () => {
  // Polytest Suite: Asset Freeze

  describe('Transaction Tests', () => {
    // Polytest Group: Transaction Tests

    for (const [label, testData] of freezeTestData) {
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
})
