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
  assertMultisigExample,
  assertTransactionId,
} from '../../../../tests/core/transaction_asserts'

const txnTestData = Object.entries({
  ['asset create']: testData.assetCreate,
  ['asset reconfigure']: testData.assetReconfigure,
  ['asset destroy']: testData.assetDestroy,
})

describe('AssetConfig', () => {
  // Polytest Suite: AssetConfig

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
})
